/* ===================================================
   CLOUDDESK — Professional Productivity Dashboard
   script.js
   =================================================== */

'use strict';

// ===================== QUESTION DATABASE =====================
const QUESTIONS = [
  {
    id:1, question:"Your company needs to run a web application that must scale automatically based on traffic load. Which AWS compute service is most appropriate for hosting containerised microservices with automatic scaling?",
    answer:"Amazon ECS with Fargate removes the need to provision servers; it launches containers on-demand and integrates natively with Application Load Balancer and AWS Auto Scaling, making it the right fit for traffic-driven scaling of microservices.",
    category:"AWS Services", difficulty:"Medium",
    task:"Research and document how Amazon ECS Fargate handles horizontal auto-scaling. Note the difference between ECS task-level scaling and ECS service-level scaling, and write a brief internal note explaining which alarms you would configure in CloudWatch to trigger each."
  },
  {
    id:2, question:"A security audit reveals that several IAM users have permissions they have never used. What AWS tool should you use to identify and remove these excess permissions?",
    answer:"IAM Access Analyzer generates access reports showing the last time each permission was used. Combining this with IAM credential reports lets you safely remove unused permissions and enforce least privilege.",
    category:"Security", difficulty:"Medium",
    task:"Review the IAM Access Analyzer documentation and draft a checklist that a junior engineer can follow to identify over-privileged users, remove unused permissions, and verify the change did not break any active workloads."
  },
  {
    id:3, question:"A startup wants to minimise infrastructure costs for a batch job that runs for two hours every morning and can tolerate interruption. Which EC2 pricing model should they use?",
    answer:"Spot Instances offer up to 90% discount over On-Demand pricing. Because the batch job can be checkpointed and restarted, Spot is the correct choice; the startup saves cost while accepting the risk of instance reclamation.",
    category:"Billing & Pricing", difficulty:"Easy",
    task:"Prepare a cost-comparison document for a two-hour daily batch job using three EC2 pricing models: On-Demand, Reserved (1-year), and Spot. Include estimated monthly cost for a c5.xlarge and note any architectural changes needed to tolerate Spot interruption."
  },
  {
    id:4, question:"Your organisation wants to ensure that no single AWS account can accidentally delete critical S3 buckets containing compliance data. Which AWS feature should be enabled?",
    answer:"S3 Object Lock in Compliance mode prevents any user, including the root account, from deleting objects before the retention period expires. Enabling MFA Delete on the bucket adds an additional layer of protection for the bucket itself.",
    category:"Security", difficulty:"Hard",
    task:"Write a runbook for enabling S3 Object Lock and MFA Delete on an existing S3 bucket. Include the exact sequence of API calls or console steps, note which operations require root credentials, and describe how to verify the lock is working correctly."
  },
  {
    id:5, question:"An e-commerce platform needs to cache database query results to reduce latency and database load. Which AWS managed caching service supports both Memcached and Redis engines?",
    answer:"Amazon ElastiCache supports both Memcached (simple, horizontal scaling) and Redis (advanced data structures, persistence, replication). For session storage and sorted sets, Redis is preferred; for pure caching throughput, Memcached is sufficient.",
    category:"AWS Services", difficulty:"Easy",
    task:"Document the criteria for choosing between ElastiCache for Redis and ElastiCache for Memcached. Create a two-column decision guide that maps specific application requirements (persistence, pub/sub, sorted sets, multi-threading) to the correct engine choice."
  },
  {
    id:6, question:"A global media company distributes video content to users in 50 countries. Which AWS service reduces latency by caching content at locations close to end users?",
    answer:"Amazon CloudFront is AWS's Content Delivery Network. It caches content at over 400 edge locations worldwide, reducing round-trip latency for end users and offloading origin server traffic, which also reduces cost.",
    category:"Architecture", difficulty:"Easy",
    task:"Design a CloudFront distribution configuration for a video-on-demand platform. Specify origin settings, cache behaviour rules for different content types (HLS segments vs HTML pages), TTL values, and which CloudFront features you would enable to protect against DDoS attacks."
  },
  {
    id:7, question:"Your team needs to monitor AWS API calls made in your account for compliance auditing, including who made each call, when, and from which IP address. Which service provides this?",
    answer:"AWS CloudTrail records every API call made in your account, capturing the caller identity, time, source IP, request parameters, and response. Trails can be configured to deliver logs to S3 and CloudWatch Logs for long-term retention and alerting.",
    category:"Monitoring", difficulty:"Easy",
    task:"Configure a CloudTrail trail that satisfies a compliance requirement: all API calls must be logged, logs must be immutable, and any attempt to disable the trail must trigger an alert. Document each configuration step and the CloudWatch metric filter you would create."
  },
  {
    id:8, question:"A development team deploys Lambda functions and needs to track application errors, set alarm thresholds, and create dashboards showing invocation counts and durations. Which AWS service handles this?",
    answer:"Amazon CloudWatch collects Lambda metrics (invocations, errors, duration, throttles) by default. You can create custom dashboards, set alarms on error rate, and use CloudWatch Logs Insights to query Lambda log streams for debugging.",
    category:"Monitoring", difficulty:"Easy",
    task:"Set up a CloudWatch dashboard for a Lambda-based API. List the five metrics you would display, write the alarm condition for error rate, and describe how you would use CloudWatch Logs Insights to find the root cause of a spike in 500 errors."
  },
  {
    id:9, question:"A financial services company must ensure data stored in S3 is encrypted at rest using a key that they control and can rotate annually. Which AWS service manages these cryptographic keys?",
    answer:"AWS Key Management Service (KMS) allows you to create Customer Managed Keys (CMKs), define rotation schedules, control who can use or administer the key via key policies, and integrate with S3 server-side encryption (SSE-KMS).",
    category:"Security", difficulty:"Medium",
    task:"Write a key management policy document for a financial application. Include: KMS key creation steps, the key policy JSON granting access only to specific IAM roles, automatic annual rotation configuration, and the S3 bucket policy enforcement requiring SSE-KMS on all PUT operations."
  },
  {
    id:10, question:"A company is migrating from a single-region architecture to a multi-region active-active setup for disaster recovery. Which Route 53 routing policy supports this by distributing traffic across multiple regions and failing over automatically?",
    answer:"Route 53 Latency-based routing combined with Health Checks routes users to the region with the lowest latency and automatically removes unhealthy endpoints from DNS responses. For active-active failover, this is combined with Failover routing or Geoproximity routing depending on requirements.",
    category:"Architecture", difficulty:"Hard",
    task:"Design a multi-region active-active DNS architecture using Route 53. Specify which routing policies to combine, how health checks should be configured (endpoint type, intervals, failure thresholds), and describe the sequence of events that occurs when one region becomes unhealthy."
  },
  {
    id:11, question:"Your organisation wants to enforce that all new AWS accounts created in the company follow specific security baselines, such as requiring MFA and disabling root access. Which AWS feature enforces these guardrails?",
    answer:"AWS Organizations with Service Control Policies (SCPs) lets you attach policies to organisational units that restrict what actions member accounts can perform, regardless of their individual IAM permissions. AWS Control Tower builds on this with pre-configured guardrails.",
    category:"Security", difficulty:"Medium",
    task:"Draft a Service Control Policy (SCP) in JSON that: prevents any account in the organisation from disabling CloudTrail, prevents creation of IAM users without MFA enabled, and denies all actions if the request comes from outside approved AWS regions. Include comments explaining each statement."
  },
  {
    id:12, question:"A team runs an RDS MySQL database and needs to ensure zero downtime during planned maintenance windows and automatic failover during unexpected instance failures. Which RDS feature provides this?",
    answer:"RDS Multi-AZ deploys a synchronous standby replica in a different Availability Zone. During failover (maintenance or failure), RDS automatically updates the DNS endpoint to point to the standby, typically completing within 60-120 seconds without manual intervention.",
    category:"Architecture", difficulty:"Medium",
    task:"Document the RDS Multi-AZ failover process for a production MySQL database. Include: how to enable Multi-AZ on an existing instance, what happens to in-flight transactions during failover, how to test failover without causing real downtime, and what monitoring to put in place to detect and respond to failover events."
  },
  {
    id:13, question:"A data analytics team stores petabytes of raw data in S3 and needs to query it directly using SQL without loading it into a database. Which AWS service enables this?",
    answer:"Amazon Athena is a serverless, interactive query service that uses standard SQL to query data directly in S3. It supports formats including Parquet, ORC, CSV, and JSON. You pay only per terabyte of data scanned, making it cost-effective for ad-hoc analytics.",
    category:"AWS Services", difficulty:"Medium",
    task:"Design a data analytics pipeline using Athena. Specify the S3 folder structure and partitioning strategy that minimises data scanned per query, the table schema in Glue Data Catalog, and write three example SQL queries the team would run against a sample web access log dataset."
  },
  {
    id:14, question:"A company needs to decouple a high-throughput order processing system so that the order intake layer can scale independently from the fulfilment layer, without losing messages during traffic spikes. Which AWS service is best suited?",
    answer:"Amazon SQS provides a fully managed message queue. Producers write orders to the queue; consumers process them independently. SQS guarantees at-least-once delivery, scales automatically, and retains messages for up to 14 days, preventing loss during downstream outages.",
    category:"Architecture", difficulty:"Medium",
    task:"Design an order processing architecture using SQS. Specify queue type (Standard vs FIFO), visibility timeout value, Dead Letter Queue configuration, and describe how the fulfilment service should handle duplicate messages. Include a diagram description showing how the components connect."
  },
  {
    id:15, question:"Your DevOps team needs to automate infrastructure provisioning consistently across development, staging, and production environments, using code stored in a version control system. Which AWS service supports Infrastructure as Code?",
    answer:"AWS CloudFormation lets you define AWS resources in YAML or JSON templates. Stacks are created, updated, and deleted as a unit. Combined with AWS CodePipeline, templates can be deployed automatically from Git repositories, ensuring consistent environments.",
    category:"AWS Services", difficulty:"Easy",
    task:"Write a CloudFormation template skeleton that provisions: one VPC with two public and two private subnets, an Application Load Balancer in the public subnets, an Auto Scaling Group for EC2 in the private subnets, and an RDS instance in the private subnets. Include the Parameters and Outputs sections."
  },
  {
    id:16, question:"A machine learning team needs scalable, shared file storage accessible simultaneously from dozens of EC2 instances for training data. Which AWS storage service provides a POSIX-compliant shared file system?",
    answer:"Amazon EFS (Elastic File System) provides a fully managed NFS file system that can be mounted by hundreds of EC2 instances concurrently. It scales automatically, supports multiple availability zones, and is suitable for shared workloads like ML training datasets.",
    category:"AWS Services", difficulty:"Medium",
    task:"Compare EFS, FSx for Lustre, and EBS for a machine learning training workload. Create a decision matrix covering: maximum throughput, latency profile, concurrent access, cost model, and operational overhead. Conclude with a recommendation and rationale."
  },
  {
    id:17, question:"An application generates real-time telemetry from 50,000 IoT devices at 10,000 records per second. Which AWS service can ingest, process, and route this streaming data reliably?",
    answer:"Amazon Kinesis Data Streams ingests real-time streaming data at high throughput. Kinesis Data Firehose can then buffer and deliver the data to S3, Redshift, or OpenSearch. For processing, Kinesis Data Analytics runs SQL on the stream in real time.",
    category:"AWS Services", difficulty:"Hard",
    task:"Architect a real-time telemetry pipeline for 50,000 IoT devices. Document the Kinesis shard count calculation, the Lambda consumer processing logic, how to handle hot shards, data retention configuration, and how you would alert on processing lag using CloudWatch."
  },
  {
    id:18, question:"Your organisation must regularly evaluate AWS resource configurations against internal security standards and detect configuration drift. Which AWS service continuously records configuration changes and evaluates them against rules?",
    answer:"AWS Config records the configuration state of AWS resources over time and evaluates them against Config Rules. When a resource drifts from compliance (e.g., an S3 bucket becomes public), Config marks it as non-compliant and can trigger auto-remediation via SSM Automation.",
    category:"Monitoring", difficulty:"Medium",
    task:"Set up AWS Config for a new AWS account. List the first ten managed Config Rules you would enable, explain what each checks, configure auto-remediation for at least two rules, and describe how to use the Config timeline to investigate when a security group was incorrectly modified."
  },
  {
    id:19, question:"A startup wants to send transactional emails (order confirmations, password resets) reliably at scale without managing email servers. Which AWS service provides managed email sending?",
    answer:"Amazon Simple Email Service (SES) is a scalable email platform for sending transactional and marketing emails. It handles SMTP infrastructure, bounce and complaint management, and provides delivery metrics. Verify the sending domain with DKIM and SPF to ensure inbox delivery.",
    category:"AWS Services", difficulty:"Easy",
    task:"Configure Amazon SES for a transactional email system. Document: domain verification steps (DKIM, SPF, DMARC records), sandbox vs production mode differences, how to handle bounce and complaint notifications using SES event publishing to SNS, and the recommended IAM policy for an application sending via SES."
  },
  {
    id:20, question:"A solutions architect needs to build a system where different applications are notified immediately when an order is placed, without each application polling a database. Which AWS service enables fan-out messaging to multiple subscribers?",
    answer:"Amazon SNS (Simple Notification Service) supports a publish-subscribe pattern. Publishers send messages to a topic; all subscribers (Lambda, SQS, HTTP endpoints, email) receive the message immediately. Combining SNS with SQS (fan-out pattern) provides durable, decoupled delivery.",
    category:"Architecture", difficulty:"Medium",
    task:"Design an SNS fan-out architecture for an order notification system. Draw the component relationship between SNS topics and SQS queues for three subscriber services (inventory, shipping, analytics). Explain message filtering using SNS subscription filter policies and how you would test the pattern end-to-end."
  },
  {
    id:21, question:"A company is concerned about unexpected AWS bill increases and wants to receive alerts when spending approaches a defined threshold. Which AWS service automates cost alerting?",
    answer:"AWS Budgets allows you to set custom cost, usage, or reservation budgets and receive SNS notifications or email alerts when actual or forecasted spend crosses your defined threshold. Budgets Actions can even automatically apply IAM policies to restrict spending.",
    category:"Billing & Pricing", difficulty:"Easy",
    task:"Configure AWS Budgets for a team with a monthly budget of USD 5,000. Set up three budget alerts (50%, 80%, 100% of budget), configure Budget Actions to restrict launching new EC2 instances when 90% is reached, and document where these alerts are delivered and who should receive them."
  },
  {
    id:22, question:"An enterprise has reserved EC2 capacity for predictable workloads. The Reserved Instances are now under-utilised because the engineering team switched to smaller instance types. How can they recover value from the unused reservations?",
    answer:"AWS Reserved Instance Marketplace allows you to sell unused Standard Reserved Instances to other AWS customers. Alternatively, Convertible Reserved Instances can be exchanged for reservations of different instance types or sizes, making them more flexible.",
    category:"Billing & Pricing", difficulty:"Medium",
    task:"Write a Reserved Instance optimisation report for a team that purchased 20 r5.2xlarge Reserved Instances but now runs r5.xlarge workloads. Evaluate: selling on the RI Marketplace, converting to Convertible RIs, and using Savings Plans as an alternative. Include the trade-offs of each approach."
  },
  {
    id:23, question:"A company deploys a three-tier web application (web, application, database) and wants to prevent direct internet access to the application and database tiers. How should this be architected in a VPC?",
    answer:"Place web servers in public subnets (internet-facing), application servers in private subnets (accessible only from the web tier via security group rules), and RDS in a separate private subnet. Use a NAT Gateway to allow the private subnets to make outbound internet requests without accepting inbound traffic.",
    category:"Architecture", difficulty:"Medium",
    task:"Design the full VPC architecture for a three-tier web application. Provide CIDR block allocations for each subnet, security group rules for each tier (inbound and outbound), the NAT Gateway placement, and explain why internet-facing load balancers should be in public subnets while EC2 instances should not."
  },
  {
    id:24, question:"Your Lambda functions are experiencing cold start latency issues affecting user-facing API response times. Which Lambda feature reduces cold start frequency for critical functions?",
    answer:"Lambda Provisioned Concurrency pre-initialises a specified number of function instances so they are always ready to respond. This eliminates cold starts for those instances. It incurs additional cost compared to on-demand invocations but is appropriate for latency-sensitive endpoints.",
    category:"AWS Services", difficulty:"Medium",
    task:"Analyse cold start behaviour for a Node.js Lambda function behind API Gateway. Document: how to measure cold start frequency using CloudWatch metrics, the trade-off between Provisioned Concurrency cost and latency improvement, how to schedule Provisioned Concurrency to match traffic patterns, and alternative code optimisations to reduce initialisation time."
  },
  {
    id:25, question:"A team must ensure that an S3 bucket containing sensitive data is never made publicly accessible, even if an engineer accidentally changes the bucket ACL. Which S3 feature enforces this at account level?",
    answer:"S3 Block Public Access settings can be applied at both the bucket and account level. When enabled at the account level, they override any bucket policies or ACLs that would grant public access, providing a safety net against accidental exposure.",
    category:"Security", difficulty:"Easy",
    task:"Write a security baseline procedure for S3 in a new AWS account. Cover: enabling S3 Block Public Access at the account level, the AWS Config rule to detect non-compliant buckets, how to remediate an accidentally public bucket, and the IAM policy to prevent engineers from disabling Block Public Access."
  },
  {
    id:26, question:"An application needs a NoSQL database that delivers single-digit millisecond response times at any scale and requires no capacity planning. Which AWS service is appropriate?",
    answer:"Amazon DynamoDB is a fully managed NoSQL key-value and document database with guaranteed single-digit millisecond latency. In on-demand capacity mode, it automatically scales to handle any request rate without capacity provisioning.",
    category:"AWS Services", difficulty:"Easy",
    task:"Design a DynamoDB table schema for a session management system that must store user sessions, support lookup by session token, automatically expire sessions after 24 hours, and handle 100,000 requests per second at peak. Document partition key selection, sort key, TTL configuration, and read/write capacity mode choice."
  },
  {
    id:27, question:"A company wants to restrict which AWS regions their employees can deploy resources into, preventing accidental deployments to non-approved regions. Which mechanism enforces this organisation-wide?",
    answer:"AWS Organizations Service Control Policies (SCPs) with a Deny condition for aws:RequestedRegion can block any action in non-approved regions across all accounts in the organisation, regardless of individual IAM permissions.",
    category:"Security", difficulty:"Medium",
    task:"Write an SCP that restricts all AWS actions to only ap-south-1 (Mumbai) and us-east-1 (N. Virginia), with exceptions for global services (IAM, CloudFront, Route 53, STS). Test your SCP logic by walking through three example API calls and explaining which would be allowed and which denied."
  },
  {
    id:28, question:"A development team wants to build a CI/CD pipeline that automatically tests and deploys code changes to ECS when engineers push to the main branch. Which set of AWS services enables this?",
    answer:"AWS CodePipeline orchestrates the pipeline. CodeCommit (or GitHub) stores the source. CodeBuild runs tests and builds the Docker image, pushing it to ECR. CodeDeploy (or ECS blue/green deployment) deploys the new image to ECS, with automated rollback on failure.",
    category:"AWS Services", difficulty:"Hard",
    task:"Document a complete CI/CD pipeline for an ECS application. Describe each stage: Source, Build (including Dockerfile and buildspec.yml), Test, and Deploy. Include how to configure blue/green deployment for zero-downtime releases, how to set up manual approval gates for production, and what CloudWatch alarms trigger automatic rollback."
  },
  {
    id:29, question:"AWS Trusted Advisor provides recommendations across several categories. Which category helps identify EC2 instances that are consistently under-utilised and could be downsized to reduce cost?",
    answer:"Trusted Advisor's Cost Optimization checks analyse CloudWatch CPU metrics and identify EC2 instances with low utilisation over a 14-day period. It recommends stopping or downsizing these instances to reduce spend.",
    category:"Monitoring", difficulty:"Easy",
    task:"Run a Trusted Advisor review for a cost optimisation project. Document the five check categories, list three specific checks in the Cost Optimization category, explain how to export Trusted Advisor findings to an S3 bucket via AWS Support API, and describe what actions you would take after identifying 15 under-utilised EC2 instances."
  },
  {
    id:30, question:"An application must protect against SQL injection and cross-site scripting (XSS) attacks on its public-facing web interface. Which AWS service provides a managed Web Application Firewall?",
    answer:"AWS WAF (Web Application Firewall) is attached to CloudFront, Application Load Balancer, or API Gateway. It uses rule groups (AWS Managed Rules, OWASP Top 10 rules) to inspect and block malicious HTTP requests. Rate-based rules additionally block request floods.",
    category:"Security", difficulty:"Easy",
    task:"Configure AWS WAF for a public e-commerce application behind an Application Load Balancer. Specify which AWS Managed Rule Groups to enable, write a custom rate-based rule to block IP addresses making more than 2,000 requests per 5 minutes, and describe how to use WAF logs in Athena to investigate a suspected attack."
  },
  {
    id:31, question:"A solutions architect needs to connect an on-premises data centre to an AWS VPC with a dedicated, private network connection that provides consistent bandwidth and lower latency than the public internet. Which service provides this?",
    answer:"AWS Direct Connect establishes a dedicated physical network connection between your on-premises facility and an AWS Direct Connect location. It bypasses the public internet, offering consistent bandwidth (1Gbps to 100Gbps) and predictable latency for hybrid workloads.",
    category:"Architecture", difficulty:"Medium",
    task:"Plan an AWS Direct Connect deployment for an enterprise hybrid architecture. Include: connection type (dedicated vs hosted), required bandwidth calculation based on peak data transfer, Virtual Interface types (Private VIF vs Transit VIF), and how to achieve redundancy using two Direct Connect connections from different providers."
  },
  {
    id:32, question:"A company wants to store application secrets (database passwords, API keys) securely with automatic rotation and audit logging of every access. Which AWS service is designed for this?",
    answer:"AWS Secrets Manager stores secrets encrypted with KMS, enforces access control via IAM, logs every retrieval in CloudTrail, and supports automatic secret rotation via Lambda functions. It integrates natively with RDS, Redshift, and DocumentDB for password rotation.",
    category:"Security", difficulty:"Medium",
    task:"Implement a secrets management strategy for a microservices application. Document: how to store an RDS password in Secrets Manager, configure automatic 30-day rotation, update the application to retrieve the secret at runtime (not at deployment time), and set up a CloudTrail alarm for unexpected secret access patterns."
  },
  {
    id:33, question:"Your company uses a mixture of On-Demand EC2 instances and Reserved Instances. You want a flexible pricing model that applies savings based on compute usage (regardless of instance type, size, or region) without the commitment complexity of Reserved Instances. What should you purchase?",
    answer:"Compute Savings Plans offer up to 66% discount over On-Demand rates. Unlike Reserved Instances, they apply automatically to any EC2 instance type, size, OS, or region, as well as Fargate and Lambda usage. They require only a 1 or 3-year hourly spend commitment.",
    category:"Billing & Pricing", difficulty:"Medium",
    task:"Prepare a Savings Plan recommendation for a team spending USD 15,000 per month on EC2. Use AWS Cost Explorer Savings Plans recommendations to identify the optimal hourly commitment. Compare the savings against equivalent Reserved Instances and explain why Compute Savings Plans offer more flexibility for teams that change instance types frequently."
  },
  {
    id:34, question:"A healthcare company needs to deploy an application on AWS that processes patient data and must ensure all data processing occurs within a specific geographic boundary due to data residency regulations. How does AWS support this requirement?",
    answer:"AWS Regions are geographically isolated. Data stored and processed in a specific Region does not leave that Region unless explicitly transferred. By deploying all resources in the required Region and applying SCPs to prevent cross-region data transfer, the company can satisfy data residency requirements.",
    category:"Cloud Concepts", difficulty:"Medium",
    task:"Write a data residency compliance brief for a healthcare organisation deploying on AWS ap-south-1. Cover: which AWS services store data at rest within the region, how to use SCPs to prevent cross-region data replication, S3 replication configuration to block cross-region copies, and how CloudTrail provides evidence of data residency compliance for auditors."
  },
  {
    id:35, question:"A development team needs short-lived AWS credentials for an application running on EC2, without storing any long-term access keys in the code or environment. Which mechanism should they use?",
    answer:"IAM Instance Roles attached to EC2 instances provide temporary, automatically rotating credentials via the EC2 metadata service. The AWS SDK retrieves these credentials automatically. No access keys need to be stored in code, configuration files, or environment variables.",
    category:"Security", difficulty:"Easy",
    task:"Implement IAM Instance Role best practices for a fleet of EC2 instances running a Python application. Document: how to create the IAM role and attach it to an instance, the minimum permissions required for S3 read access and CloudWatch Logs write access, how to verify the instance is receiving temporary credentials, and how to rotate the role if it is compromised."
  },
  {
    id:36, question:"An organisation wants to give customers the ability to sign in to a web application using their existing Google or Facebook accounts. Which AWS service manages federated identity for customer-facing applications?",
    answer:"Amazon Cognito User Pools handle user registration and authentication (including social identity providers like Google and Facebook). Cognito Identity Pools issue temporary AWS credentials to authenticated users, enabling fine-grained access to AWS resources from the client side.",
    category:"Security", difficulty:"Medium",
    task:"Design an authentication flow for a web application using Amazon Cognito. Describe: setting up a User Pool with Google social login, the OAuth 2.0 token exchange flow, how an authenticated user obtains temporary AWS credentials via an Identity Pool, and how to restrict a user's S3 access to only their own folder using IAM condition keys."
  },
  {
    id:37, question:"Your team is about to launch an application globally and expects traffic from North America, Europe, and Asia. You want users in each continent to be served by the nearest AWS Region to minimise latency. Which Route 53 routing policy achieves this?",
    answer:"Route 53 Geolocation routing directs users to specific resources based on their geographic location. Combined with Latency-based routing (which picks the lowest-latency endpoint from a set), this ensures global users connect to the nearest healthy region.",
    category:"Architecture", difficulty:"Medium",
    task:"Configure Route 53 for a three-region global application deployment (us-east-1, eu-west-1, ap-south-1). Document: which routing policy to use and why, how to set a default record for unmatched geographies, how Route 53 Health Checks integrate with routing to remove unhealthy regions automatically, and how to verify routing using dig commands from different geographic locations."
  },
  {
    id:38, question:"A company is running a legacy monolith on-premises and wants to begin migrating individual modules to AWS without a full re-write. Which cloud migration strategy describes moving a single module to the cloud while leaving the rest on-premises?",
    answer:"The Strangler Fig pattern (or incremental migration) involves routing specific requests to new cloud-based services while the legacy system handles the rest. Over time, more modules are migrated until the monolith is fully replaced. This reduces migration risk compared to a big-bang migration.",
    category:"Cloud Concepts", difficulty:"Hard",
    task:"Create a migration roadmap for a monolithic e-commerce application using the Strangler Fig pattern. Identify five modules to migrate first (justify your selection by business risk and technical complexity), describe the traffic routing mechanism to split requests between on-premises and AWS, and define the success criteria for each module migration phase."
  },
  {
    id:39, question:"A company needs to run a high-performance computing (HPC) cluster that requires low-latency, high-bandwidth networking between instances. Which EC2 feature should they enable?",
    answer:"Placement Groups (Cluster placement group) place instances physically close together within a single Availability Zone, enabling up to 100Gbps network throughput between instances. Enhanced Networking (with ENA) must also be enabled for maximum bandwidth.",
    category:"AWS Services", difficulty:"Hard",
    task:"Design an HPC cluster on AWS for a computational fluid dynamics workload. Specify: EC2 instance type selection (compute-optimised), Cluster Placement Group configuration, EFA (Elastic Fabric Adapter) vs ENA choice and why, FSx for Lustre as the shared scratch file system, and the Auto Scaling strategy to scale worker nodes based on job queue depth."
  },
  {
    id:40, question:"An audit team needs a single view of security findings (GuardDuty, Inspector, Macie, and IAM Access Analyzer) across 30 AWS accounts without switching between consoles. Which AWS service aggregates these findings?",
    answer:"AWS Security Hub aggregates security findings from multiple AWS services and third-party tools into a single dashboard. It normalises findings to the ASFF (Amazon Security Finding Format), prioritises them by severity, and supports automated remediation workflows via EventBridge.",
    category:"Security", difficulty:"Medium",
    task:"Deploy AWS Security Hub across a 30-account AWS Organisation. Document: enabling Security Hub in the management account, delegating a Security Hub administrator account, enabling the AWS Foundational Security Best Practices standard, and creating an EventBridge rule that automatically creates a Jira ticket for any CRITICAL finding."
  },
  {
    id:41, question:"A company stores large volumes of historical data in S3 that is accessed less than once per year for regulatory audits. Which S3 storage class minimises cost for this infrequent-access archival data?",
    answer:"S3 Glacier Deep Archive is the lowest-cost S3 storage class, designed for data retained for 7-10 years and accessed once or twice per year. Retrieval takes 12 hours for standard or 48 hours for bulk. It costs approximately USD 0.00099 per GB per month.",
    category:"Billing & Pricing", difficulty:"Easy",
    task:"Design an S3 lifecycle policy for a compliance data archive. Specify: transition rule from S3 Standard to S3 Standard-IA after 30 days, transition to Glacier Instant Retrieval after 90 days, transition to Glacier Deep Archive after 365 days, and expiration after 2,555 days (7 years). Include the lifecycle rule JSON configuration."
  },
  {
    id:42, question:"A company's web application suffers intermittent performance issues. The operations team suspects slow database queries but lacks visibility into which queries are consuming the most time. Which AWS service provides query-level performance insights for RDS?",
    answer:"RDS Performance Insights provides a dashboard showing database load broken down by wait events, SQL queries, hosts, and users. It helps identify the top SQL statements consuming DB time, enabling targeted query optimisation without requiring direct database access.",
    category:"Monitoring", difficulty:"Medium",
    task:"Use RDS Performance Insights to investigate a slow query incident on a production MySQL instance. Document: how to interpret the DB Load graph and wait event breakdown, how to identify the top three SQL queries by average latency, what index optimisation you would apply based on the findings, and how to verify the improvement after deployment."
  },
  {
    id:43, question:"A microservices application running on EKS needs to grant individual Kubernetes pods the ability to access specific AWS services (S3 and DynamoDB) without sharing a single broad IAM role across all pods. Which feature enables this?",
    answer:"IAM Roles for Service Accounts (IRSA) on EKS allows individual Kubernetes service accounts to be associated with specific IAM roles. Pods using that service account automatically receive temporary credentials scoped to that role, enabling least-privilege access per pod.",
    category:"Security", difficulty:"Hard",
    task:"Implement IAM Roles for Service Accounts on an EKS cluster. Document: creating the IAM OIDC provider for the cluster, creating an IAM role with a trust policy referencing the Kubernetes service account, annotating the Kubernetes service account with the IAM role ARN, and verifying the pod receives correct temporary credentials via the AWS SDK."
  },
  {
    id:44, question:"Your organisation wants to implement a cost allocation strategy to track AWS spending by department, project, and environment. Which AWS feature enables this?",
    answer:"Cost Allocation Tags allow you to label AWS resources with key-value pairs (e.g., Department=Engineering, Project=CloudMigration). After activating tags in the Billing console, AWS Cost Explorer and Cost and Usage Reports group costs by tag, enabling departmental chargebacks.",
    category:"Billing & Pricing", difficulty:"Easy",
    task:"Design a tagging strategy for a 50-person engineering organisation. Define the required tags (keys and allowed values) for all AWS resources, write an SCP that prevents resource creation without mandatory tags, create a Cost Explorer saved report showing monthly spend by Project tag, and describe the quarterly chargeback process you would use with finance."
  },
  {
    id:45, question:"A company wants to automatically detect sensitive data (credit card numbers, social security numbers) stored in S3 buckets and alert the security team if any unencrypted sensitive data is found. Which AWS service provides this?",
    answer:"Amazon Macie uses machine learning to automatically discover, classify, and protect sensitive data in S3. It identifies personally identifiable information (PII), financial data, and credentials, generates findings with severity levels, and integrates with Security Hub and EventBridge for automated alerting.",
    category:"Security", difficulty:"Medium",
    task:"Configure Amazon Macie for a financial services organisation. Document: enabling Macie in the management account, creating a discovery job to scan all S3 buckets weekly, setting up an EventBridge rule to send HIGH and CRITICAL findings to an SNS topic for immediate alerting, and the remediation workflow when a finding identifies unencrypted PII in a public bucket."
  },
  {
    id:46, question:"A startup needs to run a web application with a database but wants to avoid managing servers, OS patches, or database administration. Which AWS services provide the most fully managed, serverless approach?",
    answer:"AWS Lambda for compute, Amazon Aurora Serverless for the database, Amazon API Gateway for HTTP routing, and S3 + CloudFront for static assets form a fully managed, serverless stack. All services scale to zero when idle and scale up automatically with traffic.",
    category:"Cloud Concepts", difficulty:"Easy",
    task:"Design a serverless application architecture for a startup's web application. Specify: API Gateway route configuration, Lambda function responsibilities, Aurora Serverless v2 scaling configuration (ACU range), S3 and CloudFront for the frontend, and how to handle environment-specific configuration using AWS Systems Manager Parameter Store."
  },
  {
    id:47, question:"During a security review, an engineer discovers that IAM users have been accessing AWS services from unexpected geographic locations outside business hours. Which AWS service detects this type of anomalous behaviour automatically?",
    answer:"Amazon GuardDuty uses machine learning to analyse CloudTrail logs, VPC Flow Logs, and DNS logs. It detects anomalous behaviour including unusual API calls from unexpected locations, credential exfiltration, and cryptomining activity, generating prioritised findings without requiring manual log analysis.",
    category:"Security", difficulty:"Medium",
    task:"Set up Amazon GuardDuty for a 15-account AWS Organisation. Document: enabling GuardDuty with a delegated administrator account, the finding types relevant to credential compromise (UnauthorizedAccess, Policy, CredentialAccess), how to configure automatic remediation using EventBridge and Lambda to revoke compromised IAM credentials, and how to suppress known benign findings to reduce alert fatigue."
  },
  {
    id:48, question:"A team needs to run scheduled database maintenance tasks every Sunday at 02:00 UTC on an RDS instance without writing long-running polling scripts. Which AWS service can trigger a Lambda function on a schedule?",
    answer:"Amazon EventBridge Scheduler (or CloudWatch Events) allows you to create cron or rate expressions that trigger Lambda functions, ECS tasks, or Step Functions state machines on a defined schedule. This eliminates the need for polling infrastructure and is serverless.",
    category:"AWS Services", difficulty:"Easy",
    task:"Create an EventBridge schedule to run a Lambda function every Sunday at 02:00 UTC that triggers RDS snapshot creation and cleans up snapshots older than 30 days. Document: the cron expression, the Lambda function IAM permissions required, error handling if the Lambda times out, and how you would alert the on-call engineer if the job fails."
  },
  {
    id:49, question:"A company processes financial transactions and needs to ensure that every step of a multi-step workflow (validate, authorise, settle, notify) completes in the correct order, with retry logic and error handling. Which AWS service orchestrates this?",
    answer:"AWS Step Functions orchestrates distributed workflows as state machines. Each step can call Lambda, ECS, DynamoDB, SNS, or any AWS service. Step Functions handles retries with configurable backoff, error catching, and branching logic, providing full execution history for audit purposes.",
    category:"AWS Services", difficulty:"Medium",
    task:"Design an AWS Step Functions state machine for a payment processing workflow with four states: Validate, Authorise, Settle, and Notify. Include: catch blocks for authorisation failures (with refund path), a retry policy with exponential backoff for the settlement API call, a wait state if settlement is asynchronous, and how you would test the workflow using Step Functions local."
  },
  {
    id:50, question:"Your company's application logs are scattered across dozens of EC2 instances and Lambda functions. The security team needs a single place to search logs across all sources in real time. Which AWS service unifies this?",
    answer:"Amazon CloudWatch Logs aggregates logs from EC2 (via CloudWatch Agent), Lambda (natively), ECS, and other services into log groups. CloudWatch Logs Insights provides SQL-like queries across log groups. For more complex analytics, logs can be streamed to OpenSearch Service.",
    category:"Monitoring", difficulty:"Easy",
    task:"Design a centralised logging architecture for a 50-service microservices application. Specify: CloudWatch Agent configuration for EC2, log group naming conventions, retention policies per environment, a CloudWatch Logs Insights query to find all ERROR-level logs in the last hour across all services, and when you would choose OpenSearch over Logs Insights."
  },
  {
    id:51, question:"A company must achieve 99.99% availability for a critical application. Which AWS architectural principle is most important for achieving this level of uptime?",
    answer:"Eliminating single points of failure through redundancy across multiple Availability Zones is the primary principle. Combined with health checks, automatic failover (via load balancers and Auto Scaling), and circuit breaker patterns, applications can tolerate component failures without downtime.",
    category:"Architecture", difficulty:"Medium",
    task:"Design a high-availability architecture targeting 99.99% uptime. Calculate the downtime budget per month at 99.99% SLA, identify the top five single points of failure in a typical three-tier web application, and for each SPOF document the AWS feature or design pattern that eliminates it."
  },
  {
    id:52, question:"An organisation migrates its email server to AWS and needs to configure DNS so that email sent to their domain is delivered to an EC2 instance. Which Route 53 record type should they create?",
    answer:"An MX (Mail Exchange) record specifies the mail server responsible for accepting email for a domain. You create an MX record in Route 53 pointing to the EC2 instance's hostname or Elastic IP, with a priority value if multiple mail servers are configured.",
    category:"AWS Services", difficulty:"Easy",
    task:"Configure DNS records in Route 53 for a custom email domain hosted on EC2. Document: the MX record configuration, A record for the mail server hostname, SPF TXT record to authorise EC2 as a sending server, DKIM CNAME record for email signing, and DMARC TXT record to specify the policy for authentication failures."
  },
  {
    id:53, question:"A solutions architect needs to provide a disaster recovery solution with a Recovery Time Objective (RTO) of under 15 minutes and a Recovery Point Objective (RPO) of under 5 minutes for a critical production database. Which DR strategy meets these requirements?",
    answer:"Active-Passive with Hot Standby (or Multi-Site Active-Active) meets these aggressive RTO/RPO targets. RDS Multi-AZ provides near-zero RPO (synchronous replication) and sub-2-minute RTO. For cross-region DR with 15-minute RTO, Aurora Global Database with automated failover is appropriate.",
    category:"Architecture", difficulty:"Hard",
    task:"Document disaster recovery strategies aligned to four RTO/RPO tiers: Backup & Restore (hours), Pilot Light (tens of minutes), Warm Standby (minutes), and Multi-Site Active-Active (seconds). For each tier, specify the AWS services used, estimated monthly cost compared to single-region, and the exact steps in a failover runbook."
  },
  {
    id:54, question:"An API is experiencing intermittent downstream failures from a third-party service, causing cascading failures in the application. Which architectural pattern prevents this from affecting the entire system?",
    answer:"The Circuit Breaker pattern monitors calls to downstream services and, after a threshold of failures, 'opens the circuit' to stop sending requests to the failing service. AWS provides this via Lambda with dead-letter queues, Step Functions error handling, or API Gateway stage-level throttling.",
    category:"Architecture", difficulty:"Hard",
    task:"Implement a circuit breaker pattern for an API that calls a third-party payment gateway. Describe: the failure threshold configuration (e.g., 5 failures in 30 seconds), the half-open state behaviour for recovery testing, how to use DynamoDB to store circuit state for distributed Lambda instances, and how to alert the team when the circuit opens."
  },
  {
    id:55, question:"A company wants to analyse their AWS spending patterns over the past 12 months, identify trends, and forecast future costs. Which AWS tool provides this historical cost visibility and forecasting?",
    answer:"AWS Cost Explorer provides a visual interface for analysing historical AWS spend up to 13 months back. It identifies spending trends by service, region, account, or tag, offers rightsizing recommendations, and includes a machine-learning-based cost forecast.",
    category:"Billing & Pricing", difficulty:"Easy",
    task:"Conduct a cost analysis using AWS Cost Explorer for a team that suspects their EC2 and data transfer costs have increased 40% over 6 months. Document: the filters and groupings you would apply to isolate the cost drivers, how to export the data to S3 for further analysis, what the Rightsizing Recommendations show, and the three actions you would take to reduce cost."
  },
  {
    id:56, question:"A developer needs to test a new Lambda function locally before deploying to AWS. Which AWS tool allows local testing and debugging of Lambda functions with realistic AWS event simulation?",
    answer:"AWS SAM CLI (Serverless Application Model) provides local Lambda invocation, API Gateway simulation, and Step Functions testing. Combined with Docker, sam local invoke and sam local start-api simulate the Lambda execution environment, allowing debugging before deployment.",
    category:"AWS Services", difficulty:"Medium",
    task:"Set up a local Lambda development workflow using AWS SAM CLI. Document: the SAM template.yaml structure for a Lambda function with an API Gateway trigger, how to invoke the function locally with a sample event JSON, how to attach a debugger (VS Code) to the local Lambda process, and the sam deploy command and its key parameters for production deployment."
  },
  {
    id:57, question:"An application stores user-uploaded files in S3 and uses pre-signed URLs to give users temporary, secure access to download their files. How long should the pre-signed URL validity period be set for a file download use case?",
    answer:"Pre-signed URL expiry should be set to the minimum duration needed for the operation (typically 5-15 minutes for file downloads). Shorter expiry reduces the window for URL sharing or theft. The URL inherits the permissions of the IAM principal that generated it.",
    category:"Security", difficulty:"Easy",
    task:"Implement a secure file download mechanism using S3 pre-signed URLs. Document: the IAM permissions required for the service generating the URL, the Python SDK code to generate a pre-signed URL with 10-minute expiry, how to handle URL expiry gracefully in the frontend, and whether pre-signed URLs work with S3 Object Lock or versioning enabled."
  },
  {
    id:58, question:"A rapidly growing startup uses S3 to store application assets. As the number of objects grows beyond 100 million, they notice degraded performance on LIST and GET operations. What should they do?",
    answer:"S3 automatically partitions and scales based on key prefixes. For high-throughput workloads, use key prefix randomisation or hashing to distribute objects across multiple partitions, avoiding hot partitions. S3 supports at least 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second per prefix.",
    category:"AWS Services", difficulty:"Hard",
    task:"Design an S3 key structure for a high-throughput media storage application that stores 500 million objects and receives 50,000 GET requests per second. Document: the key prefix strategy to achieve maximum parallelism, how S3 Request Metrics in CloudWatch can identify hot prefixes, and how S3 Intelligent-Tiering can automatically optimise costs as access patterns change."
  },
  {
    id:59, question:"A company is adopting AWS and wants to understand which security responsibilities belong to AWS and which belong to them as a customer. How does AWS define this division of responsibility?",
    answer:"The AWS Shared Responsibility Model divides security into: AWS manages security OF the cloud (physical infrastructure, hardware, managed service internals), while customers manage security IN the cloud (data, applications, IAM, network configuration, OS patching for IaaS services like EC2).",
    category:"Cloud Concepts", difficulty:"Easy",
    task:"Create a Shared Responsibility Model reference guide for your organisation. Map each of the following services to the correct responsibility split: EC2, S3, RDS (managed), Lambda, and EKS. For each service, list three specific security tasks that are the customer's responsibility and three that are AWS's responsibility."
  },
  {
    id:60, question:"A company wants to reduce the time engineers spend on routine operational tasks such as patch management, inventory collection, and configuration compliance across hundreds of EC2 instances and on-premises servers. Which AWS service provides this automation at scale?",
    answer:"AWS Systems Manager provides a unified operations hub. Patch Manager automates OS patching. Inventory collects software and configuration data. State Manager enforces configuration compliance. Run Command executes scripts across hundreds of instances without SSH access, and Session Manager provides browser-based shell access without opening port 22.",
    category:"Monitoring", difficulty:"Medium",
    task:"Implement AWS Systems Manager for a fleet of 200 EC2 instances across three environments. Document: SSM Agent installation and IAM Instance Profile configuration, creating a Patch Manager baseline for Linux instances (critical and security patches only), scheduling automatic patching in a maintenance window, and setting up Session Manager to replace all SSH access with audited browser-based sessions."
  }
];

