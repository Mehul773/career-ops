import fs from 'fs';
import yaml from 'js-yaml';

const profile = yaml.load(fs.readFileSync('./config/profile.yml', 'utf8'));
const template = fs.readFileSync('./templates/cv-template.html', 'utf8');

const name = profile.candidate.full_name;
const email = profile.candidate.email;
const phone = profile.candidate.phone;
const linkedin = profile.candidate.linkedin;
const portfolio = profile.candidate.portfolio_url;
const location = profile.candidate.location;

const commonExperience = `
    <div class="job">
      <div class="job-header">
        <span class="job-company">Matlab Infotech Pvt Ltd — WinChurch Claims Platform</span>
        <span class="job-period">May 2024 – April 2026</span>
      </div>
      <div class="job-role">Backend Engineer</div>
      <ul>
        <li>Migrated 78K+ claims, clients, and pension providers from a legacy Caseblock/GraphQL system to a new Node.js + Prisma + PostgreSQL backend. Configured Bull/Redis job queues to handle data mappings and retry logic.</li>
        <li>Optimized global search response times from 10 seconds to 700ms–1.5 seconds by implementing stored generated columns and PostgreSQL GIN indexes using trigram matching (pg_trgm) across tables.</li>
        <li>Reduced pagination API response times from 3–5 seconds to 300–700ms by optimizing Prisma database queries—removing population from count queries and stripping unused relations from list view responses.</li>
        <li>Diagnosed and resolved a critical production incident: Redis master-slave role conflict halted all claim automation. Restored correct master role configuration and hardened Redis with authentication to prevent unauthorized role changes.</li>
        <li>Developed queue-driven claim automation and SLA workflows using Bull/Redis. Configured delayed tasks, task dependencies, automatic task cancellation, and dynamic recalculation of delays.</li>
        <li>Integrated an automated digital mailroom pipeline to scan, download, and unzip files from an SFTP server, automatically mapping tax calculations, cheques, and letters to client claims using multi-tiered SQL matches.</li>
        <li>Configured Stripe payment flows (invoice creation, webhooks, checkout sessions) and set up New Relic dashboard alerts for Twilio, Azure, and SendGrid services.</li>
        <li>Built bulk export features using streaming libraries (archiver and PassThrough) to stream zipped CSV reports and PDFs directly to S3, resolving server out-of-memory errors on large data exports.</li>
      </ul>
    </div>
    
    <div class="job">
      <div class="job-header">
        <span class="job-company">Matlab Infotech Pvt Ltd — CrickEdge Live Cricket App</span>
        <span class="job-period">May 2024 – April 2026</span>
      </div>
      <div class="job-role">Backend Engineer</div>
      <ul>
        <li>Implemented JWT authentication and Google + Apple OAuth2 login flows for secure mobile client access.</li>
        <li>Applied region-based match prioritization to surface relevant matches by user geography.</li>
        <li>Supported app launch on Google Play and iOS App Store (10K+ downloads).</li>
        <li>Resolved a Redis role-change bug causing failover failures in production.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-header">
        <span class="job-company">Promact Infotech</span>
        <span class="job-period">January 2024 – April 2024</span>
      </div>
      <div class="job-role">Software Engineer Intern</div>
      <ul>
        <li>Implemented JWT authentication and role-based authorization in Node.js.</li>
        <li>Developed email notification and PDF export features using Node.js and Express.</li>
        <li>Participated in Agile sprints via Jira, contributing backend features from requirement to deployment.</li>
      </ul>
    </div>
`;

const commonProjects = `
    <div class="project">
      <div class="project-title">WinChurch Claims Platform</div>
      <div class="project-desc">REST API backend migrating 78K+ records with queue-based processing, Stripe payment gateways, database query optimization, SFTP mailroom ingestion, and AWS Lambda automations.</div>
      <div class="project-tech">Stack: Node.js, Express, Prisma, PostgreSQL, Redis, AWS Lambda, EventBridge, Stripe, Docker, CI/CD</div>
    </div>
    <div class="project">
      <div class="project-title">CrickEdge Live Cricket Score App</div>
      <div class="project-desc">Production mobile app backend serving cricket score updates, JWT authentication, OAuth2 login flows, serving 10K+ users.</div>
      <div class="project-tech">Stack: Node.js, Express, Redis, JWT, OAuth2 (Google, Apple)</div>
    </div>
`;

