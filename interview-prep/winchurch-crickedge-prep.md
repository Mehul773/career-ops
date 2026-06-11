# Interview Prep: WinChurch & CrickEdge Master Guide

This guide compiles common interview questions, system design details, and recommended answers based on your actual work on **WinChurch** and **CrickEdge** at Matlab Infotech. It is designed to help you explain your technical choices clearly, realistically, and confidently without exaggerating.

---

## 0. How to Explain the WinChurch Project (The Elevator Pitch)

When an interviewer asks you to **"Explain the WinChurch project"** or **"What is WinChurch?"**, you should explain it in a structured, 3-tier format (Concept, Architecture, and Your Focus) to keep it clear and engaging:

### 1. The High-Level Business Concept (30 Seconds)
> "WinChurch is a claims and pension management platform designed for the UK market. The platform helps clients reclaim overpaid income tax from HMRC (the UK government tax authority) and track down lost pension providers. I worked as a Node.js Backend Engineer, owning tasks related to database optimization, large-scale data migration, asynchronous queue automation, and digital mailroom ingestion."

### 2. The Core Architecture & Data Flow (45 Seconds)
> "Technically, the project is structured as a Node.js monorepo using Express, Prisma, and PostgreSQL. The system has three main architectural flows:
> * **Ingestion (SFTP Pipeline):** An automated digital mailroom scans external SFTP folders, extracts scanned documents (like P800 tax letters and refund cheques), and matches them to client profiles in our DB.
> * **Queue Automation (Redis/Bull):** A distributed queue system processes automated email chasers and manages strict Service Level Agreements (SLAs) for claims.
> * **Serverless Automation (AWS Lambda):** Lightweight Lambdas running headless Chromium scripts automate document downloads and form submissions directly on government tax portals."

### 3. Your Role and Key Feature Deliveries (45 Seconds)
> "I joined the project as a Core Backend Engineer about 3 to 4 months after it started. As the system transitioned from initial prototyping to active production scaling, I was responsible for building out new core feature modules and expanding the platform:
> * **Digital Mailroom (SFTP Parser):** I designed and built the end-to-end SFTP file polling, extraction, and multi-tier SQL fallback matching engine to map inbound tax letters and cheques to client profiles.
> * **SLA & Queue Workflows:** I developed the Redis/Bull queue-driven claim automation task workflows, including the complex rescheduling algorithm when admins toggle SLAs on or off.
> * **Data Migration:** I owned the migration of 78K claims and documents from the legacy GraphQL system to our new PostgreSQL database.
> * **System & Performance Updates:** I resolved key performance bottlenecks, such as reducing global search times from 10 seconds to under 1.5 seconds using Postgres trigram GIN indexes, and refactoring API queries to optimize pagination."

---


## 1. How to Explain Your AI Tool Usage (Cursor / Claude)

**The Challenge:** You mentioned that you heavily use AI tools (Cursor, Claude Code) for development, and if asked to build everything from scratch without them, it would be difficult.
**The Strategy:** Do *not* hide that you use AI, but frame it as a modern developer's superpower. Forward-looking companies value engineers who can leverage AI to deliver 2–3x faster, as long as they understand *why* the code works and can debug it.

### 💡 Suggested Response:
> "I view AI coding assistants (like Cursor and Claude) as high-leverage development partners. I use them to write boilerplate code, write unit tests, generate Prisma migration files, and look up syntax quickly. This allows me to focus on the high-level system design: analyzing database query plans, structuring Redis queues, managing concurrency, and handling error fallbacks. 
> 
> I never copy-paste blindly. I make sure I understand the underlying system design of everything we build, which is how I was able to optimize our PostgreSQL global search from 10 seconds to under 1.5 seconds and resolve our production Redis failover locks."

---

## 2. General & Behavioral Questions

### Q1: "Tell me about yourself."
* **Goal:** A concise 2-minute pitch connecting your education, internship, and experience at Matlab Infotech.
* **Draft Answer:**
  > "I am a Node.js Backend Engineer with 2+ years of production experience building REST APIs, job queues, and backend systems. I graduated with a B.Tech in Information Technology in 2024. 
  > 
  > At Matlab Infotech, I worked as a Core Backend Engineer on WinChurch, joining the team about 3–4 months after the project began. I was responsible for building out new core feature modules from scratch—like the automated SFTP digital mailroom pipeline, the Bull/Redis SLA task rescheduling system, and the legacy 78K-record database migration. I also owned the optimization of our production systems, such as reducing our global search times from 10 seconds to under 1.5 seconds and resolving critical Redis queue locks.
  > 
  > I enjoy taking ownership of new features, building secure integrations, and optimizing query performance. I am currently looking for my next challenge where I can contribute to building and scaling robust backend architectures."

