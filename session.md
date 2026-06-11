# Session Context

## 1. Operational Directives
- **Scraping Protected Domains**: Naukri and other protected domains trigger WAF/Access Denied via standard Playwright. The user has integrated `stealth-scraper.mjs` which relies on `cloakbrowser`.
- **What worked**: Installing `cloakbrowser` via `npm install cloakbrowser` resolved `ERR_MODULE_NOT_FOUND` errors when running the scraper. 
- **PowerShell Encoding**: When extracting job descriptions via Node scripts and piping to files (`> output.txt`), PowerShell may encode them in UTF-16LE. Ensure files are converted to UTF-8 (`Get-Content file.txt | Out-File -Encoding utf8 file_utf8.txt`) so tools and scripts can read them properly.
- **last30days Skill**: Do not use the `/last30days` skill for highly specific, database-like listicle queries (e.g., "Top 50 IT companies"). Use it for trend-research and sentiment analysis.
- **Session Logging Rule (CRITICAL)**: Do NEVER log specific job evaluation results, company names, scores, or detailed pipeline tracking metrics in `session.md`. These details strictly belong in the `applications.md` tracker. `session.md` is strictly for high-level operational learnings and system context.
- **PDF Generation Rule**: When generating CV PDFs, never hardcode or truncate the candidate's experience to save time. Always pull the full history directly from `cv.md` and map it completely to the template.
- **Skill Experience Rule**: The candidate does NOT have hands-on experience with Kubernetes. Do not add Kubernetes to their CV, skills lists, or application answers unless they explicitly acquire it.
## 2. Environmental Setup
- **last30days Skill**: Installed at `c:\Users\Pramukh\career-ops\.agents\skills\last30days`. Config located at `C:\Users\Pramukh\.config\last30days\.env`.
- **cloakbrowser**: Installed successfully to handle WAF protection for `naukri.com` and similar portals.
- **career-ops Pipeline**: Core system fully operational.

## 3. Current Project State
- **Goal**: Job search pipeline automation, evaluation, and application submission.
- **Completed Work**: Generated and verified ATS-optimized generic and tailored PDFs. Processed complete pipelines (Evaluate -> Report -> CV -> Tracker -> Apply) for Lever and Naukri postings. Drafted form-specific custom application responses securely within individual evaluation reports. Tracker updated with new `Applied` statuses via TSV merging.

## 4. User Preferences
- **Job Search Parameters**: The user is targeting "Node.js Backend Developer" or "Cloud Backend Engineer" positions in India (specifically remote, Ahmedabad, or Bangalore relocation) with a target compensation of 6 to 8 LPA.
- **Communication & Tool Usage**: Prefers autonomous deep-dives using specialized agent skills and tools. Appreciates proactive troubleshooting and expects session updates to remain highly concise to prevent long-term file bloat.
- **Technical Precision**: Expects rigorous accuracy regarding technical capabilities. Any skill not backed by hands-on experience (e.g., Kubernetes) must be completely omitted from all generated documentation and correspondence.
## Initialization Prompt (Paste at the START of a new chat) 
"Please read the file at session.md (or the respective path) before we begin. Act as an AI who learns from its mistakes and continuously improves. Use this session.md file to ingest past context so you do not waste tokens re-learning things you already know not to do. Keep my user preferences in mind at all times, and proactively use the proper tools/MCPs/skills whenever needed based on this context. Crucially, as we work, continuously evaluate and update this session.md file yourself. Add new sessions or operational learnings as you discover them, and update or remove old sections if you think they create confusion or are no longer relevant. Acknowledge that you understand these directives and have read the context, and let's begin our work."

## Session Update Prompt (Paste at the END of a chat) 
"We are wrapping up this session. Please review our entire chat history and update the session.md file to capture any new operational directives, environmental changes, project state updates, or user preferences we discussed today. Ensure the Initialization and Update prompts remain at the bottom of the file for future use."
