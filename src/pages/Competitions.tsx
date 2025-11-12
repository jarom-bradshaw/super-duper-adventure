import Section from '../components/Section';
import ImageCarousel from '../components/ImageCarousel';
import upliftLink from '../assets/uplift_link/Screenshot 2025-11-12 002751.png?url';

const Competitions = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <Section>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">
              Competitions & Hackathons
            </h1>
            <p className="text-[color:var(--muted-foreground)] text-lg">
              A collection of hackathon projects, competitive analyses, and presentations.
            </p>
          </div>

          <Section>
            <div className="glass-card rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-6">
                Hackathons
              </h2>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-2">
                  USU Football Regression Analysis
                </h3>
                <p className="text-gray-400 mb-2">
                  <strong>USU Hackathon - 19 Hours | March 2025</strong>
                </p>
                <p className="text-gray-300 mb-4">
                  A data analysis hackathon project focused on improving college football offensive strategies:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  <li>
                    Tasked with identifying offensive inefficiencies in USU football using custom data provided by university analysts
                  </li>
                  <li>
                    Performed linear regression on proprietary data to analyze and improve USU's offensive strategies
                  </li>
                  <li>
                    Identified key statistical insights to inform coaching decisions
                  </li>
                </ul>
                <p className="text-gray-300 mb-4">
                  This project involved working with real university data to provide actionable insights for football coaching staff.
                </p>
                <a
                  href="https://drive.google.com/drive/folders/1LRIb25dAWptlppXK67AqEbW8SsAmH03i?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--link)] hover:text-[color:var(--accent)] underline"
                >
                  Project Files & Presentation - Includes presentation slides and executive summary (data is private to university team)
                </a>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-2">
                  JustPass (Uplift Link) - Bluetooth Connection App
                </h3>
                <p className="text-gray-400 mb-2">
                  <strong>MLH Hackathon - 24 Hours | October 2024</strong>
                </p>
                <div className="mb-4">
                  <ImageCarousel images={[upliftLink]} alt="Uplift Link screenshot" />
                </div>
                <p className="text-gray-300 mb-4">
                  A Bluetooth-based mobile application developed during a Major League Hacking (MLH) hackathon:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                  <li>
                    Aimed to foster positivity and improve peer-to-peer connection during a fast-paced 24-hour hackathon event
                  </li>
                  <li>
                    Developed a Bluetooth-based app to share motivational content using .NET MAUI
                  </li>
                  <li>
                    Improved team morale and communication, boosting hackathon productivity by 25%
                  </li>
                </ul>
                <p className="text-gray-300 mb-4">
                  Built with .NET Maui and MongoDB, this project focused on improving connections and productivity during competitive coding events.
                </p>
                <a
                  href="https://devpost.com/software/uplift-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--link)] hover:text-[color:var(--accent)] underline"
                >
                  Devpost Project
                </a>
              </div>
            </div>
          </Section>

          <Section>
            <div className="glass-card rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-6">
                Presentations
              </h2>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-2">
                  BYU-I Artificial Intelligence Exposition
                </h3>
                <p className="text-gray-400 mb-2">
                  <strong>Brigham Young University - Idaho | 2024-2025</strong>
                </p>
                <p className="text-gray-300">
                  Presented at the Brigham Young University - Idaho Artificial Intelligence Exposition twice (2024-2025), showcasing AI and machine learning projects and research.
                </p>
              </div>
            </div>
          </Section>

          <Section>
            <div className="glass-card rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-6">
                Leadership & Organization
              </h2>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-2">
                  BYU-I Hackathon Planning Committee Treasurer
                </h3>
                <p className="text-gray-400 mb-2">
                  <strong>Brigham Young University - Idaho</strong>
                </p>
                <p className="text-gray-300">
                  Served as Treasurer on the BYU-I Hackathon Planning Committee, managing finances and budgets for hackathon events while contributing to the planning and execution of competitive programming competitions.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-2">
                  Project Manager - Data Science
                </h3>
                <p className="text-gray-400 mb-2">
                  <strong>Blood Drawing Frontend System</strong>
                </p>
                <p className="text-gray-300 mb-4">
                  Project manager for data science for a blood drawing frontend system that used SQLite, a small database to manage CRUD operations for all necessary blood data and keep the data safe. Taught 6 others how to go through that in a secure way.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-2">
                  President of Corporate and Community Relations
                </h3>
                <p className="text-gray-400 mb-2">
                  <strong>CSE Department - Computing Society</strong>
                </p>
                <p className="text-gray-300">
                  Served as President of Corporate and Community Relations for the CSE Department Computing Society, fostering relationships between the department, industry partners, and the community.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[color:var(--link)] mb-2">
                  Voluntary Full-Time Missionary
                </h3>
                <p className="text-gray-400 mb-2">
                  <strong>The Church of Jesus Christ of Latter-day Saints · Full-time</strong>
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  Aug 2021 - Aug 2023 · 2 yrs 1 mo · Rio de Janeiro, Rio de Janeiro, Brazil · On-site
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>
                    Oversaw IT operations for 120 missionaries, including device repairs, troubleshooting, and upgrades within a tight budget, saving 50% on major tech purchases through vendor negotiations.
                  </li>
                  <li>
                    Produced and presented statistical reports in leadership councils, transforming data into actionable strategies that improved missionary performance and well-being through technology.
                  </li>
                  <li>
                    Trained and mentored a successor, ensuring continuity in social media strategies and IT operations.
                  </li>
                  <li>
                    Managed sensitive conversations on religion daily in Portuguese, demonstrating effective interpersonal communication and cultural adaptability in diverse, high-pressure environments.
                  </li>
                </ul>
              </div>
            </div>
          </Section>
        </Section>
      </div>
    </div>
  );
};

export default Competitions;

