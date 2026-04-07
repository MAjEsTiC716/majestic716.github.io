export const highlights = [
  '4+ years building backend systems',
  'CI/CD, APIs, and regression automation',
  'Oracle Cloud Infrastructure, AWS, Docker, Kubernetes',
  'Database design, robotics, and teaching experience',
];

export const stats = [
  { value: '4+', label: 'years building and testing backend systems in Linux environments' },
  { value: 'CI/CD', label: 'Jenkins pipelines, release validation, and regression automation' },
  { value: 'APIs + SQL', label: 'REST APIs, OCI CLI/SDK generation, and relational database work' },
  { value: 'Robotics', label: 'Raspberry Pi and Arduino experimentation beyond web systems' },
];

export const experience = [
  {
    role: 'Software Engineer',
    company: 'Oracle',
    location: 'Austin, Texas',
    period: 'July 2022 to April 2026',
    bullets: [
      'Developed and enhanced Jenkins pipelines for system upgrade validation, expanding CI/CD test coverage and improving release confidence.',
      'Implemented and maintained security patches and dependency upgrades across RPM packages, Maven libraries, and Go modules.',
      'Built automated Java/Python test suites for a data synchronization service using a new architecture to improve repeatability for release validation.',
      'Supported migration of system rack applications from Oracle Linux 7 to Oracle Linux 8, coordinating validation, troubleshooting, and post-upgrade testing.',
      'Executed REST API fuzz testing and vulnerability scans to identify defects early, remediate security issues, and reduce deployment risk.',
      'Collaborated in Agile/Scrum workflows with engineers and stakeholders to break down work, validate changes, and deliver reliable backend software.',
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Oracle',
    location: 'Austin, Texas',
    period: 'May 2021 to August 2021',
    bullets: [
      'Developed API features for Oracle Cloud Service Rover and implemented corresponding OCI CLI commands and generated SDK updates.',
      'Contributed code, documentation, demos, and presentations in an Agile team environment.',
      'Worked across backend service and tooling workflows, gaining hands-on experience with cloud platform development and deployment processes.',
    ],
  },
  {
    role: 'DevOps Intern',
    company: 'XPANSIV',
    location: 'Albuquerque, New Mexico',
    period: 'May 2019 to August 2019',
    bullets: [
      'Created functional and integration tests for backend data aggregation and processing workflows.',
      'Developed data parsing programs to transform outputs and upload results to Amazon S3.',
      'Used the Datadog API to monitor service health, latency, error rates, and throughput between frontend and backend components.',
      'Containerized services with Docker and integrated Jenkins pipelines to support continuous integration and safer deployments.',
    ],
  },
  {
    role: 'CS Lab Instructor',
    company: 'University of New Mexico',
    location: 'Albuquerque, New Mexico',
    period: 'August 2019 to May 2022',
    bullets: [
      'Taught Python lab sessions covering programming fundamentals through object-oriented programming.',
      'Troubleshot student code, explained best practices, and provided clear written and verbal feedback during labs and office hours.',
      'Assisted with programming assignments and course project design, reinforcing communication and mentoring skills valuable in cross-functional engineering teams.',
    ],
  },
];

export const projects = [
  {
    title: 'National Parks Database',
    summary:
      'A relational database for a U.S. National Parks application, built to enable efficient querying across multiple related datasets.',
    tech: ['Oracle SQL', 'Oracle Database 19c', 'Relational schema design'],
    details: [
      'Designed and implemented a relational schema for a U.S. National Parks application.',
      'Used Oracle SQL and Oracle Database 19c as the implementation foundation.',
      'Structured the project around efficient querying across multiple related datasets.',
    ],
  },
  {
    title: 'Bluetooth Following Robot Platform',
    summary:
      'A multi-node Raspberry Pi robotic platform that used Bluetooth signal collection and inter-device communication to estimate user location in near real time.',
    tech: ['Raspberry Pi', 'Bluetooth', 'Inter-device communication', 'Signal processing'],
    details: [
      'Designed and built a multi-node robotic platform that collected Bluetooth signal data.',
      'Developed coordination logic between Raspberry Pi devices.',
      'Created an algorithm for processing signal data to determine user location.',
    ],
  },
];

export const skillGroups = [
  {
    title: 'Languages',
    items: ['Java', 'Python', 'Bash', 'SQL'],
  },
  {
    title: 'Backend and APIs',
    items: ['REST APIs', 'OCI CLI/SDK generation', 'Automated testing'],
  },
  {
    title: 'Databases',
    items: ['Oracle Database', 'PostgreSQL', 'Relational schema design'],
  },
  {
    title: 'Testing and Security',
    items: ['Dependency patching', 'RESTfuzz', 'Vulnerability scanning', 'Regression coverage'],
  },
  {
    title: 'CI/CD and Dev Tools',
    items: ['Jenkins', 'Git', 'SCM', 'Bitbucket', 'Issue tracking'],
  },
  {
    title: 'Platforms and Containers',
    items: ['Linux/Unix', 'Oracle Cloud Infrastructure', 'AWS', 'Docker', 'Kubernetes'],
  },
  {
    title: 'Ways of Working',
    items: ['Agile/Scrum', 'Documentation', 'Demos', 'Cross-functional collaboration'],
  },
  {
    title: 'Hardware',
    items: ['Raspberry Pi', 'Arduino', 'Robotics prototyping'],
  },
];

export const education = [
  {
    school: 'University of New Mexico',
    location: 'Albuquerque, New Mexico',
    credential: 'Bachelor of Science in Computer Science',
    detail: 'GPA: 3.42',
  },
  {
    school: 'University of New Mexico',
    location: 'Albuquerque, New Mexico',
    credential: 'Master of Science in Computer Science',
    detail: 'Expected Start: Fall 2026',
  },
];

export const activity = [
  'Teacher for Middle School Robotics Club at Hope Christian School',
];
