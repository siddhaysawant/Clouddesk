# CloudDesk — Firebase Cloud Sync Setup

Your code now syncs task/history/analytics/email data to Firestore under
your Google account, so opening CloudDesk on any device shows the same data.
Three things need to be done once in the Firebase Console before it works.

## 1. Enable Google Sign-In

Firebase Console → your project (`clouddesk-a14ec`) → **Build → Authentication**
→ **Sign-in method** tab → click **Google** → toggle **Enable** → pick a
support email → **Save**.

## 2. Create the Firestore database (if you haven't already)

Firebase Console → **Build → Firestore Database** → **Create database** →
choose a region close to you (e.g. `asia-south1` for Mumbai) → start in
**Production mode** (the rules file below locks it down properly, so
production mode is fine and safer than test mode).

## 3. Deploy the security rules

The included `firestore.rules` restricts each signed-in user to reading and
writing *only* their own document — nobody can see anyone else's data, and
signed-out requests are rejected outright.

Easiest path — paste manually:
Firebase Console → **Firestore Database → Rules** tab → replace the contents
with what's in `firestore.rules` → **Publish**.

Or, if you use the Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # point it at the existing clouddesk-a14ec project
firebase deploy --only firestore:rules
```

## 4. Add your domain to authorized domains (only matters once you deploy)

Firebase Console → **Authentication → Settings → Authorized domains**.
`localhost` is there by default. Once you push this to GitHub Pages (or
wherever), add that domain here too (e.g. `yourusername.github.io`) or the
Google sign-in popup will fail with an `unauthorized-domain` error.

---

## How it works

- **`firebase-sync.js`** — new file. Handles Google Sign-In and a Firestore
  read/write layer. Exposes `window.CloudSync`.
- **`script.js`** — the existing `save()` helper now also calls
  `CloudSync.notifyLocalChange()` after every localStorage write. That's a
  one-line change; everything else (tasks, history, streak, category stats,
  emails, theme) already flowed through `save()`, so it's all covered.
- **Local-first**: every read/write still hits `localStorage` instantly —
  the UI never waits on the network. Firestore writes are debounced (800ms)
  and pushed in the background.
- **On sign-in**: cloud data (if any exists for that account) overwrites
  local data — the cloud copy is the cross-device source of truth. First
  time signing in on a fresh browser with existing local data, that local
  data gets pushed up to seed the cloud doc instead.
- **Live sync**: a Firestore `onSnapshot` listener means if you have
  CloudDesk open on your phone and laptop at once, changes on one appear on
  the other without a manual refresh.
- **Data isolation**: each user's data lives at
  `clouddesk_users/{their-firebase-uid}` — the security rules make sure only
  that account can read or write it.

## Before you push to GitHub

Your Firebase config (`apiKey`, etc.) is safe to commit — Firebase web API
keys aren't secrets, they just identify the project; the security rules are
what actually protect the data. Just make sure step 3 above (deploying the
rules) is done *before* or immediately after your first push, so the
database isn't sitting open in test mode.
