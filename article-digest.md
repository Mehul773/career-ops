# Article Digest -- Proof Points
# Read by career-ops at evaluation time to surface concrete wins per role.
# All metrics below are real and verified from production experience.

---

## Global Search Optimization — WinChurch Claims Platform

**Hero metric:** Search API response reduced from 10 seconds to 700ms–1.5 seconds on 78K+ records

**Context:** After migrating 78K claims from a legacy system, the global search API became unusably slow. Users could search by any field — name, address, claim reference, status, DOB, tax year — across 3 joined tables.

**Root cause:** pg-trgm OR query joining `claims`, `clients`, and `users` tables with too many fields per table. The combined OR condition across all searchable columns caused full table scans on every request.

**Fix:** Created a single normalized `searchField` column per table. For clients: `firstName + middleName + lastName + DOB`. For claims: claim reference + status + taxYear. For users: name + email. Now the OR query hits one field per table — 3 conditions instead of 20+.

**Stack:** Node.js, PostgreSQL, pg-trgm, Prisma

**Proof points:**
- 10s → 700ms–1.5s response time (7-14x improvement)
- Works across 78K+ claims, clients, and users
- No index changes required — search field is indexed with GIN for pg-trgm

---

## Pagination Performance Fix — Claim & Client List APIs

**Hero metric:** List API response reduced from 3–5 seconds to 300–700ms

**Context:** After DB migration, the claim and client list APIs became slow under normal pagination. Even fetching page 1 of 20 results took 3–5 seconds.

**Root cause:** Prisma `include` (population) was running on all 78K records to generate the count for pagination — not just the current page. Additionally, several API endpoints were including related table data that was never rendered in the UI.

**Fix:**
1. Removed `include` from count queries — count only needs the total number, not populated fields
2. Audited all list endpoints and stripped unnecessary `include` blocks for fields not shown in UI
3. Applied these changes across claim list, client list, and related paginated endpoints

**Stack:** Node.js, Prisma, PostgreSQL

**Proof points:**
- 3–5s → 300–700ms response time (5-10x improvement)
- Applies to all paginated endpoints on 78K record dataset
- No schema changes — pure query optimization

---

## 78K Record DB Migration — Legacy GraphQL to Prisma/PostgreSQL

**Hero metric:** Zero data loss migration of 78K+ claims, clients, pension providers, and documents

**Context:** WinChurch had a legacy Caseblock/GraphQL system with its own schema. The new system had a completely different data model. Direct migration caused timeouts — 78K records with complex relationships were too large to process in one shot.

**Architecture:**
- Queue-based processing with retry mechanism (Redis-backed job queue)
- Schema mapping designed in collaboration with client (decided which legacy fields to include, transform, or discard)
- Handled: claims, clients, pension providers, documents, relationships between all entities
- Retry logic for failed records — each failed job retried with exponential backoff
- Validated migrated records count against source at end of each batch

**Stack:** Node.js, Redis (job queues), Prisma, PostgreSQL, legacy GraphQL/Caseblock

**Proof points:**
- 78K+ records migrated successfully with zero data loss
- Queue + retry prevented any single failure from breaking the full migration
- Schema mapping decisions documented and signed off with client before migration run

---

## Redis Master-Slave Failover Incident — Production Resolution

**Hero metric:** Diagnosed and resolved production outage; secured Redis to prevent recurrence

**Context:** The entire queue-based claim automation pipeline stopped working. Claims stopped moving through statuses, welcome emails stopped sending, chaser emails stopped sending. Everything queue-dependent halted.

**Root cause:** The main Redis instance (master) had been demoted to slave, and another Redis instance had promoted itself to master. Since the application was pointing to the original instance (now slave), writes were failing silently — slaves are read-only.

**Resolution:**
1. Identified the role change via Redis `INFO replication` command
2. Restored correct master-slave configuration
3. Hardened Redis with a strong `requirepass` auth password — role changes now require authentication, preventing any external process from running `SLAVEOF` or `REPLICAOF` commands

**Stack:** Redis (master-slave replication), Node.js job queues

**Proof points:**
- Full queue automation restored after incident resolution
- Auth hardening implemented — no recurrence since fix
- Incident led to adding Redis replication health to New Relic monitoring

---

## AWS Lambda Automation Suite — WinChurch

**Hero metric:** 3 serverless functions automating government form submission, email webhooks, and API subscription renewal

**Context:** WinChurch needed to automate interactions with the UK government portal, surface client emails inside the platform, and keep the Microsoft Graph API subscription alive.

**Functions built:**

1. **UK Government Bot Lambda** — Node.js automation bot that logs into the UK government portal, fills and submits forms on behalf of clients, and checks authorization status. Triggered per claim event.

2. **Microsoft Graph Email Webhook Lambda** — Receives email webhook payloads from Microsoft Graph API and stores/surfaces them inside the WinChurch platform via Graph API. Allows the team to see client emails directly in their dashboard.

3. **Graph API Subscription Renewal Lambda** — Microsoft Graph email subscriptions expire every few days. This Lambda runs on an EventBridge cron schedule (daily) to renew the subscription automatically, ensuring webhook continuity without manual intervention.

**Stack:** AWS Lambda, AWS EventBridge, Microsoft Graph API, Node.js

**Proof points:**
- Eliminated manual government form submission per claim
- Email webhook continuity maintained without manual renewal
- EventBridge cron pattern reusable for any expiring third-party API token/subscription

---

## CrickEdge — Real-Time Cricket Score App

**Hero metric:** 10K+ downloads on Android and iOS; eliminated polling with Firebase real-time listeners

**Context:** CrickEdge is a live cricket scoring application for Android and iOS. The original architecture required mobile clients to poll the backend for score updates.

**Architecture change:**
- Backend writes score updates to Firebase Realtime Database
- Mobile clients subscribe to Firebase real-time listeners
- On any backend state change, Firebase pushes updates to all connected clients instantly
- No polling required — client battery and bandwidth usage reduced, update latency near-zero

**Additional features:**
- JWT authentication + Google and Apple OAuth2 login
- Region-based match prioritization (users see local matches first)
- Redis role-change bug fix in production (similar pattern to WinChurch incident)

**Stack:** Node.js, Firebase Realtime Database, Redis, JWT, OAuth2

**Proof points:**
- 10K+ downloads — live on Google Play and iOS App Store
- Real-time update latency: near-zero (Firebase push vs polling interval)
- Production Redis bug diagnosed and resolved without downtime