### Q2: "How do you handle tasks or technologies you don't know well?"
* **Goal:** Show adaptability, resourcefulness, and a structured learning process.
* **Draft Answer:**
  > "I start by breaking the task down into smaller components and reading the official documentation. I use AI tools to quickly bootstrap a minimal working prototype (a spike) so I can see the data flow in action. Once I have the prototype, I write basic integration tests to verify the behavior and edge cases. 
  > 
  > For instance, when I had to integrate SFTP downloads and zip parsing for our digital mailroom, I hadn't worked with node streams and ssh2 client libraries extensively. I built a separate local script to test connection handshakes and file parsing before integrating it into our main Express and Bull queue backend. This iterative approach ensures I don't break existing systems."

### Q3: "Tell me about a conflict you resolved or a production outage you debugged under pressure."
* **Goal:** The Redis Master-Slave Outage Story.
* **Draft Answer:**
  > "At Matlab Infotech, our automated claim processing tasks suddenly locked up in production. The Bull queues were failing to process jobs, halting our claim pipeline.
  > 
  > **Investigation:** I checked the logs and identified that the system was attempting to write to a read-only Redis node. The Redis master-slave roles had mismatched during a failover event, causing the write queries to be rejected.
  > 
  > **Resolution:** I verified the configuration, manually restored the correct master node, and confirmed that the queues resumed processing. To prevent this from happening again, I hardened the Redis setup by setting up password authentication across replication nodes and updating the failover client parameters. This taught me the importance of proper node health monitoring and securing internal database connections."

---

## 3. WinChurch Technical Deep-Dives

These are the most technical parts of your CV. Expect interviewers to dig deep here.

### Deep Dive A: Global Search Optimization (10s ➡️ <1.5s)
* **Question:** *"How did you optimize a search query from 10 seconds to under 1.5 seconds?"*
* **Key Terms to Mention:** *PostgreSQL GIN (Generalized Inverted Index), Trigram matching (`pg_trgm`), Stored Generated Columns, CTE (Common Table Expression), Union, Selective Hydration.*
* **Explanation:**
  > "We had a global search where users searched claims and clients by first name, last name, email, address, and claim reference. Because of complex table joins and sequential scans on 78K records, queries took up to 10 seconds.
  > 
  > **My Solution:**
  > 1. **Generated Columns:** I created stored generated columns in PostgreSQL (like `clientSearchText`) that concatenate searchable text fields on write. This eliminated the need to concatenate strings during search runtime.
  > 2. **Trigram GIN Indexing:** I added GIN indexes using trigram matching (`gin_trgm_ops` via the `pg_trgm` extension) on these columns to support fast, case-insensitive partial searches (`ILIKE %query%`).
  > 3. **UNION CTE:** I wrote a CTE query that ran three separate, lightweight searches (by client, address, and claim ref) to gather matching record IDs first, using `UNION` to combine them. This avoided large table joins initially.
  > 4. **Prisma Hydration:** Once we got the sorted, paginated IDs (e.g., just the 10 IDs needed for page 1), we queried Prisma to hydrate the full records. This reduced database memory usage and cut query times down to 700ms–1.5s."

### Deep Dive B: SLA Queue Toggles & Bull/Redis
* **Question:** *"How did you handle task rescheduling when SLA rules were toggled on and off?"*
* **Key Terms to Mention:** *Bull Queue, Redis delayed jobs, time offsets, enteredAt anchor.*
* **Explanation:**
  > "We used Bull and Redis to automate client chasers and task transitions. If a claim sits in a bucket, it triggers emails or status changes after a specific delay. However, admins need to toggle these SLAs on/off.
  > 
  > **My Solution:**
  > * **When SLA is toggled OFF:** The system fetches all active delayed jobs in the Bull queue for those claims and cancels them, updating their DB status to `REMOVED_FROM_QUEUE`.
  > * **When SLA is toggled ON:** We recalculate the delay. We look at when the task was initially scheduled (stored as `enteredAt` in the DB). We calculate the elapsed time (`now - enteredAt`). 
  >   - If the delay time has already passed while the SLA was off, we execute the task immediately or mark it completed depending on business rules.
  >   - If it hasn't passed, we calculate the remaining time (`delayMs - elapsed`) and reschedule a new delayed Bull job with that offset. This prevents tasks from resetting their timers and running late."