// ===================== EMAIL DATABASE =====================
// Inbox starts empty — use Compose to add mail (to yourself, as any sender you choose).
const SEED_EMAILS = [];

// Deterministic avatar colour so the same sender name always gets the same colour.
const AVATAR_COLORS = ['#7C3AED','#0891B2','#059669','#DC2626','#2563EB','#D97706','#DB2777','#4F46E5'];
function colorForName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ===================== APP STATE =====================
const APP_STATE = {
  currentView: 'tasks',
  currentFolder: 'received',
  selectedEmailId: null,
  isOnBreak: false,
  loginTime: null,
  logoutTime: null,
  sessionStartTs: null,
  breakStartTs: null,
  totalBreakMs: 0,
  globalTimerInterval: null,
  clockInterval: null,
  confirmAction: null,
  taskTimers: {}, // { taskId: { startTs, elapsedMs, state: 'idle'|'running'|'paused'|'finished', intervalId } }
};

// ===================== STORAGE HELPERS =====================
const KEYS = {
  emails:    'cd_emails',
  todayTasks:'cd_today_tasks',
  todayData: 'cd_today_data',
  history:   'cd_history',
  streak:    'cd_streak',
  qCycle:    'cd_question_cycle',
  usedQ:     'cd_used_questions',
  session:   'cd_session',
  catStats:  'cd_category_stats',
  theme:     'cd_theme',
  emailSchemaV2: 'cd_email_schema_v2',
};

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
  // Push to Firestore (debounced) so history/analytics/tasks follow the
  // signed-in Google account across devices. No-op until signed in.
  if (window.CloudSync) window.CloudSync.notifyLocalChange();
}
function load(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; } }

