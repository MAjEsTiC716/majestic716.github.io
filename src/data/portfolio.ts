export const highlights = [
  'Software Engineer at Oracle',
  'CI/CD and regression automation',
  'Oracle, AWS, Docker, Kubernetes, Terraform',
  'Database design, robotics, and teaching experience',
];

export const stats = [
  { value: '3+', label: 'professional engineering roles across Oracle, XPANSIV, and UNM' },
  { value: 'CI/CD', label: 'pipeline validation, dependency upgrades, and test automation' },
  { value: 'SQL + APIs', label: 'database design, cloud services, and backend workflows' },
  { value: 'Robotics', label: 'Raspberry Pi and Arduino experimentation beyond web systems' },
];

export const experience = [
  {
    role: 'Software Engineer',
    company: 'Oracle',
    location: 'Austin, Texas',
    period: 'July 2022 to Present',
    bullets: [
      'Developed and enhanced Jenkins pipelines to validate system upgrades and improve CI/CD test coverage.',
      'Implemented security patches and dependency upgrades across RPM packages, Maven libraries, and Go modules.',
      'Built automated test suites for a data synchronization service to improve regression coverage and repeatability.',
      'Supported migration and post-upgrade validation for rack applications moving from Oracle Linux 7 to Oracle Linux 8.',
      'Executed REST API fuzz testing and vulnerability scans to identify and remediate security issues.',
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Oracle',
    location: 'Austin, Texas',
    period: 'May 2021 to August 2021',
    bullets: [
      'Developed API features for Oracle Cloud Service Rover.',
      'Implemented new OCI CLI commands and generated SDK support for the added APIs.',
      'Worked in an Agile/Scrum process with demos, presentations, and technical documentation.',
    ],
  },
  {
    role: 'CS Lab Instructor',
    company: 'University of New Mexico',
    location: 'Albuquerque, New Mexico',
    period: 'August 2019 to May 2022',
    bullets: [
      'Taught Python labs covering fundamentals through object-oriented programming.',
      'Helped students debug code, improve programming habits, and understand core concepts.',
      'Assisted with assignments, projects, grading, and office hours.',
    ],
  },
  {
    role: 'DevOps Intern',
    company: 'XPANSIV',
    location: 'Albuquerque, New Mexico',
    period: 'May 2019 to August 2019',
    bullets: [
      'Created functional and integration tests for backend aggregation and processing workflows.',
      'Developed data parsing programs and uploaded outputs to Amazon S3.',
      'Used the Datadog API to monitor service health, traffic, latency, and error rates.',
      'Containerized services with Docker and integrated Jenkins pipelines for safer delivery.',
    ],
  },
];

export const projects = [
  {
    title: 'National Parks Database',
    summary:
      'A relational database designed for a U.S. National Parks website, built to support useful and varied queries rather than a narrow academic toy schema.',
    tech: ['Oracle SQL', 'Oracle Database 19c', 'LaTeX', 'Structured data files'],
    details: [
      'Modeled a database structure that could support flexible park, location, and query relationships.',
      'Used Oracle SQL and Oracle Database 19c as the implementation foundation.',
      'Prepared structured data in .DAT files and documented the system in LaTeX.',
      'Designed the project around practical querying, data organization, and maintainability.',
    ],
  },
  {
    title: 'Bluetooth Following Robot Platform',
    summary:
      'A robotics platform that followed a user’s phone using Bluetooth RSSI signal strength and coordinated multiple Raspberry Pis to estimate location.',
    tech: ['Raspberry Pi', 'Bluetooth', 'Distributed device coordination', 'Signal-based estimation'],
    details: [
      'Built a four-device setup with three Raspberry Pis collecting Bluetooth data and one processing the location estimate.',
      'Worked around Bluetooth hardware limitations by networking multiple devices together.',
      'Programmed inter-device communication and the logic for identifying the user position.',
      'Used the project to combine physical systems thinking with algorithmic problem solving.',
    ],
  },
];

export const skillGroups = [
  {
    title: 'Languages',
    items: ['Python', 'Java', 'Bash', 'SQL'],
  },
  {
    title: 'Cloud and Infra',
    items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
  },
  {
    title: 'Backend and Data',
    items: ['Oracle DBMS', 'PostgreSQL', 'Oracle SQL', 'REST APIs'],
  },
  {
    title: 'Testing and Security',
    items: ['Regression automation', 'Integration testing', 'REST fuzz testing', 'Vulnerability scans'],
  },
  {
    title: 'Workflow',
    items: ['Git', 'Bitbucket', 'Agile/Scrum', 'Technical demos and documentation'],
  },
  {
    title: 'Hardware',
    items: ['Raspberry Pi', 'Arduino', 'Robotics prototyping'],
  },
];

export const activity = [
  'Teacher for Middle School Robotics Club at Hope Christian School',
  'Programming workshop mentor for middle schoolers beginning in March 2026',
];
