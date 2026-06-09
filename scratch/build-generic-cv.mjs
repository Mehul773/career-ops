import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const templatePath = resolve(rootDir, 'templates', 'cv-template.html');
const outputPath = resolve(rootDir, 'output', 'cv-mehul-chovatiya-generic-v2.html');

let html = readFileSync(templatePath, 'utf-8');

const replacements = {
  '{{LANG}}': 'en',
  '{{PAGE_WIDTH}}': '210mm',
  '{{NAME}}': 'Mehul Chovatiya',
  '{{PHONE}}': '+91-9978193069',
  '{{EMAIL}}': 'mehulchovatiya773@gmail.com',
  '{{LINKEDIN_URL}}': 'https://linkedin.com/in/mehul-chovatiya-15a0521ba',
  '{{LINKEDIN_DISPLAY}}': 'linkedin.com/in/mehul-chovatiya-15a0521ba',
  '{{PORTFOLIO_URL}}': 'https://mehul773.github.io/',
  '{{PORTFOLIO_DISPLAY}}': 'mehul773.github.io (Portfolio)',
  '{{LOCATION}}': 'Jamnagar, Gujarat, India (Open to Remote / Relocation)',
  '{{SECTION_SUMMARY}}': 'Professional Summary',
  '{{SUMMARY_TEXT}}': 'Node.js Backend Engineer with 2+ years of production experience building scalable REST APIs, real-time architectures, and event-driven systems in Node.js. Hands-on with Redis, PostgreSQL, MongoDB, Prisma, AWS Lambda, EventBridge, Docker, Firebase, Stripe, Razorpay, and JWT-based auth. Track record of solving hard production problems: reduced a 10-second search query to under 1.5 seconds across 78K records, resolved a Redis master-slave failover incident that halted all automation, and migrated a legacy 78K-record GraphQL system to a new Prisma/PostgreSQL backend using queue-based processing with retry logic. Currently pursuing AWS Certified Solutions Architect – Associate (SAA-C03); available to join immediately.',
  '{{SECTION_COMPETENCIES}}': 'Core Competencies',
  '{{COMPETENCIES}}': `
      <span class="competency-tag">Node.js & Express.js</span>
      <span class="competency-tag">REST API Architecture</span>
      <span class="competency-tag">Database Migration & Query Tuning</span>
      <span class="competency-tag">Redis Caching & Replication</span>
      <span class="competency-tag">Asynchronous Queues & Jobs</span>
      <span class="competency-tag">AWS Serverless Integrations</span>
      <span class="competency-tag">Real-Time Listeners (Firebase DB)</span>
      <span class="competency-tag">Docker Containerization</span>
  `,
  '{{SECTION_EXPERIENCE}}': 'Work Experience',
  '{{EXPERIENCE}}': `
    <div class="job">
      <div class="job-header">
        <span class="job-company">Matlab Infotech Pvt Ltd</span>
        <span class="job-period">May 2024 — April 2026</span>
      </div>
      <div class="job-role">Software Engineer <span class="job-location">— Surat, Gujarat, India</span></div>
      <ul>
        <li><strong>Backend Query Optimization:</strong> Reduced search API query latency from 10s to 700ms–1.5s for 78K+ records on WinChurch platform by normalizing joined-table fields and adding pg-trgm GIN indexing.</li>
        <li><strong>Serverless Cloud Integration:</strong> Automated external portal form submissions using Node.js scripts deployed on AWS Lambda; engineered Microsoft Graph webhook listeners using Lambda and EventBridge daily cron renewals.</li>
        <li><strong>Infrastructure Incident Response:</strong> Diagnosed and resolved a production Redis master-slave replication outage that halted automated mail queues; hardened Redis configuration with authentication.</li>
        <li><strong>Real-Time Architecture:</strong> Replaced polling-based updates on CrickEdge score app (10K+ downloads) with Firebase Realtime Database listeners, drastically reducing database overhead and update latency.</li>
        <li><strong>Data Migration Pipeline:</strong> Migrated 78K+ legacy GraphQL records to Prisma and PostgreSQL using custom Redis-backed job queues with exponential-backoff retry workers, ensuring zero data loss.</li>
        <li><strong>Security & Authentication:</strong> Designed JWT token authentication middleware, role-based access control (RBAC), and Google + Apple OAuth2 social login integrations.</li>
        <li><strong>DevOps Deployment:</strong> Configured New Relic application monitoring dashboards and managed containerized deployments using Docker and Coolify.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-header">
        <span class="job-company">Promact Infotech</span>
        <span class="job-period">January 2024 — April 2024</span>
      </div>
      <div class="job-role">Software Engineer Intern <span class="job-location">— Vadodara, Gujarat, India</span></div>
      <ul>
        <li><strong>Backend Development:</strong> Built server-side REST APIs using Node.js, implementing JWT authentication and endpoint access control rules.</li>
        <li><strong>Fullstack Collaboration:</strong> Developed dashboard components, email alert webhooks, and automated PDF export systems using React.js and Node.js.</li>
      </ul>
    </div>
  `,
  '{{SECTION_PROJECTS}}': 'Projects',
  '{{PROJECTS}}': `
    <div class="project">
      <span class="project-title">WinChurch — Claims Management Platform</span>
      <a class="project-link" href="https://github.com/jackwinchurch/winchurch" target="_blank">github.com/jackwinchurch/winchurch</a>
      <span class="project-badge">Node.js, Express, Prisma, PostgreSQL, Redis, AWS Lambda, Docker</span>
      <div class="project-desc">Production backend managing 78K+ claims. Optimized search query latency from 10s to 700ms–1.5s, migrated 78K+ records with zero data loss, and automated UK government portal submissions via AWS Lambda.</div>
    </div>
    
    <div class="project">
      <span class="project-title">CrickEdge — Live Cricket Score App</span>
      <a class="project-link" href="https://github.com/hardikbeladiya/cricket-backend" target="_blank">github.com/hardikbeladiya/cricket-backend</a>
      <span class="project-badge">Node.js, Firebase Realtime Database, Redis, JWT, OAuth2</span>
      <div class="project-desc">Live mobile score delivery app with 10K+ downloads. Replaced database polling with Firebase Realtime Database listeners for near-instant score updates.</div>
    </div>
  `,
  '{{SECTION_EDUCATION}}': 'Education',
  '{{EDUCATION}}': `
    <div class="edu-item">
      <div class="edu-header">
        <span class="edu-title">Bachelor of Technology in Information Technology <span class="edu-org">— Dharmsinh Desai University</span></span>
        <span class="edu-year">2020 — 2024</span>
      </div>
      <div class="edu-desc">Nadiad, Gujarat, India | CGPA: 7.92 / 10</div>
    </div>
  `,
  '{{SECTION_CERTIFICATIONS}}': 'Certifications',
  '{{CERTIFICATIONS}}': `
    <div class="cert-item">
      <span class="cert-title">AWS Certified Solutions Architect – Associate (SAA-C03)</span>
      <span class="cert-org">AWS</span>
      <span class="cert-year">In Progress (Exam scheduled 2026)</span>
    </div>
  `,
  '{{SECTION_SKILLS}}': 'Technical Skills',
  '{{SKILLS}}': `
    <div class="skills-grid">
      <div class="skill-item"><span class="skill-category">Languages & Runtimes:</span> JavaScript (ES6), TypeScript, Node.js</div>
      <div class="skill-item"><span class="skill-category">Frameworks & ORM:</span> Express.js, NestJS (Learning), Prisma, React.js</div>
      <div class="skill-item"><span class="skill-category">Databases & Caching:</span> PostgreSQL, MongoDB, MySQL, Redis (Replication, Job Queues)</div>
      <div class="skill-item"><span class="skill-category">AWS Cloud Services:</span> AWS Lambda, AWS EventBridge, EC2, S3, IAM (Studying SAA-C03)</div>
      <div class="skill-item"><span class="skill-category">DevOps & Tooling:</span> Docker, Coolify, Git, CI/CD Pipelines, New Relic, Agile/Scrum (Jira)</div>
      <div class="skill-item"><span class="skill-category">Auth & Security:</span> JWT, OAuth2 (Google/Apple), Role-Based Access Control (RBAC)</div>
      <div class="skill-item"><span class="skill-category">Payments & Webhooks:</span> Stripe (invoices, checkout, webhooks), Razorpay, Microsoft Graph Webhooks</div>
    </div>
  `
};

for (const [key, value] of Object.entries(replacements)) {
  html = html.replaceAll(key, value.trim());
}

writeFileSync(outputPath, html);
console.log(`HTML generated at ${outputPath}`);