// ===================== DATE HELPERS =====================
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDate(d) {
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTime(d) {
  let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${ampm}`;
}
function formatTimeShort(d) {
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;
}
function msToHMS(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`;
}
function msToMinSec(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sc = s % 60;
  return `${String(m).padStart(2,'0')}m ${String(sc).padStart(2,'0')}s`;
}

// Determine the Nth Saturday occurrence in a month
function getSaturdayOccurrence(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  let count = 0;
  while (d.getMonth() === date.getMonth()) {
    if (d.getDay() === 6) {
      count++;
      if (d.getDate() === date.getDate()) return count;
    }
    d.setDate(d.getDate() + 1);
  }
  return 0;
}
function hasTodayTasks(date) {
  const day = date.getDay();
  if (day === 0) return false; // Sunday
  if (day === 6) {
    const occ = getSaturdayOccurrence(date);
    return occ % 2 === 1; // Odd Saturdays only
  }
  return true;
}

// ===================== QUESTION ROTATION =====================
function generateDailyTasks(dateKey) {
  // Check if we already generated tasks for today
  const existing = load(KEYS.todayTasks, null);
  if (existing && existing.dateKey === dateKey) return existing.tasks;

  // Deterministic shuffle based on date seed
  const seed = parseInt(dateKey.replace(/-/g,''));
  function seededRand(s) {
    let x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  }
  // Get used questions across all cycles
  let usedMap = load(KEYS.usedQ, {}); // { qId: true }
  let cycleNum = load(KEYS.qCycle, 1);

  // Get available questions
  let available = QUESTIONS.filter(q => !usedMap[q.id]);
  if (available.length < 5) {
    // New cycle
    cycleNum++;
    usedMap = {};
    available = [...QUESTIONS];
    save(KEYS.qCycle, cycleNum);
    save(KEYS.usedQ, {});
    
  }

  // Shuffle deterministically
  let pool = [...available];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(seededRand(seed + i) * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const selected = pool.slice(0, 5);

  // Mark as used
  selected.forEach(q => { usedMap[q.id] = true; });
  save(KEYS.usedQ, usedMap);

  const tasks = selected.map((q, idx) => ({
    id: `task_${idx+1}`,
    questionId: q.id,
    num: idx + 1,
    question: q.question,
    answer: q.answer,
    task: q.task,
    category: q.category,
    difficulty: q.difficulty,
    state: 'idle',       // idle | running | paused | finished
    elapsedMs: 0,
    startTs: null,
    finishedAt: null,
  }));

  save(KEYS.todayTasks, { dateKey, tasks, cycleNum });
  return tasks;
}

// ===================== DAILY DATA =====================
function getTodayData() {
  const key = todayKey();
  const d = load(KEYS.todayData, null);
  if (d && d.dateKey === key) return d;
  // New day
  return {
    dateKey: key,
    loginTime: null,
    logoutTime: null,
    breakMs: 0,
    sessionStartTs: null,
    correct: 0,
    incorrect: 0,
    totalTaskMs: 0,
    completedCount: 0,
  };
}
function saveTodayData(data) {
  save(KEYS.todayData, data);
}

// ===================== HISTORY =====================
function pushHistory(dayData, tasks) {
  const hist = load(KEYS.history, []);
  const existing = hist.find(h => h.dateKey === dayData.dateKey);
  const entry = {
    dateKey: dayData.dateKey,
    completedCount: dayData.completedCount,
    totalTasks: tasks.length,
    correct: dayData.correct,
    incorrect: dayData.incorrect,
    totalTaskMs: dayData.totalTaskMs,
    breakMs: dayData.breakMs,
    loginTime: dayData.loginTime,
    logoutTime: dayData.logoutTime,
  };
  if (existing) {
    Object.assign(existing, entry);
  } else {
    hist.unshift(entry);
  }
  save(KEYS.history, hist.slice(0, 90)); // keep 90 days
}

// ===================== STREAK =====================
function updateStreak(dateKey, completed, totalTasks) {
  let streak = load(KEYS.streak, { count:0, lastDate:null });
  if (completed >= totalTasks && totalTasks > 0) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
    if (streak.lastDate === yKey || streak.lastDate === dateKey) {
      if (streak.lastDate !== dateKey) streak.count++;
      streak.lastDate = dateKey;
    } else {
      streak.count = 1;
      streak.lastDate = dateKey;
    }
    
  }
  save(KEYS.streak, streak);
  return streak.count;
}

// ===================== CATEGORY STATS =====================
function updateCategoryStats(category, correct) {
  let stats = load(KEYS.catStats, {});
  if (!stats[category]) stats[category] = { attempts:0, correct:0 };
  stats[category].attempts++;
  if (correct) stats[category].correct++;
  save(KEYS.catStats, stats);
}

// ===================== EMAILS =====================
function initEmails() {
  // One-time cleanup: earlier testing used a different folder scheme ('inbox'/'important').
  // Wipe any stale data so folders line up cleanly with Received / Sent by Me / Drafts.
  const migrated = load(KEYS.emailSchemaV2, false);
  if (!migrated) {
    localStorage.removeItem(KEYS.emails);
    save(KEYS.emailSchemaV2, true);
  }
  let emails = load(KEYS.emails, null);
  if (!emails) {
    emails = SEED_EMAILS.map(e => ({ ...e }));
    save(KEYS.emails, emails);
  }
  return emails;
}
function getEmails() { return load(KEYS.emails, SEED_EMAILS); }
function saveEmails(emails) { save(KEYS.emails, emails); }

function getUnreadCount() {
  return getEmails().filter(e => e.folder === 'received' && e.unread).length;
}

// ===================== TOAST =====================
function showToast(msg, type='') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

// ===================== VIEW SWITCHING =====================
function switchView(view, el) {
  document.querySelectorAll('.panel-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  const panel = document.getElementById(`view-${view}`);
  if (panel) panel.classList.add('active');
  if (el) el.classList.add('active');
  else {
    const match = document.querySelector(`[data-view="${view}"]`);
    if (match) match.classList.add('active');
  }
  APP_STATE.currentView = view;

  // Render views on-demand
  if (view === 'inbox')     renderEmailList();
  if (view === 'analytics') renderAnalytics();
  if (view === 'history')   renderHistory();
  if (view === 'review')    renderReview();
}

// ===================== CLOCK =====================
function initClock() {
  function tick() {
    const now = new Date();
    document.getElementById('header-date').textContent  = formatDate(now);
    document.getElementById('header-clock').textContent = formatTime(now);
  }
  tick();
  APP_STATE.clockInterval = setInterval(tick, 1000);
}

// ===================== GLOBAL SESSION TIMER =====================
function startGlobalTimer() {
  if (APP_STATE.globalTimerInterval) return;
  APP_STATE.globalTimerInterval = setInterval(() => {
    if (APP_STATE.isOnBreak) return;
    const session = load(KEYS.session, null);
    if (!session || !session.sessionStartTs) return;
    const now = Date.now();
    const elapsed = now - session.sessionStartTs - (session.totalBreakMs || 0);
    document.getElementById('global-timer').textContent = msToHMS(Math.max(0, elapsed));
    // update session progress (8h = full day)
    const pct = Math.min(100, (elapsed / (8 * 3600000)) * 100);
    document.getElementById('session-progress-fill').style.width = pct + '%';
  }, 1000);
}

// ===================== BREAK =====================
function toggleBreak() {
  if (!APP_STATE.isOnBreak) {
    // Start break
    APP_STATE.isOnBreak = true;
    APP_STATE.breakStartTs = Date.now();
    document.getElementById('break-btn').textContent = 'Resume Work';
    document.getElementById('break-btn').classList.add('active');
    document.getElementById('status-dot').classList.add('break');
    document.getElementById('header-status').textContent = 'On Break';
    showToast('Break started. Rest well.', 'warning');
  } else {
    // End break
    const breakDuration = Date.now() - APP_STATE.breakStartTs;
    APP_STATE.isOnBreak = false;
    // Update session break total
    const session = load(KEYS.session, {});
    session.totalBreakMs = (session.totalBreakMs || 0) + breakDuration;
    save(KEYS.session, session);
    // Update todayData
    const td = getTodayData();
    td.breakMs = (td.breakMs || 0) + breakDuration;
    saveTodayData(td);

    document.getElementById('break-btn').textContent = 'Take Break';
    document.getElementById('break-btn').classList.remove('active');
    document.getElementById('status-dot').classList.remove('break');
    document.getElementById('header-status').textContent = 'Working';
    showToast('Welcome back, Siddhay.', 'success');
    updateBreakDisplay();
  }
}

function updateBreakDisplay() {
  const td = getTodayData();
  document.getElementById('s-break-time').textContent = msToHMS(td.breakMs || 0);
}

// ===================== SESSION INIT =====================
function initSession() {
  let session = load(KEYS.session, null);
  const key = todayKey();
  if (!session || session.dateKey !== key) {
    session = { dateKey: key, sessionStartTs: null, totalBreakMs: 0 };
    save(KEYS.session, session);
  }
  APP_STATE.sessionStartTs = session.sessionStartTs;
  APP_STATE.totalBreakMs   = session.totalBreakMs || 0;
  return session;
}

function recordLogin() {
  const session = load(KEYS.session, {});
  if (session.sessionStartTs) {
    APP_STATE.sessionStartTs = session.sessionStartTs;
    const loginDate = new Date(session.sessionStartTs);
    document.getElementById('s-login-time').textContent = formatTimeShort(loginDate);
    return;
  }
  const now = Date.now();
  session.sessionStartTs = now;
  session.dateKey = todayKey();
  save(KEYS.session, session);
  APP_STATE.sessionStartTs = now;
  const td = getTodayData();
  td.loginTime = now;
  saveTodayData(td);
  document.getElementById('s-login-time').textContent = formatTimeShort(new Date(now));
}

// ===================== TASKS =====================
let todayTasks = [];

function initTasks() {
  const date = new Date();
  const dateKey = todayKey();
  document.getElementById('tasks-date-badge').textContent = formatDate(date).split(', ')[1];
  if (!hasTodayTasks(date)) {
    document.getElementById('tasks-grid').innerHTML = `
      <div class="no-tasks-card">
        <h3>No Tasks Scheduled</h3>
        <p>Today is a rest day. No tasks are scheduled. Enjoy your break.</p>
      </div>`;
    document.getElementById('badge-tasks').textContent = '0';
    updateHeaderProgress(0, 0);
    return;
  }
  todayTasks = generateDailyTasks(dateKey);
  // Restore task timer states from localStorage
  const savedTimers = load('cd_task_timers_' + dateKey, {});
  todayTasks.forEach(t => {
    if (savedTimers[t.id]) {
      Object.assign(t, savedTimers[t.id]);
    }
  });
  renderAllTasks();
  updateProgressDisplay();
}

function saveTaskTimers() {
  const dateKey = todayKey();
  const snapshot = {};
  todayTasks.forEach(t => {
    snapshot[t.id] = {
      state: t.state,
      elapsedMs: t.elapsedMs,
      startTs: t.startTs,
      finishedAt: t.finishedAt,
      completed: t.completed,
      result: t.result,
    };
  });
  save('cd_task_timers_' + dateKey, snapshot);
  // Also save today tasks with current state
  const dateData = load(KEYS.todayTasks, {});
  if (dateData) {
    dateData.tasks = todayTasks;
    save(KEYS.todayTasks, dateData);
  }
}

function renderAllTasks() {
  const grid = document.getElementById('tasks-grid');
  grid.innerHTML = '';
  todayTasks.forEach(task => {
    grid.appendChild(buildTaskCard(task));
  });
  const remaining = todayTasks.filter(t => t.state !== 'finished').length;
  document.getElementById('badge-tasks').textContent = remaining;
}

function buildTaskCard(task) {
  const card = document.createElement('div');
  card.className = `task-card${task.state === 'running' ? ' active-task' : ''}${task.state === 'finished' ? ' completed-task' : ''}`;
  card.id = `card-${task.id}`;

  const diffClass = { Easy:'diff-easy', Medium:'diff-medium', Hard:'diff-hard' }[task.difficulty] || 'diff-easy';
  const timerClass = { idle:'', running:'running', paused:'paused', finished:'finished' }[task.state];
  const displayMs = task.state === 'running'
    ? task.elapsedMs + (task.startTs ? Date.now() - task.startTs : 0)
    : task.elapsedMs;

  let controls = '';
  if (task.state === 'idle') {
    controls = `<button class="task-btn task-btn-start" onclick="startTask('${task.id}')">Start Task</button>`;
  } else if (task.state === 'running') {
    controls = `<button class="task-btn task-btn-pause" onclick="pauseTask('${task.id}')">Pause</button>
                <button class="task-btn task-btn-finish" onclick="finishTask('${task.id}')">Mark Complete</button>`;
  } else if (task.state === 'paused') {
    controls = `<button class="task-btn task-btn-resume" onclick="resumeTask('${task.id}')">Resume</button>
                <button class="task-btn task-btn-finish" onclick="finishTask('${task.id}')">Mark Complete</button>`;
  } else {
    controls = `<span style="font-size:11px;font-weight:600;color:var(--success);">Completed</span>`;
  }

  const resultBanner = task.state === 'finished' && task.result
    ? `<div class="task-result-banner ${task.result === 'correct' ? 'correct' : 'incorrect'}">
        <div class="task-result-dot"></div>
        ${task.result === 'correct' ? 'Task completed successfully' : 'Task completed'}
       </div>` : '';

  card.innerHTML = `
    ${task.state === 'finished' ? '<div class="task-completed-ribbon">DONE</div>' : ''}
    <div class="task-card-header">
      <span class="task-num">Task ${String(task.num).padStart(2,'0')}</span>
      <span class="task-category-badge">${task.category}</span>
      <span class="task-difficulty ${diffClass}">${task.difficulty}</span>
    </div>
    <div class="task-card-body">
      <div class="task-question">${task.question}</div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.7;margin-bottom:14px;background:var(--surface-2);padding:12px;border-radius:var(--radius-sm);border-left:3px solid var(--border);">
        <strong style="color:var(--text-muted);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Your Task</strong><br/><br/>
        ${task.task}
      </div>
      <div class="task-timer-row">
        <div class="task-timer-display ${timerClass}" id="timer-${task.id}">${msToHMS(displayMs)}</div>
        <div class="task-controls">${controls}</div>
      </div>
    </div>
    ${resultBanner}
  `;

  // Restart tick if task is running (after page refresh)
  if (task.state === 'running') {
    startTimerTick(task);
  }

  return card;
}

function startTimerTick(task) {
  if (APP_STATE.taskTimers[task.id] && APP_STATE.taskTimers[task.id].intervalId) return;
  if (!APP_STATE.taskTimers[task.id]) APP_STATE.taskTimers[task.id] = {};
  APP_STATE.taskTimers[task.id].intervalId = setInterval(() => {
    if (task.state !== 'running') return;
    const elapsed = task.elapsedMs + (task.startTs ? Date.now() - task.startTs : 0);
    const el = document.getElementById(`timer-${task.id}`);
    if (el) el.textContent = msToHMS(elapsed);
  }, 1000);
}

function stopTimerTick(task) {
  if (APP_STATE.taskTimers[task.id] && APP_STATE.taskTimers[task.id].intervalId) {
    clearInterval(APP_STATE.taskTimers[task.id].intervalId);
    APP_STATE.taskTimers[task.id].intervalId = null;
  }
}

function startTask(taskId) {
  // Only allow starting if this is the first task or previous tasks are not in idle
  const task = todayTasks.find(t => t.id === taskId);
  if (!task || task.state !== 'idle') return;

  // Record login on first task start
  if (!todayTasks.some(t => t.state === 'running' || t.state === 'finished' || t.state === 'paused')) {
    recordLogin();
    startGlobalTimer();
  }

  // Pause any currently running task
  todayTasks.forEach(t => {
    if (t.state === 'running') pauseTask(t.id, true);
  });

  task.state = 'running';
  task.startTs = Date.now();
  saveTaskTimers();
  rebuildCard(task);
  startTimerTick(task);
  showToast(`Task ${task.num} started. Timer running.`);
  updateProgressDisplay();
}

function pauseTask(taskId, silent=false) {
  const task = todayTasks.find(t => t.id === taskId);
  if (!task || task.state !== 'running') return;
  const now = Date.now();
  task.elapsedMs += (task.startTs ? now - task.startTs : 0);
  task.startTs = null;
  task.state = 'paused';
  stopTimerTick(task);
  saveTaskTimers();
  rebuildCard(task);
  if (!silent) showToast(`Task ${task.num} paused.`, 'warning');
}

function resumeTask(taskId) {
  const task = todayTasks.find(t => t.id === taskId);
  if (!task || task.state !== 'paused') return;
  // Pause any other running task
  todayTasks.forEach(t => {
    if (t.id !== taskId && t.state === 'running') pauseTask(t.id, true);
  });
  task.state = 'running';
  task.startTs = Date.now();
  saveTaskTimers();
  rebuildCard(task);
  startTimerTick(task);
  showToast(`Task ${task.num} resumed.`);
}

function finishTask(taskId) {
  const task = todayTasks.find(t => t.id === taskId);
  if (!task || task.state === 'finished' || task.state === 'idle') return;
  const now = Date.now();
  if (task.state === 'running') {
    task.elapsedMs += (task.startTs ? now - task.startTs : 0);
    task.startTs = null;
  }
  stopTimerTick(task);
  task.state = 'finished';
  task.finishedAt = now;
  task.result = 'correct'; // All tasks are work tasks — mark as completed

  // Update today data
  const td = getTodayData();
  td.completedCount = todayTasks.filter(t => t.state === 'finished').length;
  td.correct = td.completedCount;
  td.incorrect = 0;
  td.totalTaskMs += task.elapsedMs;
  saveTodayData(td);

  // Update category stats
  updateCategoryStats(task.category, true);

  // Check if all done
  const allDone = todayTasks.every(t => t.state === 'finished');
  if (allDone) {
    td.logoutTime = now;
    saveTodayData(td);
    document.getElementById('s-logout-time').textContent = formatTimeShort(new Date(now));
    const streak = updateStreak(todayKey(), td.completedCount, todayTasks.length);
    pushHistory(td, todayTasks);
    showToast('All tasks completed. Great work today!', 'success');
    document.getElementById('s-streak').textContent = `${streak} days`;
  }

  saveTaskTimers();
  rebuildCard(task);
  updateProgressDisplay();
  updateSessionStats();
  showToast(`Task ${task.num} completed.`, 'success');
}

function rebuildCard(task) {
  const existing = document.getElementById(`card-${task.id}`);
  if (existing) {
    const newCard = buildTaskCard(task);
    existing.replaceWith(newCard);
  }
}

function updateProgressDisplay() {
  const total = todayTasks.length;
  const done  = todayTasks.filter(t => t.state === 'finished').length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('tasks-progress-count').textContent = `${done}/${total}`;
  document.getElementById('tasks-progress-pct').textContent   = `${pct}%`;
  const fill = document.getElementById('tasks-progress-fill');
  fill.style.width = pct + '%';
  if (pct === 100) fill.classList.add('complete');
  else fill.classList.remove('complete');
  const remaining = total - done;
  document.getElementById('badge-tasks').textContent = remaining;
  updateHeaderProgress(done, total);
  updateSessionStats();
}

function updateHeaderProgress(done, total) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('header-pct-text').textContent = `${pct}%`;
  document.getElementById('header-pct-bar').style.width  = pct + '%';
}

function updateSessionStats() {
  const td = getTodayData();
  const completed = todayTasks.filter(t => t.state === 'finished').length;
  const accuracy  = completed > 0 ? Math.round((td.correct / completed) * 100) : 0;
  const avgMs     = completed > 0 ? td.totalTaskMs / completed : 0;
  document.getElementById('s-correct').textContent   = td.correct;
  document.getElementById('s-incorrect').textContent = td.incorrect;
  document.getElementById('s-accuracy').textContent  = `${accuracy}%`;
  document.getElementById('s-avg-time').textContent  = avgMs ? msToMinSec(avgMs) : '--:--';
  const streak = load(KEYS.streak, { count:0 });
  document.getElementById('s-streak').textContent  = `${streak.count} days`;
  document.getElementById('s-cycle').textContent   = load(KEYS.qCycle, 1);
  updateBreakDisplay();
}

// ===================== EMAIL SYSTEM =====================
function renderEmailList() {
  const emails  = getEmails();
  const folder  = APP_STATE.currentFolder;
  const search  = document.getElementById('email-search').value.toLowerCase();
  let filtered  = emails.filter(e => e.folder === folder);
  if (search) {
    filtered = filtered.filter(e =>
      e.subject.toLowerCase().includes(search) ||
      e.from.toLowerCase().includes(search) ||
      e.preview.toLowerCase().includes(search)
    );
  }

  const list = document.getElementById('email-list');
  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted);font-size:13px;">No messages found.</div>`;
    return;
  }
  filtered.forEach(email => {
    const item = document.createElement('div');
    item.className = `email-item${email.unread ? ' unread' : ''}${APP_STATE.selectedEmailId === email.id ? ' selected' : ''}`;
    item.onclick = () => openEmail(email.id);
    item.innerHTML = `
      ${email.unread ? '<div class="email-unread-dot"></div>' : ''}
      <div class="email-avatar" style="background:${email.color}">${email.from.charAt(0)}</div>
      <div class="email-meta">
        <div class="email-sender">${email.from}</div>
        <div class="email-subject">${email.subject}</div>
        <div class="email-preview">${email.preview}</div>
      </div>
      <div class="email-right">
        <span class="email-time">${email.time}</span>
        <span class="email-star${email.starred ? ' starred' : ''}" onclick="toggleStar(event,'${email.id}')">&#9733;</span>
        <div class="email-priority priority-${email.priority}"></div>
      </div>
    `;
    list.appendChild(item);
  });
  // Update unread badge
  document.getElementById('badge-unread').textContent = getUnreadCount();
}

