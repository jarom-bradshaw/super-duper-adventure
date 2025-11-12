import { Project } from '../types';

// Import images
import codeChart1 from '../assets/codech-art-images/Screenshot 2025-11-12 000713.png?url';
import codeChart2 from '../assets/codech-art-images/Screenshot 2025-11-12 000723.png?url';
import codeChart3 from '../assets/codech-art-images/Screenshot 2025-11-12 000921.png?url';
import codeChart4 from '../assets/codech-art-images/Screenshot 2025-11-12 000940.png?url';
import codeChart5 from '../assets/codech-art-images/Screenshot 2025-11-12 000956.png?url';

import finbuddy1 from '../assets/finbuddy/Screenshot 2025-07-05 215151.png?url';
import finbuddy2 from '../assets/finbuddy/Screenshot 2025-07-08 183535.png?url';
import finbuddy3 from '../assets/finbuddy/Screenshot 2025-07-08 183630.png?url';
import finbuddy4 from '../assets/finbuddy/Screenshot 2025-07-09 194740.png?url';

import floraId1 from '../assets/flora-id-images/Screenshot 2025-11-12 000513.png?url';
import floraId2 from '../assets/flora-id-images/Screenshot 2025-11-12 000529.png?url';
import floraId3 from '../assets/flora-id-images/Screenshot 2025-11-12 000557.png?url';
import floraId4 from '../assets/flora-id-images/Screenshot 2025-11-12 000614.png?url';
import floraId5 from '../assets/flora-id-images/Screenshot 2025-11-12 000640.png?url';
import floraId6 from '../assets/flora-id-images/Screenshot 2025-11-12 000701.png?url';

import linkedInExt from '../assets/linked-in-ext/Screenshot 2025-05-09 181415.png?url';

import minesweeper1 from '../assets/3d-minesweeper/Screenshot 2025-05-18 201159.png?url';
import minesweeper2 from '../assets/3d-minesweeper/Screenshot 2025-05-18 203136.png?url';
import minesweeper3 from '../assets/3d-minesweeper/Screenshot 2025-05-18 203836.png?url';
import minesweeper4 from '../assets/3d-minesweeper/Screenshot 2025-05-18 205521.png?url';
import minesweeper5 from '../assets/3d-minesweeper/Screenshot 2025-05-18 205948.png?url';
import minesweeper6 from '../assets/3d-minesweeper/Screenshot 2025-05-18 213031.png?url';
import minesweeper7 from '../assets/3d-minesweeper/Screenshot 2025-06-24 091534.png?url';

import upliftLink from '../assets/uplift_link/Screenshot 2025-11-12 002751.png?url';
import starryMeteor1 from '../assets/starry_night_meteor/Screenshot 2025-11-12 005210.png?url';
import starryMeteor2 from '../assets/starry_night_meteor/Screenshot 2025-11-12 005240.png?url';
import starryMeteor3 from '../assets/starry_night_meteor/Screenshot 2025-11-12 005250.png?url';

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
    images: [codeChart1, codeChart2, codeChart3, codeChart4, codeChart5],
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
    images: [finbuddy1, finbuddy2, finbuddy3, finbuddy4],
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
    images: [floraId1, floraId2, floraId3, floraId4, floraId5, floraId6],
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
    images: [upliftLink],
  },
];

export const extensionProjects: Project[] = [
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
    images: [linkedInExt],
  },
];

export const gameProjects: Project[] = [
  {
    title: 'Starry Night & Meteor Mini‑Games (Web)',
    date: 'React | 2025',
    description:
      'A theme‑based web mini‑game suite integrated into my site: a peaceful dark‑mode stargazing world and a light‑mode meteor dodge.',
    bullets: [
      'Theme switching auto‑loads MeteorGame (light) or TelescopeGame (dark)',
      'Interactive objects: telescope overlay, lantern chain/switch, seeds/flowers, pitcher watering, snowglobe',
      'Board Games overlay: Tic‑Tac‑Toe, Connect Four, Checkers, Dots & Boxes, Battleship (simple AIs)',
      'Curved‑hill platforming physics: jump, gravity, friction, drop‑through',
      'Meteor mode: falling meteors, blast scoring, red tree with timed apple heals and visible wind',
    ],
    links: [
      { label: 'Play', url: '/minigame' },
    ],
    technologies: ['React', 'TypeScript', 'SVG', 'Game Development'],
    images: [starryMeteor1, starryMeteor2, starryMeteor3],
  },
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
    images: [minesweeper1, minesweeper2, minesweeper3, minesweeper4, minesweeper5, minesweeper6, minesweeper7],
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

