import { Project } from '../types';

export const mlProjects: Project[] = [
  {
    title: 'AI Chatbot for Truck Dispatching',
    date: 'Smart ETA Technologies - Developer Intern Project',
    description:
      'A Python-based AI chatbot designed to improve truck dispatching efficiency and compliance.',
    bullets: [
      'Improved compliance tracking through intelligent automation',
      'Connected with Google Sheets using Python, Pandas, and Seaborn for analysis and visualization',
      'Structured JSON and optimized query logic to enhance AI response accuracy and performance',
    ],
    technologies: ['Python', 'Ollama', 'Pandas', 'Seaborn'],
  },
  {
    title: 'ML Model for Phone Dispatchers',
    date: 'BYU-I Support Center - Software Engineer Project',
    description:
      'A proof-of-concept machine learning model built to increase efficiency for 100+ phone dispatchers.',
    bullets: [
      'Python-based ML model',
      'Designed to optimize dispatcher workflows',
      'Part of my current role at BYU-I Support Center',
      'Integrated into existing support center infrastructure',
    ],
    technologies: ['Python', 'Machine Learning'],
  },
  {
    title: 'NLP Project (Dr. Seuss + Shrek Stories)',
    date: 'April 2025',
    description:
      'An exploration of creativity and coherence in AI-generated writing using vastly different literary sources.',
    bullets: [
      'Built to explore creativity and coherence in AI-generated writing using vastly different literary sources',
      'Trained an RNN to generate coherent text based on a blend of Shrek scripts and Dr. Seuss stories',
      'Focused on NLP model fine-tuning for narrative style and syntactic coherence',
    ],
    technologies: ['Python', 'RNN', 'NLP'],
  },
  {
    title: 'Housing Prices Prediction',
    date: 'Kaggle Competition | March 2025',
    description:
      'A machine learning project focused on improving real estate price estimation.',
    bullets: [
      'Tackled the problem of price estimation inconsistencies in regional real estate data',
      'Built an XGBoost model to predict home prices; reduced RMSE from 200K to 80K',
      'Discovered bedroom count as a key predictor through feature analysis',
    ],
    links: [
      {
        label: 'Model Notebook',
        url: 'https://colab.research.google.com/drive/1xPUwOrGVKCNjNyXkk3zJCoIlisIsM4pH?authuser=2',
      },
      {
        label: 'Executive Summary',
        url: 'https://docs.google.com/document/d/1rAuegfhK1OltdOqjMKQD-Rnq8uBqTSO5SRXKh7u4Pus/edit?tab=t.0',
      },
    ],
    technologies: ['Python', 'XGBoost', 'Kaggle'],
  },
  {
    title: 'Car Price Prediction Project',
    date: 'Kaggle Competition | February 2025',
    description:
      'A neural network approach to used car marketplace valuation.',
    bullets: [
      'Created to simulate used car marketplace valuation using historical feature-rich datasets',
      'Developed a neural network model with log-transformed targets to improve accuracy',
      'Validated model improvements with lower prediction variance',
    ],
    links: [
      {
        label: 'Model Notebook',
        url: 'https://colab.research.google.com/drive/1PoCT-aa0YpLfFG6iJ5XPfQ7c1o3YM8EO?authuser=2',
      },
    ],
    technologies: ['Python', 'Neural Networks', 'Kaggle'],
  },
  {
    title: 'Bike Rental Demand Prediction',
    date: 'Kaggle Competition | January 2025',
    description:
      'A business-focused forecasting model for bike rental inventory planning.',
    bullets: [
      'Targeted business needs to better forecast rental spikes for inventory and maintenance planning',
      'Preprocessed and optimized data to train a high-accuracy neural network',
      'Tuned hyperparameters and model architecture to improve demand forecasts',
    ],
    links: [
      {
        label: 'Model Notebook',
        url: 'https://colab.research.google.com/drive/1hHUBGvaPN7hCKMP3_TRf6HsBhu8oEy-e?authuser=2#scrollTo=5eCzdA2mtb0n',
      },
      {
        label: 'Executive Summary',
        url: 'https://docs.google.com/document/d/1FdUrsoVyscICQBuCsmbJxblAXR3PwXHY/edit',
      },
    ],
    technologies: ['Python', 'Neural Networks', 'Kaggle'],
  },
  {
    title: 'Bank Customer Retention ML Model',
    date: 'Kaggle Competition | January 2025',
    description:
      'A customer churn prediction model to help banks retain customers.',
    bullets: [
      'Designed to help banks proactively identify customers at risk of leaving based on behavioral patterns',
      'Created a random forest model to predict customer churn, boosting recall from 25% to 69%',
      'Focused on customer segmentation and actionable ML-driven targeting',
    ],
    links: [
      {
        label: 'EDA Notebook',
        url: 'https://colab.research.google.com/drive/1vGRKLgprNrLDgItWZEi02fHI8yxmjeR0?authuser=2',
      },
      {
        label: 'Executive Summary',
        url: 'https://docs.google.com/document/d/1K-vS6WxaM71PvqHor9gToSGyCmwnkVj4/edit?usp=drive_link&ouid=114318646123261337707&rtpof=true&sd=true',
      },
    ],
    technologies: ['Python', 'Random Forest', 'Kaggle'],
  },
];