function openEmail(id) {
  const emails = getEmails();
  const email  = emails.find(e => e.id === id);
  if (!email) return;
  APP_STATE.selectedEmailId = id;
  // Mark as read
  if (email.unread) {
    email.unread = false;
    saveEmails(emails);
    renderEmailList();
    document.getElementById('badge-unread').textContent = getUnreadCount();
  } else {
    renderEmailList();
  }
  // Render email
  document.getElementById('email-empty-state').style.display = 'none';
  const viewContent = document.getElementById('email-view-content');
  viewContent.style.display = 'flex';
  document.getElementById('email-view').innerHTML = `
    <div class="email-view-header">
      <div class="email-view-subject">${email.subject}</div>
      <div class="email-view-meta">
        <div class="email-view-avatar" style="background:${email.color}">${email.from.charAt(0)}</div>
        <div class="email-view-info">
          <div class="email-view-sender">${email.from}</div>
          <div class="email-view-from">${email.fromEmail}${email.to ? ` &rarr; ${email.to}` : ''}</div>
        </div>
        <div class="email-view-time">${email.date} &nbsp; ${email.time}</div>
      </div>
    </div>
    <div class="email-view-body">${email.body}</div>
  `;
  document.getElementById('email-actions').innerHTML = `
    <button class="email-action-btn" onclick="toggleStar(event,'${email.id}')">
      <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      ${email.starred ? 'Unstar' : 'Star'}
    </button>
    <button class="email-action-btn" onclick="markUnread('${email.id}')">
      <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg>
      Mark Unread
    </button>
    <button class="email-action-btn" onclick="deleteEmail('${email.id}')" style="margin-left:auto;color:var(--danger);">
      <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      Delete
    </button>
  `;
}