### Deep Dive C: Digital Mailroom (SFTP Ingestion & Fuzzy Match)
* **Question:** *"How did you ingest external documents and map them to client claims?"*
* **Key Terms to Mention:** *SFTP, `ssh2-sftp-client`, `adm-zip`, Multi-tier SQL match, Fuzzy matching (`fuzzball`).*
* **Explanation:**
  > "We received zip files containing P800 tax documents, cheques, and letters from an external scanning provider on an SFTP server.
  > 
  > **My Solution:**
  > 1. **Cron & Ingestion:** A scheduled cron job uses an SFTP client to pull new zip files, adds them to a processing queue, extracts them, and parses the metadata.
  > 2. **Multi-Tier SQL Fallback:** To match a document to a client claim, we run a query through four fallbacks:
  >    - *Tier 1:* Match by exact claim reference and last name.
  >    - *Tier 2:* Match by partial National Insurance (NI) number (handling wildcards) and last name.
  >    - *Tier 3:* Match by partial NI, last name, and first name.
  >    - *Tier 4:* Match by first 8 characters of the NI and last name (essential for cheques where suffixes were often truncated).
  > 3. **Leakage Prevention:** If a document matches *more than one* claim, we do not auto-associate it. We route it to a manual review queue to prevent client data leaks.
  > 4. **Fuzzy Matching:** For pension provider names (which users often misspelled, e.g., 'Aviva Pension' vs 'Aviva'), we checked exact matches, alias maps, and then used the `fuzzball` library's `token_sort_ratio` to auto-associate names with >90% similarity."

### Deep Dive D: Memory Leak Prevention on Bulk Exports
* **Question:** *"How did you handle bulk claim exports without crashing Node.js?"*
* **Key Terms to Mention:** *Readable Streams, `PassThrough` stream, S3 Multipart Upload, `archiver` library, Concurrency limiters (`p-limit`).*
* **Explanation:**
  > "When users wanted to download files for a bucket, the server had to generate a CSV and download hundreds of PDFs from S3, zip them, and upload the zip back to S3. Originally, this caused Node.js to run out of memory.
  > 
  > **My Solution:**
  > 1. **Streaming Data:** Instead of loading all PDF buffers and CSV data into memory, I used the `archiver` library to stream the zip on-the-fly.
  > 2. **PassThrough Stream:** I piped the zip output directly into a `PassThrough` stream, which was fed into AWS S3's multipart upload client. This meant bytes were sent to S3 as they were zipped, keeping memory usage flat.
  > 3. **Batching and Concurrency:** We queried the database in batches of 500. We downloaded the S3 attachments in parallel but throttled the concurrency using `p-limit` to avoid hitting network/API rate limits."

---

## 4. CrickEdge Technical Deep-Dives

### Deep Dive A: JWT & Apple/Google Login
* **Question:** *"How did you handle authentication for CrickEdge?"*
* **Explanation:**
  > "I implemented OAuth2 login flows using Google and Apple authentication. When a mobile client authenticates with Google or Apple, the backend receives the identity token, verifies it against Google/Apple public keys, and checks if the user exists in our database. We then generate a JWT containing the user's ID and role, which the mobile app sends in the header of subsequent requests."

### Deep Dive B: Region-Based Prioritization
* **Question:** *"How did you prioritize match lists geographically?"*
* **Explanation:**
  > "Since cricket matches happen worldwide, users in India want to see Indian domestic matches first, while users in the UK or Australia want to see their local matches. I checked the user's incoming IP address or request country code and sorted the matches returned by the API by prioritizing matches involving teams from their geographical region."

---

## 5. Technical Prep Checklist (Self-Study)

Make sure you have basic definitions ready for:
* **Postgres Indexes:** What is a GIN index vs. a B-Tree index? (B-Tree is for comparisons like `=`, `>`, `<`; GIN is for composite/array data and trigram matching).
* **Redis Data Structures:** What does Bull queue use? (Redis Sorted Sets `zset` for delayed jobs, Lists/Hashes for active jobs).
* **Bull Queue states:** Active, Delayed, Waiting, Failed, Completed.
* **Multipart Upload (S3):** Why do we use it? (Allows uploading large files in chunks, which is essential for streaming uploads).
* **Handlebars vs. Regex Fallback:** Why did Handlebars compile throw errors? (Nested brackets, missing variables. Regex fallback does simple search-and-replace for `{{variable}}` without compiling the AST).

---

> [!TIP]
> **Pro-Tip for Interviews:** When describing your work, always use the **STAR+R** framework (Situation, Task, Action, Result, and Reflection). Focus on the **Action** (what *you* did) and the **Result** (specific improvements, e.g. latency reduced, crashes fixed). 
