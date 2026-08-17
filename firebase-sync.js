/* ===================================================
   CLOUDDESK — Firebase Cloud Sync
   firebase-sync.js

   Handles: Google Sign-In auth + Firestore read/write for
   the data that needs to follow you across devices
   (history, category stats, streak, question cycle,
   today's tasks/data, emails, theme).

   Design: localStorage stays the instant local cache (so the
   UI never waits on a network round-trip). Firestore is the
   source of truth that gets pulled on login and pushed on
   every change. This file exposes a tiny API on
   `window.CloudSync` that script.js calls into.
   =================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGo8z9-IL6VjlFMAiH5JOnRohULRRzF1o",
  authDomain: "clouddesk-a14ec.firebaseapp.com",
  projectId: "clouddesk-a14ec",
  storageBucket: "clouddesk-a14ec.firebasestorage.app",
  messagingSenderId: "244246720499",
  appId: "1:244246720499:web:967b6d58fe3d76c9b2ec86",
  measurementId: "G-JT1NGEMMBV",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const provider = new GoogleAuthProvider();

// Keys that live in Firestore (mirrors KEYS in script.js, minus purely
// device-local / ephemeral stuff like clock intervals).
const SYNCED_KEYS = [
  "cd_emails",
  "cd_today_tasks",
  "cd_today_data",
  "cd_history",
  "cd_streak",
  "cd_question_cycle",
  "cd_used_questions",
  "cd_session",
  "cd_category_stats",
  "cd_theme",
  "cd_email_schema_v2",
];

let currentUser = null;
let unsubscribeSnapshot = null;
let suppressNextRemoteEcho = false; // avoid re-writing what we just wrote
let pendingWrite = null;
let writeTimer = null;

function userDocRef(uid) {
  return doc(db, "clouddesk_users", uid);
}

// ---------- local mirror helpers (talk to the SAME localStorage script.js uses) ----------
function readLocal(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
}
function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* ignore quota errors */
  }
}

function snapshotLocalData() {
  const data = {};
  SYNCED_KEYS.forEach((k) => {
    const v = readLocal(k);
    if (v !== null) data[k] = v;
  });
  // also sweep any per-day task-timer snapshots (cd_task_timers_YYYY-MM-DD)
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("cd_task_timers_")) {
      data[k] = readLocal(k);
    }
  }
  return data;
}

function applyRemoteDataToLocal(remoteData) {
  if (!remoteData) return;
  Object.keys(remoteData).forEach((k) => {
    if (k === "_updatedAt") return;
    writeLocal(k, remoteData[k]);
  });
}

// ---------- debounced push to Firestore ----------
function scheduleCloudWrite() {
  if (!currentUser) return;
  pendingWrite = snapshotLocalData();
  clearTimeout(writeTimer);
  writeTimer = setTimeout(flushCloudWrite, 800);
}

async function flushCloudWrite() {
  if (!currentUser || !pendingWrite) return;
  const payload = { ...pendingWrite, _updatedAt: serverTimestamp() };
  pendingWrite = null;
  suppressNextRemoteEcho = true;
  try {
    await setDoc(userDocRef(currentUser.uid), payload, { merge: true });
  } catch (e) {
    console.error("CloudDesk: cloud write failed", e);
  }
}

// Push immediately (used on page unload / explicit calls)
async function flushNow() {
  clearTimeout(writeTimer);
  if (pendingWrite) await flushCloudWrite();
}

// ---------- public API ----------
const CloudSync = {
  status: "initializing", // 'initializing' | 'signed-out' | 'signing-in' | 'syncing' | 'synced' | 'error'
  user: null,
  authResolved: false, // true once Firebase has told us the real initial auth state
  dataReadyFired: false, // true once onDataReady has fired at least once for the current session
  onStatusChange: null, // callback(status, user)
  onDataReady: null, // callback() fired once initial cloud data has been merged into localStorage

  setStatus(s) {
    this.status = s;
    if (typeof this.onStatusChange === "function") this.onStatusChange(s, this.user);
  },

  // script.js calls this right after attaching onStatusChange/onDataReady,
  // in case Firebase's auth callback already fired before those were set
  // (module scripts execute async, so this race is real, not theoretical).
  replayCurrentState() {
    if (typeof this.onStatusChange === "function") this.onStatusChange(this.status, this.user);
    if (this.dataReadyFired && typeof this.onDataReady === "function") this.onDataReady();
  },

  async signIn() {
    this.setStatus("signing-in");
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged handles the rest
    } catch (e) {
      console.error("CloudDesk: sign-in failed", e);
      this.setStatus("error");
    }
  },

  async signOutUser() {
    await flushNow();
    if (unsubscribeSnapshot) unsubscribeSnapshot();
    await signOut(auth);
  },

  // Call this after ANY save() in script.js touches a synced key.
  notifyLocalChange() {
    scheduleCloudWrite();
  },

  flushNow,
};

// Wire up auth state
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  CloudSync.user = user;
  CloudSync.authResolved = true;

  if (!user) {
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }
    CloudSync.dataReadyFired = false;
    CloudSync.setStatus("signed-out");
    return;
  }

  CloudSync.setStatus("syncing");

  // One-time pull + merge: cloud data wins if it exists (it's the cross-device
  // source of truth); otherwise we seed the cloud from whatever's local.
  try {
    const snap = await getDoc(userDocRef(user.uid));
    if (snap.exists()) {
      applyRemoteDataToLocal(snap.data());
    } else {
      // First time this account has used CloudDesk — push up current local state.
      pendingWrite = snapshotLocalData();
      await flushCloudWrite();
    }
  } catch (e) {
    console.error("CloudDesk: initial sync failed", e);
    CloudSync.setStatus("error");
    return; // don't mark dataReady/synced on failure — stay on the sign-in gate
  }

  CloudSync.dataReadyFired = true;
  if (typeof CloudSync.onDataReady === "function") CloudSync.onDataReady();
  CloudSync.setStatus("synced");

  // Live listener: if you have CloudDesk open on two devices, changes on one
  // reflect on the other without a refresh.
  unsubscribeSnapshot = onSnapshot(userDocRef(user.uid), (snap) => {
    if (!snap.exists()) return;
    if (suppressNextRemoteEcho) {
      // this snapshot is almost certainly the echo of our own write
      suppressNextRemoteEcho = false;
      return;
    }
    applyRemoteDataToLocal(snap.data());
    if (typeof CloudSync.onDataReady === "function") CloudSync.onDataReady();
  });
});

// Best-effort flush when the tab is closing
window.addEventListener("beforeunload", () => {
  if (pendingWrite && currentUser) {
    // Not guaranteed to finish, but Firestore SDK queues writes and
    // will usually flush this in time for a normal tab close.
    flushCloudWrite();
  }
});

window.CloudSync = CloudSync;
