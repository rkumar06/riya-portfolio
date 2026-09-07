// Summarized from Riya’s supplied LinkedIn profile. Update here as her work evolves.
export const portfolio = {
  name: 'Riya Kumar',
  role: 'Software engineer',
  location: 'New York',
  linkedin: 'https://www.linkedin.com/in/riya-kumar-6914921b8/',
  intro: 'I build machine learning platforms and data infrastructure at Disney Streaming.',
  about: 'My work brings together deep learning, time-series forecasting, and large-scale data pipelines to catch problems before they affect people.',
  experience: [
    {
      company: 'Disney Streaming',
      role: 'Software Engineer',
      period: '2024 — Now',
      description: 'Building an ML platform for financial anomaly detection, alongside streaming data pipelines on Databricks, Delta Lake, and AWS.',
    },
    {
      company: 'Tinder',
      role: 'Engineer, Programs Team',
      period: '2023',
      description: 'Built a custom project tracker and automations to keep teams connected and their data up to date.',
    },
    {
      company: 'Autodesk',
      role: 'Software Development, Identity Team',
      period: '2022',
      description: 'Automated employee access to the Heroku API using Python and AWS.',
    },
    {
      company: 'DRS RADA Technologies',
      role: 'Systems Engineering & Software Development',
      period: '2021',
      description: 'Developed radar software and led an intern team integrating radar, camera, and AI systems.',
    },
  ],
  projects: [
    {
      name: 'Financial Anomaly Detection Platform',
      tag: 'Patent pending',
      role: 'Disney Streaming',
      description:
        'An ML platform that catches financial anomalies before they affect the business, built on Databricks, Delta Lake, and AWS. The detection approach has a patent pending.',
    },
    {
      name: 'Ovo Box',
      tag: '2022 — 2024',
      role: 'Founder, started as Red Box',
      description:
        'A period-care subscription: members log symptoms each cycle, and their monthly box pairs a full restock of regular products with an AI-recommended sample matched to what they reported. Accepted into Berkeley SkyDeck\'s <a href="https://skydeck.berkeley.edu/program/" target="_blank" rel="noopener noreferrer">PAD-13</a> accelerator, won <a href="https://scet.berkeley.edu/scet-announces-collider-cup-x-winners-and-celebrates-outstanding-faculty-students-and-staff/" target="_blank" rel="noopener noreferrer">Collider Cup X</a>, and pitched on stage at the <a href="https://scet.berkeley.edu/scet-takes-the-global-stage-at-asian-leadership-conference/" target="_blank" rel="noopener noreferrer">Asian Leadership Conference</a> in Seoul.',
    },
    {
      name: 'Oddonym',
      tag: 'Side project',
      description:
        'A Wordle-style word-guessing game built as a full-stack final project, with a React frontend and a Node/SQLite backend.',
      link: { label: 'View on GitHub', href: 'https://github.com/rkumar06/oddonym' },
    },
  ],
  education: {
    school: 'University of California, Berkeley',
    degree: 'B.S. Electrical Engineering & Computer Science',
    period: '2020 — 2024',
    note: 'Also taught and helped run the Berkeley Method of Entrepreneurship Bootcamp as Head Teaching Assistant, 2022–2024.',
  },
};