const commonEducation = `
    <div class="edu-item">
      <div class="edu-header">
        <span class="edu-title">Bachelor of Technology — Information Technology</span>
        <span class="edu-year">2020 – 2024</span>
      </div>
      <div class="edu-org">Dharmsinh Desai University, Nadiad, Gujarat</div>
      <div class="edu-desc">CGPA: 7.92 / 10</div>
    </div>
`;

const commonCertifications = `
    <div class="cert-item">
      <div class="cert-title">AWS Certified Solutions Architect – Associate (SAA-C03)</div>
      <div class="cert-org">AWS</div>
      <div class="cert-year">In Progress (2026)</div>
    </div>
`;

const commonSkills = `
    <div class="skills-grid">
      <div class="skill-item"><span class="skill-category">Languages:</span> JavaScript, TypeScript</div>
      <div class="skill-item"><span class="skill-category">Runtime & Frameworks:</span> Node.js, Express.js</div>
      <div class="skill-item"><span class="skill-category">Databases & ORMs:</span> MongoDB, MySQL, PostgreSQL, Prisma, Mongoose</div>
      <div class="skill-item"><span class="skill-category">Cloud & DevOps:</span> AWS Lambda, EventBridge, Docker, CI/CD, Git, GitHub Actions</div>
      <div class="skill-item"><span class="skill-category">Tools & Architecture:</span> REST APIs, Microservices, Redis, JWT, OAuth, Stripe Payment Gateways</div>
    </div>
`;

let html = template
  .replace(/\{\{LANG\}\}/g, 'en')
  .replace(/\{\{PAGE_WIDTH\}\}/g, '210mm')
  .replace(/\{\{NAME\}\}/g, name)
  .replace(/\{\{PHONE\}\}/g, phone)
  .replace(/\{\{EMAIL\}\}/g, email)
  .replace(/\{\{LINKEDIN_URL\}\}/g, 'https://' + linkedin)
  .replace(/\{\{LINKEDIN_DISPLAY\}\}/g, linkedin)
  .replace(/\{\{PORTFOLIO_URL\}\}/g, portfolio)
  .replace(/\{\{PORTFOLIO_DISPLAY\}\}/g, portfolio.replace('https://', ''))
  .replace(/\{\{LOCATION\}\}/g, location)
  .replace(/\{\{SECTION_SUMMARY\}\}/g, 'Professional Summary')
  .replace(/\{\{SUMMARY_TEXT\}\}/g, 'Node.js Backend Engineer with 2+ years of production experience building scalable REST APIs, microservices, and secure backend systems. Hands-on expertise with Node.js, Express.js, MongoDB, MySQL, PostgreSQL, Redis, Docker, and CI/CD pipelines. Strong track record in optimization and payment integrations: reduced a 10-second global search query to under 1.5 seconds across 78K records, built queue-based automation architectures using Bull/Redis, and integrated secure Stripe payment flows and webhooks. Adept at handling authentication (JWT, OAuth) and deploying containerized applications to AWS.')
  .replace(/\{\{SECTION_COMPETENCIES\}\}/g, 'Core Competencies')
  .replace(/\{\{COMPETENCIES\}\}/g, '<span class="competency-tag">Node.js / Express</span><span class="competency-tag">REST APIs & Microservices</span><span class="competency-tag">MongoDB & MySQL</span><span class="competency-tag">JWT & OAuth</span><span class="competency-tag">Redis Queues</span><span class="competency-tag">Stripe Payments</span><span class="competency-tag">Docker / AWS</span><span class="competency-tag">Performance Optimization</span>')
  .replace(/\{\{SECTION_EXPERIENCE\}\}/g, 'Work Experience')
  .replace(/\{\{EXPERIENCE\}\}/g, commonExperience)
  .replace(/\{\{SECTION_PROJECTS\}\}/g, 'Projects')
  .replace(/\{\{PROJECTS\}\}/g, commonProjects)
  .replace(/\{\{SECTION_EDUCATION\}\}/g, 'Education')
  .replace(/\{\{EDUCATION\}\}/g, commonEducation)
  .replace(/\{\{SECTION_CERTIFICATIONS\}\}/g, 'Certifications')
  .replace(/\{\{CERTIFICATIONS\}\}/g, commonCertifications)
  .replace(/\{\{SECTION_SKILLS\}\}/g, 'Skills')
  .replace(/\{\{SKILLS\}\}/g, commonSkills);

fs.writeFileSync('./scratch/cv-neosoft.html', html);
console.log('HTML CV generated for NeoSOFT');