function toggleStar(e, id) {
  e.stopPropagation();
  const emails = getEmails();
  const email  = emails.find(em => em.id === id);
  if (!email) return;
  email.starred = !email.starred;
  saveEmails(emails);
  renderEmailList();
  if (APP_STATE.selectedEmailId === id) openEmail(id);
}

function markUnread(id) {
  const emails = getEmails();
  const email  = emails.find(e => e.id === id);
  if (!email) return;
  email.unread = true;
  saveEmails(emails);
  renderEmailList();
  document.getElementById('email-empty-state').style.display = 'flex';
  document.getElementById('email-view-content').style.display = 'none';
  APP_STATE.selectedEmailId = null;
  showToast('Marked as unread.');
}

function deleteEmail(id) {
  const emails  = getEmails();
  const updated = emails.filter(e => e.id !== id);
  saveEmails(updated);
  APP_STATE.selectedEmailId = null;
  document.getElementById('email-empty-state').style.display = 'flex';
  document.getElementById('email-view-content').style.display = 'none';
  renderEmailList();
  showToast('Email deleted.');
}

function switchFolder(folder, el) {
  APP_STATE.currentFolder = folder;
  APP_STATE.selectedEmailId = null;
  document.getElementById('email-empty-state').style.display = 'flex';
  document.getElementById('email-view-content').style.display = 'none';
  document.querySelectorAll('.inbox-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const labels = { received:'Received', sent:'Sent by Me', drafts:'Drafts' };
  document.getElementById('inbox-folder-label').textContent = labels[folder] || 'Inbox';
  renderEmailList();
}

function filterEmails() { renderEmailList(); }

// ===================== COMPOSE =====================
function openCompose() {
  APP_STATE.quickReceiveMode = false;
  document.getElementById('compose-overlay').classList.add('open');
  document.getElementById('compose-from-name').value  = '';
  document.getElementById('compose-from-email').value = '';
  document.getElementById('compose-to').value      = '';
  document.getElementById('compose-cc').value      = '';
  document.getElementById('compose-subject').value = '';
  document.getElementById('compose-body').value    = '';
  document.querySelector('.compose-header span').textContent = 'New Message';
  document.querySelector('.compose-send').textContent = 'Send';
  document.querySelector('.compose-draft').style.display = '';
}
function closeCompose() {
  document.getElementById('compose-overlay').classList.remove('open');
  APP_STATE.quickReceiveMode = false;
}
function handleComposeSend() {
  if (APP_STATE.quickReceiveMode) receiveEmail();
  else sendEmail();
}
function sendEmail() {
  const fromName  = document.getElementById('compose-from-name').value.trim();
  const fromEmail = document.getElementById('compose-from-email').value.trim();
  const to        = document.getElementById('compose-to').value.trim();
  const subject   = document.getElementById('compose-subject').value.trim();
  const body      = document.getElementById('compose-body').value.trim();
  if (!to || !subject) { showToast('Please fill in the recipient and subject.', 'error'); return; }

  const senderName  = fromName  || 'Siddhay';
  const senderEmail = fromEmail || 'siddhay@corp.com';
  const now = new Date();
  const ts  = formatTimeShort(now);
  const emails = getEmails();

  // Compose always represents mail YOU send out — it only files into "Sent by Me".
  // Use the Quick-Receive button (bottom-left) to add mail into "Received".
  const sentCopy = {
    id: `sent_${Date.now()}`,
    from: senderName, fromEmail: senderEmail,
    to, subject, body,
    preview: body.slice(0,80),
    time: ts, date: 'Today',
    priority:'low', folder:'sent',
    unread:false, starred:false, color: colorForName(senderName)
  };
  emails.push(sentCopy);

  saveEmails(emails);
  closeCompose();
  showToast('Message sent.', 'success');
  if (APP_STATE.currentFolder === 'sent') renderEmailList();
}

// ===================== QUICK RECEIVE =====================
// Bottom-left sidebar button — lets you drop a mail straight into "Received",
// as if someone else sent it to you. Reuses the same Compose modal/fields.
function openQuickReceive() {
  APP_STATE.quickReceiveMode = true;
  document.getElementById('compose-overlay').classList.add('open');
  document.getElementById('compose-from-name').value  = '';
  document.getElementById('compose-from-email').value = '';
  document.getElementById('compose-to').value      = 'siddhay@corp.com';
  document.getElementById('compose-cc').value      = '';
  document.getElementById('compose-subject').value = '';
  document.getElementById('compose-body').value    = '';
  document.querySelector('.compose-header span').textContent = 'Receive New Message';
  document.querySelector('.compose-send').textContent = 'Receive';
  document.querySelector('.compose-draft').style.display = 'none';
}
function receiveEmail() {
  const fromName  = document.getElementById('compose-from-name').value.trim();
  const fromEmail = document.getElementById('compose-from-email').value.trim();
  const to        = document.getElementById('compose-to').value.trim() || 'siddhay@corp.com';
  const subject   = document.getElementById('compose-subject').value.trim();
  const body      = document.getElementById('compose-body').value.trim();
  if (!fromName || !subject) { showToast('Please fill in the sender name and subject.', 'error'); return; }

  const now = new Date();
  const emails = getEmails();
  const received = {
    id: `recv_${Date.now()}`,
    from: fromName, fromEmail: fromEmail || `${fromName.toLowerCase().replace(/\s+/g,'.')}@corp.com`,
    to, subject, body,
    preview: body.slice(0,80),
    time: formatTimeShort(now), date: 'Today',
    priority:'low', folder:'received',
    unread:true, starred:false, color: colorForName(fromName)
  };
  emails.push(received);
  saveEmails(emails);
  closeCompose();
  showToast('New mail received in your inbox.', 'success');
  document.getElementById('badge-unread').textContent = getUnreadCount();
  if (APP_STATE.currentFolder === 'received') renderEmailList();
}
function saveDraft() {
  const fromName  = document.getElementById('compose-from-name').value.trim();
  const fromEmail = document.getElementById('compose-from-email').value.trim();
  const to        = document.getElementById('compose-to').value.trim();
  const subject   = document.getElementById('compose-subject').value.trim() || '(No Subject)';
  const body      = document.getElementById('compose-body').value.trim();
  const now = new Date();
  const senderName  = fromName  || 'Siddhay';
  const senderEmail = fromEmail || 'siddhay@corp.com';
  // Drafts are stored via saveEmails() -> localStorage (KEYS.emails) and persist
  // across reloads until you delete them yourself from the Drafts folder.
  const email = {
    id: `draft_${Date.now()}`,
    from: senderName, fromEmail: senderEmail,
    to, subject:`[Draft] ${subject}`, body,
    preview: body.slice(0,80),
    time: formatTimeShort(now),
    date:'Today',
    priority:'low', folder:'drafts',
    unread:false, starred:false, color: colorForName(senderName)
  };
  const emails = getEmails();
  emails.push(email);
  saveEmails(emails);
  closeCompose();
  showToast('Draft saved. It will stay here until you delete it.', 'warning');
  if (APP_STATE.currentFolder === 'drafts') renderEmailList();
}

// ===================== ANALYTICS =====================
function renderAnalytics() {
  const td         = getTodayData();
  const catStats   = load(KEYS.catStats, {});
  const streak     = load(KEYS.streak, { count:0 });
  const history    = load(KEYS.history, []);
  const completed  = todayTasks.filter(t => t.state === 'finished').length;
  const total      = todayTasks.length;
  const accuracy   = completed > 0 ? Math.round((td.correct / completed) * 100) : 0;
  const avgMs      = completed > 0 ? td.totalTaskMs / completed : 0;

  const grid = document.getElementById('analytics-grid');
  grid.innerHTML = `
    <div class="stat-card">
      <div class="stat-card-label">Tasks Today</div>
      <div class="stat-card-value">${completed}/${total}</div>
      <div class="stat-card-sub">${completed === total && total > 0 ? 'All tasks complete' : `${total - completed} remaining`}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-label">Overall Accuracy</div>
      <div class="stat-card-value">${accuracy}%</div>
      <div class="stat-card-sub">${td.correct} completed out of ${completed} tasks</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-label">Focus Time Today</div>
      <div class="stat-card-value">${msToHMS(td.totalTaskMs)}</div>
      <div class="stat-card-sub">Avg per task: ${avgMs ? msToMinSec(avgMs) : '--'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-label">Current Streak</div>
      <div class="stat-card-value" style="color:var(--warning);">${streak.count}</div>
      <div class="stat-card-sub">consecutive working days</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-label">Break Time</div>
      <div class="stat-card-value">${msToHMS(td.breakMs||0)}</div>
      <div class="stat-card-sub">Today's total break duration</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-label">Days on Record</div>
      <div class="stat-card-value">${history.length}</div>
      <div class="stat-card-sub">Session history entries</div>
    </div>
  `;

  // Category performance + Streak
  const lower = document.getElementById('analytics-lower');
  const categories = ['Cloud Concepts','Security','AWS Services','Billing & Pricing','Architecture','Monitoring'];
  let catBars = categories.map(cat => {
    const s = catStats[cat];
    if (!s || s.attempts === 0) return `<div class="category-bar-item"><div class="category-bar-row"><span class="category-bar-name">${cat}</span><span class="category-bar-pct">No data</span></div><div class="category-bar-track"><div class="category-bar-fill" style="width:0%"></div></div></div>`;
    const pct = Math.round((s.correct / s.attempts) * 100);
    return `<div class="category-bar-item"><div class="category-bar-row"><span class="category-bar-name">${cat}</span><span class="category-bar-pct">${pct}%</span></div><div class="category-bar-track"><div class="category-bar-fill" style="width:${pct}%"></div></div></div>`;
  }).join('');

  // Daily performance
  let perfRows = '';
  if (todayTasks.length > 0) {
    perfRows = todayTasks.map(t => {
      const done = t.state === 'finished';
      return `<div class="session-stat">
        <span class="session-stat-label" style="font-size:12px;">${t.category} — Task ${t.num}</span>
        <span class="session-stat-value ${done ? 'success' : ''}">${done ? msToHMS(t.elapsedMs) : (t.state === 'idle' ? 'Not started' : 'In progress')}</span>
      </div>`;
    }).join('');
  }

  lower.innerHTML = `
    <div class="section-card">
      <div class="section-card-header">Performance by Category</div>
      <div class="section-card-body">${catBars || '<p style="color:var(--text-muted);font-size:13px;">No data yet. Complete tasks to see category analytics.</p>'}</div>
    </div>
    <div class="section-card">
      <div class="section-card-header">Today's Task Breakdown</div>
      <div class="section-card-body">${perfRows || '<p style="color:var(--text-muted);font-size:13px;">No tasks started today.</p>'}</div>
    </div>
  `;
}

// ===================== HISTORY =====================
function renderHistory() {
  const history = load(KEYS.history, []);
  const tbody   = document.getElementById('history-tbody');
  if (!history.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:32px;">No history recorded yet. Complete your first day of tasks.</td></tr>`;
    return;
  }
  tbody.innerHTML = history.map(h => {
    const accuracy = h.completedCount > 0 ? Math.round((h.correct / h.completedCount) * 100) : 0;
    const badge = h.completedCount >= h.totalTasks && h.totalTasks > 0
      ? `<span class="badge-full">Complete</span>`
      : `<span class="badge-partial">${h.completedCount}/${h.totalTasks}</span>`;
    return `<tr>
      <td>${h.dateKey}</td>
      <td>${h.completedCount}/${h.totalTasks}</td>
      <td>${accuracy}%</td>
      <td>${msToHMS(h.totalTaskMs)}</td>
      <td>${msToHMS(h.breakMs||0)}</td>
      <td>${h.completedCount > 0 ? msToMinSec(h.totalTaskMs/h.completedCount) : '--'}</td>
      <td>${badge}</td>
    </tr>`;
  }).join('');
}

// ===================== REVIEW =====================
function renderReview() {
  const container = document.getElementById('review-container');
  const finished  = todayTasks.filter(t => t.state === 'finished');
  if (!finished.length) {
    container.innerHTML = `<div class="no-tasks-card"><h3>No Completed Tasks</h3><p>Complete tasks to review them here.</p></div>`;
    return;
  }
  container.innerHTML = finished.map(task => {
    const diffClass = { Easy:'diff-easy', Medium:'diff-medium', Hard:'diff-hard' }[task.difficulty] || 'diff-easy';
    return `<div class="review-card" style="margin-bottom:14px;">
      <div class="review-card-header">
        <span class="task-num">Task ${String(task.num).padStart(2,'0')}</span>
        <span class="task-category-badge">${task.category}</span>
        <span class="task-difficulty ${diffClass}">${task.difficulty}</span>
        <span class="result-chip correct">Completed</span>
      </div>
      <div class="review-card-body">
        <div class="review-question">${task.question}</div>
        <div class="review-answer-row">
          <span class="review-answer-label">Time Spent</span>
          <span class="review-answer-val">${msToHMS(task.elapsedMs)}</span>
        </div>
        <div class="review-answer-row">
          <span class="review-answer-label">Task</span>
          <span class="review-answer-val">${task.task}</span>
        </div>
        <div class="review-explanation">${task.answer}</div>
      </div>
    </div>`;
  }).join('');
}

// ===================== SETTINGS / RESET =====================
function confirmReset(type) {
  const messages = {
    today:'This will reset all of today\'s task progress, timers, and session data. Your history from previous days will be preserved.',
    all:  'This will permanently delete all productivity history, email data, question cycles, and settings. This action cannot be undone.'
  };
  const titles = { today:'Reset Today\'s Progress', all:'Reset All Data' };
  document.getElementById('confirm-title').textContent   = titles[type];
  document.getElementById('confirm-message').textContent = messages[type];
  APP_STATE.confirmAction = type;
  document.getElementById('confirm-overlay').classList.add('open');
}
function closeConfirm() {
  document.getElementById('confirm-overlay').classList.remove('open');
  APP_STATE.confirmAction = null;
}
function executeConfirm() {
  const action = APP_STATE.confirmAction;
  closeConfirm();
  if (action === 'today') {
    const key = todayKey();
    localStorage.removeItem(KEYS.todayTasks);
    localStorage.removeItem(KEYS.todayData);
    localStorage.removeItem(KEYS.session);
    localStorage.removeItem('cd_task_timers_' + key);
    todayTasks = [];
    // Mirror the reset to the cloud so it doesn't just resync back in.
    save(KEYS.todayTasks, null);
    save(KEYS.todayData, null);
    save(KEYS.session, null);
    save('cd_task_timers_' + key, null);
    if (window.CloudSync) window.CloudSync.flushNow();
    showToast('Today\'s progress has been reset.', 'warning');
    setTimeout(() => location.reload(), 800);
  } else if (action === 'all') {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('cd_task_timers_' + todayKey());
    // Mirror the wipe to the cloud.
    Object.values(KEYS).forEach(k => save(k, null));
    save('cd_task_timers_' + todayKey(), null);
    if (window.CloudSync) window.CloudSync.flushNow();
    showToast('All data has been cleared.', 'error');
    setTimeout(() => location.reload(), 800);
  }
}

// ===================== THEME =====================
function applyTheme(isDark) {
  document.documentElement.classList.toggle('theme-dark', isDark);
  const switchEl = document.getElementById('theme-switch-input');
  if (switchEl) switchEl.checked = isDark;
}
function toggleTheme(isDark) {
  save(KEYS.theme, isDark ? 'dark' : 'light');
  applyTheme(isDark);
  showToast(isDark ? 'Dark theme enabled.' : 'Light theme enabled.', 'success');
}
function initTheme() {
  const saved = load(KEYS.theme, 'light');
  applyTheme(saved === 'dark');
}

// ===================== ACCOUNT MENU / SYNC UI =====================
function toggleAccountMenu() {
  document.getElementById('account-menu').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('account-menu');
  const avatar = document.getElementById('user-avatar');
  if (!menu || !avatar) return;
  if (!menu.contains(e.target) && !avatar.contains(e.target)) menu.classList.remove('open');
});

