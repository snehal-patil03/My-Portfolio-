# Original User Request

## Initial Request — 2026-07-10T19:56:57+05:30

# Teamwork Project Prompt — Draft

> Status: Step 8 — Finalizing Verification & Approval
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

A production-grade, motion-driven personal portfolio website for Snehal Patil. The site reads like a premium, leather-bound certificate/portfolio booklet, digitized.

Working directory: c:/Users/Tanmay/OneDrive/Desktop/Portfolio
Integrity mode: development

## Requirements

### R1. Light Premium Design System
- Soft ivory paper base (`#F7F4ED`), parchment surfaces, ink indigo text, brass-foil accent (`#A9812F`).
- Typography: Fraunces (Display), Inter (Body), JetBrains Mono (Data/Tags).
- Strict layout: Generous margins, functional hairline rules. 
- **Strictly Prohibited:** Dark mode, particles, ambient backgrounds, looping effects, stock photos, fabricated headshots, or lorem ipsum.

### R2. Scroll-Driven Motion System
- Animations must be scrub-linked to scroll progress (GSAP + ScrollTrigger) with no auto-looping.
- Include zoom in/out at key transitions.
- **Projects Section:** Must be a pinned section where vertical scroll translates content horizontally (side-scrolling).
- **Mobile (<768px):** Disable scroll-jacking/pin patterns entirely, fallback to native scroll.
- **Reduced Motion:** Respect `prefers-reduced-motion` with simple fade fallbacks.

### R3. Exact Content Implementation
- Use the provided structured data for profile, summary, education, skills, experience, projects, and certifications verbatim.
- Flag the missing placeholder URLs (LinkedIn, GitHub, Portfolio link) for the user to fill later.

### R4. Tech Stack & Environment
- Next.js 14+ (App Router), TypeScript (strict mode), Tailwind CSS.
- GSAP 3.12+ (ScrollTrigger) and Framer Motion.
- Fully responsive (360px+), visible keyboard focus states.

## Acceptance Criteria

### Design and Content
- [ ] The site matches the exact color palette and typography (Fraunces/Inter/JetBrains Mono) specified.
- [ ] No dark mode toggle, no particle effects, no stock photos, no lorem ipsum.
- [ ] All text content matches the provided source of truth verbatim.

### Motion and Interaction
- [ ] Vertical scrolling drives horizontal translation in the Projects section on desktop.
- [ ] Mobile view uses standard vertical/horizontal scroll (no GSAP pinning).
- [ ] Scroll animations do not use auto-playing loops (purely scroll-scrubbed).
- [ ] Animations degrade to fades/static when `prefers-reduced-motion` is enabled.

### Quality and Performance
- [ ] Lighthouse scores meet targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] Project builds successfully without TypeScript or ESLint errors.

## Content Data (Source of Truth)
```yaml
profile:
  name: "Snehal Patil"
  location: "Pune, Maharashtra"
  phone: "+91 7620082273"   # render as tel: link
  email: "patilsnehal7620@gmail.com"  # render as mailto: link
  links: { linkedin: "PLACEHOLDER_URL", github: "PLACEHOLDER_URL", portfolio: "PLACEHOLDER_URL" }
  targetRoles: ["Software Engineer", "Software Developer", "Java Developer", "Associate Software Engineer"]
  openToRelocate: true
  availability: "Full-time"

summary: >
  MCA graduate (CGPA 9.78/10) with a strong foundation in Java, Python, SQL, and MySQL,
  and practical experience in Object-Oriented Programming (OOP), Database Management (RDBMS),
  and the Software Development Life Cycle (SDLC). Hands-on experience building CRUD-based web
  applications using Java, JDBC, PHP, HTML, CSS, JavaScript, and Bootstrap, along with working
  knowledge of JSP, Servlets, and basic React.js. Completed a Software Developer Internship
  applying these skills to real application modules, debugging, and database operations.

education:
  - degree: "Master of Computer Applications (MCA)"
    institute: "Shram Sadhana Bombay Trust's College of Engineering and Technology (KBCNMU), Jalgaon"
    years: "2024–2026"
    cgpa: "9.78/10"
  - degree: "Bachelor of Computer Applications (BCA)"
    institute: "Shram Sadhana Bombay Trust's College of Engineering and Technology (KBCNMU), Jalgaon"
    years: "2021–2024"
    cgpa: "9.5/10"

skills:
  languages: ["Python", "Java"]
  frontend: ["HTML", "CSS", "JavaScript", "Bootstrap"]
  webTech: ["JSP", "Servlets", "React.js (Basic)"]
  databases: ["SQL", "MySQL", "RDBMS", "JDBC"]
  coreConcepts: ["OOP", "DSA (Basic)", "SDLC", "CRUD Operations", "Manual Testing", "Problem Solving"]
  tools: ["Git", "GitHub", "VS Code"]

experience:
  - role: "Software Developer Intern"
    company: "GPT Software, Pune"
    date: "June 2026"
    bullets:
      - "Contributed to software development activities using Java, PHP, SQL, and MySQL, working on real application modules as part of the team."
      - "Developed and tested application modules following Software Development Life Cycle (SDLC) practices."
      - "Performed database operations, data management, and debugging tasks to ensure application reliability."
      - "Collaborated with team members on technical documentation, testing, and end-to-end project development."

projects:
  - title: "Company Billing System"
    stack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"]
    link: "PLACEHOLDER_URL"
    bullets:
      - "Built a web-based billing management system using PHP and MySQL, covering three core modules: customer management, product management, and billing."
      - "Implemented full CRUD operations across all modules for end-to-end record management."
      - "Integrated automated GST bill generation and secure database connectivity using MySQL."
  - title: "AI-Powered Food Delivery Platform"
    stack: ["Python", "Machine Learning", "Data Analysis"]
    bullets:
      - "Studied and applied Machine Learning concepts in Python for delivery route optimization and demand forecasting."
      - "Performed data analysis to identify demand patterns and support improved delivery planning."
      - "Authored and published a research paper in the International Journal of Progressive Research in Engineering, Management and Science (IJPREMS)."
  - title: "Teacher Record Management System"
    stack: ["Java", "JDBC", "MySQL"]
    bullets:
      - "Built a teacher record management application using Java, JDBC, and MySQL."
      - "Implemented full CRUD operations for efficient and accurate record management."
      - "Integrated secure JDBC-based database connectivity for reliable data storage and retrieval."

certifications:
  - "Research Publication Certificate — \"AI-Powered Food Delivery Platform\" (IJPREMS)"
  - "Infosys BPM CSR Training — Infosys Ltd."
```
