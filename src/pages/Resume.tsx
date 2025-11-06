import Section from '../components/Section';

const Resume = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <Section>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">Jarom Bradshaw</h1>
            <p className="text-[color:var(--gray-300)] mb-2">Rexburg, Idaho, USA</p>
            <p className="text-[color:var(--gray-400)] text-sm mb-4">
              Last Updated: January 27, 2025
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-[color:var(--link)]">
              <a href="mailto:jarombrads@gmail.com" className="hover:text-[color:var(--accent)]">
                Email
              </a>
              <span className="text-[color:var(--gray-500)]">|</span>
              <a
                href="https://www.linkedin.com/in/jarom-bradshaw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[color:var(--accent)]"
              >
                LinkedIn
              </a>
              <span className="text-[color:var(--gray-500)]">|</span>
              <span className="text-[color:var(--gray-300)]">859-420-4178</span>
              <span className="text-[color:var(--gray-500)]">|</span>
              <a
                href="https://github.com/jarom-bradshaw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[color:var(--accent)]"
              >
                GitHub
              </a>
            </div>
          </div>

          <Section>
            <div className="glass-card rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-4">SUMMARY</h2>
              <p className="text-[color:var(--gray-300)]">
                Student at BYU-Idaho who is smart, fun to work with, and gets things done. Has
                saved over 1,000 hours of staffing work through automations developed for BYU-I
                Support Center. 
              </p>
            </div>
          </Section>

          <Section>
            <div className="glass-card rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-6">EDUCATION</h2>
              <div className="mb-4">
                <p className="text-xl font-bold text-[color:var(--link)] mb-1">
                  Bachelors of Science in Computer Science
                </p>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <strong>Brigham Young University - Idaho</strong>
                </p>
                <p className="text-[color:var(--gray-500)] text-sm mb-2">Anticipated: December 2025</p>
                <p className="text-[color:var(--gray-300)] mb-2">
                  <strong>Minor in Statistics</strong>
                </p>
                <p className="text-[color:var(--gray-500)] text-sm mb-4">Major + Minor GPA (3.76)</p>
              </div>
            </div>
          </Section>

          <Section>
            <div className="glass-card rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-6">WORK EXPERIENCE</h2>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">
                  Software Developer
                </h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <strong>Hill Air Force Base (HAFB)</strong>
                </p>
                <p className="text-[color:var(--gray-500)] text-sm mb-3">
                  September 2025 – Present (Remote)
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> HAFB needed to predict supply chain disruptions for
                  critical parts before they impacted operations.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Designed a system for Discrete Event Modeling (DES) for parts in the
                    supply chain at HAFB.
                  </li>
                  <li>
                    Diagnosed probable high-risk supply chain disruptions via simulation
                    with NumPy and pandas.
                  </li>
                  <li>
                    Analyzed and validated system behavior under varied demand and stocking
                    scenarios.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">
                  Software Engineer
                </h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <strong>BYU - I Support Center</strong>
                </p>
                <p className="text-[color:var(--gray-500)] text-sm mb-3">
                  March 2025 – Present (Rexburg ID)
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> BYU-I Support Center provides work for 18+ offices
                  across campus including financial aid, vice presidents, international services,
                  and customer service for multiple departments. They also report on all data phone
                  dispatchers gather from phone calls.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Saved 1,000+ staffing hours with REST APIs in 20+ apps using Spring Boot,
                    Express, and SQLite.
                  </li>
                  <li>
                    Updated and maintained 40+ Power BI reports using DAX/Power/Automate/Scripts.
                  </li>
                  <li>
                    Increased efficiency of 100+ phone dispatchers with POC ML Model built in
                    Python.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">
                  Freelance Software Developer
                </h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <strong>Multiple Clients</strong>
                </p>
                <p className="text-[color:var(--gray-500)] text-sm mb-3">
                  May 2025 – July 2025 (Remote)
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> Various clients needed custom software solutions
                  requiring rapid iteration based on user feedback.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Built a content app for plant enthusiasts as a private group in React.{' '}
                    <a
                      href="https://flora-id.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
                    >
                      flora-id.com
                    </a>
                  </li>
                  <li>
                    Worked on multiple other projects of varying size in JavaScript and
                    Python with Jira.
                  </li>
                  <li>
                    Participated in 2 feedback loops with individuals to iterate based on
                    user testing results.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">
                  Developer Inter
                </h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <strong>Smart ETA Technologies</strong>
                </p>
                <p className="text-[color:var(--gray-500)] text-sm mb-3">
                  December 2024 – May 2025 (Remote)
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> Created a dashboard in open source software with an AI
                  chatbot where phone dispatchers could visually assess if truck drivers should take
                  breaks to improve compliance.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Improved compliance tracking through intelligent automation.
                  </li>
                  <li>
                    Connected with Google Sheets using Python, Pandas, and
                    Seaborn for analysis and visualization.
                  </li>
                  <li>
                    Structured JSON and optimized query logic to enhance
                    AI response accuracy and performance.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">
                  Technology Secretary, LDS Mission Office
                </h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <strong>
                    The Church of Jesus Christ of Latter-day Saints Mission Office
                  </strong>
                </p>
                <p className="text-[color:var(--gray-500)] text-sm mb-3">
                  February 2023 - August 2023, Rio de Janeiro, Brazil
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> Mission office needed to manage IT infrastructure for
                  120+ missionaries across 50+ missionary companionships while controlling costs.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Facilitated communication between mission leadership, 120+ missionaries,
                    and vendors.
                  </li>
                  <li>
                    Negotiated deals with tech vendors, reducing costs by 50% and saving
                    1,000+ Reals on 60+ device repairs.
                  </li>
                  <li>
                    Engineered an IT framework using Microsoft SharePoint, increasing
                    document retrieval speed by 40%.
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          <Section>
            <div className="glass-card rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-6">RELATED EXPERIENCE</h2>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">Project Manager</h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <strong>Data Science Society</strong>
                </p>
                <p className="text-[color:var(--gray-500)] text-sm mb-3">
                  September 2024 - Present, Rexburg, Idaho
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> Needed to teach foundational programming concepts to
                  participants with varying skill levels.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Led a 12-week bootcamp teaching foundational programming to four
                    participants.
                  </li>
                  <li>
                    Provided individual guidance, receiving positive feedback from 75% of
                    participants for improving MySQL and software development understanding.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">CodeChart</h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <a
                    href="https://codech.art"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
                  >
                    codech.art
                  </a>
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> Complex code concepts were difficult for learners to
                  understand visually.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Simplified complex code concepts by reverse engineering code into charts
                    and vice versa.
                  </li>
                  <li>
                    Gamified learning with personalized experience at an 85% positive
                    feedback rate.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">
                  Apply First - Chrome Extension for LinkedIn Job Filtering
                </h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <a
                    href="https://chrome.google.com/webstore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
                  >
                    Chrome Web Store
                  </a>
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> LinkedIn job search UI was slow and overcrowded,
                  making it hard to find new postings quickly.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Helped job seekers find the newest LinkedIn job postings in an
                    overcrowded and slow-to-navigate UI.
                  </li>
                  <li>
                    Noted as excellent by 80% of users for being one of the first 5
                    applicants to new jobs posted on LinkedIn.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">FinBuddy</h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <a
                    href="https://github.com/jarom-bradshaw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
                  >
                    GitHub
                  </a>
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> Lack of accessible financial education tools for
                  individuals wanting to improve their financial literacy.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Created financial education-focused app with 70+ REST APIs, Java Spring
                    Boot, Ollama, and JWT Auth.
                  </li>
                  <li>
                    Utilized CI/CD with GitHub Actions; with the frontend on Netlify,
                    backend on Heroku, and DB on Aiven.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-1">
                  Personal Notes Manager
                </h3>
                <p className="text-[color:var(--gray-400)] mb-2">
                  <a
                    href="https://github.com/jarom-bradshaw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
                  >
                    GitHub
                  </a>
                </p>
                <p className="text-[color:var(--gray-300)] text-sm mb-3 italic border-l-4 border-[color:var(--link)] pl-4">
                  <strong>Situation:</strong> High hosting costs for personal file storage needed
                  a cost-effective alternative.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[color:var(--gray-300)]">
                  <li>
                    Designed to save personal money in hosting my own files.
                  </li>
                  <li>
                    Built a secure Java + AWS file system with user authentication, file
                    tracking, and S3 integration.
                  </li>
                </ul>
              </div>

            </div>
          </Section>

          <Section>
            <div className="glass-card rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-6">SKILLS</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--link)] mb-2">Backend</h3>
                  <p className="text-[color:var(--gray-300)]">
                    Java, Spring Boot, C#, Python, Node.js, Express, REST APIs, Data
                    Structures
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--link)] mb-2">Frontend</h3>
                  <p className="text-[color:var(--gray-300)]">
                    JavaScript, TypeScript, EJS, React, Vue, Flutter, .NET Maui
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--link)] mb-2">
                    Databases & Data Engineering
                  </h3>
                  <p className="text-[color:var(--gray-300)]">
                    SQL, MySQL, SQLite, MongoDB, AWS, Database Design, Query Optimization,
                    Databricks, JSON
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--link)] mb-2">
                    Data Analysis & Visualization
                  </h3>
                  <p className="text-[color:var(--gray-300)]">
                    Python (Pandas, NumPy, PySpark, Polars), Power Tools (Automate, BI,
                    DAX), LetsPlot, Seaborn, Tableau
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--link)] mb-2">Tools & DevOps</h3>
                  <p className="text-[color:var(--gray-300)]">Git, Docker, Jira</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--link)] mb-2">
                    Programming Paradigms
                  </h3>
                  <p className="text-[color:var(--gray-300)]">
                    Object-Oriented Programming (Intermediate), Functional Programming
                    (Beginner)
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--link)] mb-2">Languages</h3>
                  <p className="text-[color:var(--gray-300)]">
                    Fluent in Portuguese; native-level proficiency in English
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section>
            <div className="glass-card rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-6">
                ACCOMPLISHMENTS & CERTIFICATES
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[color:var(--gray-300)]">
                <li>
                  Served as a full-time IT volunteer in Rio De Janeiro, Brazil, for 8
                  months in Portuguese.
                </li>
                <li>
                  President of Corporate and Community Relations; CSE Department - Computing
                  Society.
                </li>
                <li>BYU-I Hackathon Planning Committee Treasurer.</li>
                <li>
                  Presented at the BYU-I Artificial Intelligence Exposition. (2x)
                </li>
                <li>
                  Led several 12-week-long bootcamps in the Data Science Society and the AI
                  Society.
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-[color:var(--link)]/30">
                <h3 className="text-xl font-bold text-[color:var(--link)] mb-4">Certificates</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-[color:var(--link)]">
                      Computer Programming Certificate
                    </p>
                    <p className="text-[color:var(--gray-400)] text-sm">
                      Brigham Young University - Idaho | Completed: March 2025
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[color:var(--link)]">
                      Machine Learning Certificate
                    </p>
                    <p className="text-[color:var(--gray-400)] text-sm">
                      Brigham Young University - Idaho | Completed: December 2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

        </Section>
      </div>
    </div>
  );
};

export default Resume;