function updateSyncUI(status, user) {
  const indicator = document.getElementById('sync-indicator');
  const label     = document.getElementById('sync-label');
  const avatar    = document.getElementById('user-avatar');
  const emailEl   = document.getElementById('account-menu-email');
  if (!indicator) return;

  indicator.classList.remove('syncing', 'synced', 'error');
  const labels = {
    'signed-out': 'Offline',
    'signing-in': 'Signing in…',
    'syncing':    'Syncing…',
    'synced':     'Synced',
    'error':      'Sync error',
  };
  label.textContent = labels[status] || status;
  if (status === 'syncing' || status === 'signing-in') indicator.classList.add('syncing');
  if (status === 'synced') indicator.classList.add('synced');
  if (status === 'error') indicator.classList.add('error');

  if (user) {
    const initials = (user.displayName || user.email || 'U')
      .split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    avatar.innerHTML = user.photoURL
      ? `<img src="${user.photoURL}" alt="${initials}" referrerpolicy="no-referrer" />`
      : initials;
    emailEl.textContent = user.email || user.displayName || 'Signed in';
  } else {
    avatar.textContent = 'SD';
    emailEl.textContent = 'Not signed in';
  }
}

// ===================== INIT =====================
let appBooted = false;

function bootAppUI() {
  // Runs the existing local-first app initialisation. Called once, after
  // we know whether the person is signed in (and, if so, once their cloud
  // data has been merged into localStorage so nothing renders stale).
  initTheme();
  initClock();
  initEmails();
  initSession();
  initTasks();
  updateSessionStats();

  const session = load(KEYS.session, {});
  if (session.sessionStartTs) {
    document.getElementById('s-login-time').textContent = formatTimeShort(new Date(session.sessionStartTs));
    startGlobalTimer();
  }
  const td = getTodayData();
  if (td.logoutTime) {
    document.getElementById('s-logout-time').textContent = formatTimeShort(new Date(td.logoutTime));
  }
  const streak = load(KEYS.streak, { count:0 });
  document.getElementById('s-streak').textContent = `${streak.count} days`;
  document.getElementById('badge-unread').textContent = getUnreadCount();
}

