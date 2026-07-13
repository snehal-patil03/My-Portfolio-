export const profile = {
  name: 'Snehal Patil',
  location: 'Pune, Maharashtra',
  phone: '+91 7620082273',
  email: 'patilsnehal7620@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/snehal-patil-b04277261/',
    github: 'https://github.com/snehal-patil03',
    portfolio: 'PLACEHOLDER_URL', // TODO: Replace with actual Portfolio URL
  },
  targetRoles: ['Software Engineer', 'Software Developer', 'Java Developer', 'Associate Software Engineer'],
  openToRelocate: true,
  availability: 'Full-time' as const,
};

export const summary = `MCA graduate (CGPA 9.78/10) with a strong foundation in Java, Python, SQL, and MySQL, and practical experience in Object-Oriented Programming (OOP), Database Management (RDBMS), and the Software Development Life Cycle (SDLC). Hands-on experience building CRUD-based web applications using Java, JDBC, PHP, HTML, CSS, JavaScript, and Bootstrap, along with working knowledge of JSP, Servlets, and basic React.js. Completed a Software Developer Internship applying these skills to real application modules, debugging, and database operations.`;

export const education = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institute: "Shram Sadhana Bombay Trust's College of Engineering and Technology (KBCNMU), Jalgaon",
    years: '2024–2026',
    cgpa: '9.78/10',
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    institute: "Shram Sadhana Bombay Trust's College of Engineering and Technology (KBCNMU), Jalgaon",
    years: '2021–2024',
    cgpa: '9.5/10',
  },
];

export const skills = {
  languages: ['Python', 'Java'],
  frontend: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
  webTech: ['JSP', 'Servlets', 'React.js (Basic)'],
  databases: ['SQL', 'MySQL', 'RDBMS', 'JDBC'],
  coreConcepts: ['OOP', 'DSA (Basic)', 'SDLC', 'CRUD Operations', 'Manual Testing', 'Problem Solving'],
  tools: ['Git', 'GitHub', 'VS Code'],
};

export const skillCategories = [
  { label: 'Languages', items: skills.languages },
  { label: 'Frontend', items: skills.frontend },
  { label: 'Web Technologies', items: skills.webTech },
  { label: 'Databases', items: skills.databases },
  { label: 'Core Concepts', items: skills.coreConcepts },
  { label: 'Tools', items: skills.tools },
];

export const experience = [
  {
    role: 'Software Developer Intern',
    company: 'GPT Software, Pune',
    date: 'June 2026',
    bullets: [
      'Contributed to software development activities using Java, PHP, SQL, and MySQL, working on real application modules as part of the team.',
      'Developed and tested application modules following Software Development Life Cycle (SDLC) practices.',
      'Performed database operations, data management, and debugging tasks to ensure application reliability.',
      'Collaborated with team members on technical documentation, testing, and end-to-end project development.',
    ],
  },
];

export const projects = [
  {
    title: 'Company Billing System',
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    link: 'PLACEHOLDER_URL', // resume shows "View Project" label, no URL extracted
    bullets: [
      'Built a web-based billing management system using PHP and MySQL, covering three core modules: customer management, product management, and billing.',
      'Implemented full CRUD operations across all modules for end-to-end record management.',
      'Integrated automated GST bill generation and secure database connectivity using MySQL.',
    ],
  },
  {
    title: 'AI-Powered Food Delivery Platform',
    stack: ['Python', 'Machine Learning', 'Data Analysis'],
    bullets: [
      'Studied and applied Machine Learning concepts in Python for delivery route optimization and demand forecasting.',
      'Performed data analysis to identify demand patterns and support improved delivery planning.',
      'Authored and published a research paper in the International Journal of Progressive Research in Engineering, Management and Science (IJPREMS).',
    ],
  },
  {
    title: 'Teacher Record Management System',
    stack: ['Java', 'JDBC', 'MySQL'],
    bullets: [
      'Built a teacher record management application using Java, JDBC, and MySQL.',
      'Implemented full CRUD operations for efficient and accurate record management.',
      'Integrated secure JDBC-based database connectivity for reliable data storage and retrieval.',
    ],
  },
];

export const certifications = [
  {
    title: 'Research Publication Certificate',
    details: '"AI-Powered Food Delivery Platform" (IJPREMS)',
    file: '/Research Publication Certificate.pdf'
  },
  {
    title: 'Infosys BPM CSR Training',
    details: 'Infosys Ltd.',
    file: '/Infosys BPM CSR Training.jpeg'
  },
  {
    title: 'Milestone Certificate',
    details: 'Learning Milestone Achievement',
    file: '/Milestone.jpeg'
  },
  {
    title: 'Soft Skill Training Certificate',
    details: 'Rubicon Skill Development',
    file: '/Soft skill training certificate .jpeg'
  }
];

export const credentialStats = [
  { value: '9.78', label: 'CGPA', sublabel: 'MCA' },
  { value: '3', label: 'Shipped Projects', sublabel: 'Full-Stack' },
  { value: '1', label: 'Published Paper', sublabel: 'IJPREMS' },
];