export const fullStackProjects: Project[] = [
  {
    title: 'CodeChart',
    description:
      'An educational platform that simplifies complex code concepts through visualization.',
    bullets: [
      'Reverse engineers code into charts and vice versa',
      'Gamified learning experience with personalized features',
      '85% positive feedback rate from users',
      'Makes programming concepts more accessible and understandable',
    ],
    links: [{ label: 'Website', url: 'https://codech.art' }],
    technologies: ['React', 'Web Development'],
  },
  {
    title: 'FinBuddy',
    description:
      'A comprehensive financial education-focused application featuring:',
    bullets: [
      '70+ REST APIs built with Java Spring Boot',
      'Ollama integration for AI-powered features',
      'JWT Authentication for secure user management',
      'CI/CD Pipeline with GitHub Actions',
      'Deployment: Frontend on Netlify, Backend on Heroku, Database on Aiven',
    ],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/jarom-bradshaw/FunBankApp',
      },
    ],
    technologies: ['Java', 'Spring Boot', 'React', 'Ollama', 'JWT'],
  },
  {
    title: 'Personal Notes Manager (Cloud Notes Manager)',
    description:
      'A personal file management system designed to save on hosting costs by self-hosting files.',
    bullets: [
      'Java + AWS architecture',
      'User authentication and authorization',
      'File tracking and management',
      'S3 integration for secure cloud storage',
    ],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/jarom-bradshaw/CloudNotesManager',
      },
    ],
    technologies: ['Java', 'AWS', 'S3'],
  },
  {
    title: 'Apply First - Chrome Extension',
    description:
      'A Chrome extension that helps job seekers find the newest LinkedIn job postings.',
    bullets: [
      'Solves the problem of navigating an overcrowded and slow-to-navigate UI',
      'Enables users to be among the first 5 applicants to new job postings',
      '80% user satisfaction rate with excellent reviews',
      'Available on Chrome Web Store',
    ],
    links: [
      {
        label: 'Chrome Web Store',
        url: 'https://chromewebstore.google.com/detail/apply-first-linkedin-jobs/peonjhgigocioaokchebkomnjjdhnffe',
      },
    ],
    technologies: ['Chrome Extension', 'JavaScript'],
  },
  {
    title: 'Flora-ID',
    date: 'Plant Enthusiast Content App | Freelance Project',
    description:
      'A content application for plant enthusiasts built as a private group.',
    bullets: [
      'Built with React',
      'Focused on community engagement and content sharing',
      'Iterated based on user testing and feedback loops',
    ],
    links: [{ label: 'Website', url: 'https://flora-id.com' }],
    technologies: ['React'],
  },
];

export const mobileProjects: Project[] = [
  {
    title: 'JustPass',
    date: '24-Hour Hackathon Project',
    description:
      'A Bluetooth mobile application built during a 24-hour MLH hackathon.',
    bullets: [
      'Built with .NET Maui for cross-platform mobile development',
      'MongoDB database integration',
      'Focused on improving positive connections through technology',
    ],
    links: [{ label: 'MLH Hackathon', url: 'https://mlh.io' }],
    technologies: ['.NET Maui', 'MongoDB'],
  },
];

export const gameProjects: Project[] = [
  {
    title: '3D Minesweeper',
    date: 'May 2025',
    description:
      'A modern take on the classic Minesweeper game with 3D gameplay.',
    bullets: [
      'Created as a modern take on the classic game to explore 3D game logic and cross-platform deployment',
      'Designed a fully functional 3D version of Minesweeper, deployable on Android and iOS',
      'Used Godot engine with C# to implement gameplay logic and platform support',
    ],
    technologies: ['Godot', 'C#', '3D Game Development'],
  },
  {
    title: 'Side-Scrolling Obstacle Course Game (Office Rush)',
    date: 'Unity | April 2025',
    description: 'A side-scrolling obstacle course game built with Unity.',
    bullets: [
      'Created as a modern take on classic side-scrolling gameplay',
      'Designed an obstacle course game with engaging mechanics and challenges',
      'Built with Unity for cross-platform deployment',
      'Features time tracking and leaderboard functionality',
    ],
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com/jarom-bradshaw/unity-game',
      },
    ],
    technologies: ['Unity', 'C#', 'Game Development'],
  },
];