function revealApp(message) {
  document.getElementById('welcome-screen').style.display = 'none';
  const app = document.getElementById('app');
  app.classList.add('visible');
  if (message) showToast(message, 'success');
}

function initializeApp() {
  const gate    = document.getElementById('signin-gate');
  const bar     = document.getElementById('welcome-bar');
  const tagline = document.getElementById('welcome-tagline');
  const signinBtn = document.getElementById('google-signin-btn');

  // Wait for Firebase to tell us the auth state before doing anything else,
  // so we never flash locally-cached data that's about to be overwritten by
  // the signed-in account's cloud data (or vice versa).
  if (!window.CloudSync) {
    // firebase-sync.js failed to load (offline, blocked, etc). Fall back to
    // local-only mode so the app is still usable.
    bootAppUI();
    revealApp('Welcome back, Siddhay. (Offline mode — sign-in unavailable.)');
    return;
  }

  window.CloudSync.onStatusChange = (status, user) => {
    updateSyncUI(status, user);

    if (status === 'signing-in') {
      signinBtn.classList.add('loading');
      tagline.textContent = 'Opening Google sign-in…';
    }
    if (status === 'syncing') {
      gate.style.display = 'none';
      bar.style.display = 'block';
      tagline.textContent = 'Loading your workspace…';
    }
    if (status === 'error') {
      signinBtn.classList.remove('loading');
      tagline.textContent = 'Sign-in failed — please try again.';
      gate.style.display = 'flex';
      bar.style.display = 'none';
    }
    if (status === 'signed-out' && appBooted) {
      // Explicit sign-out from an already-booted app: reload into a clean,
      // signed-out state so no other account's data lingers on screen.
      location.reload();
    }
  };

  window.CloudSync.onDataReady = () => {
    if (appBooted) {
      // A later cloud sync (e.g. from another open tab/device) landed —
      // re-render the views that show synced data rather than reloading.
      todayTasks = load(KEYS.todayTasks, { tasks: [] }).tasks || todayTasks;
      renderAllTasks();
      updateProgressDisplay();
      if (APP_STATE.currentView === 'analytics') renderAnalytics();
      if (APP_STATE.currentView === 'history')   renderHistory();
      if (APP_STATE.currentView === 'review')    renderReview();
      if (APP_STATE.currentView === 'inbox')     renderEmailList();
      return;
    }
    appBooted = true;
    bootAppUI();
    revealApp(`Welcome back, ${window.CloudSync.user?.displayName?.split(' ')[0] || 'Siddhay'}.`);
  };
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
