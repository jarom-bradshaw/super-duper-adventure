import { useEffect } from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { Link } from 'react-router-dom';
import resumePdf from '../assets/Jarom Bradshaw Resume.pdf';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Prevent elastic scrolling
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    return () => {
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ overscrollBehavior: 'none' }}>
      <Hero />
      <div className="container mx-auto px-6 py-16">
        <Section>
          <div className="glass-card rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-[color:var(--link)] mb-4">
              Professional Overview
            </h2>
            <p className="text-[color:var(--muted-foreground)] mb-6">
              I'm a software developer with experience across full-stack development,
              machine learning, and data engineering. My work spans from designing
              Discrete Event Modeling systems for supply chain optimization at Hill Air
              Force Base to building REST APIs and maintaining Power BI reports at BYU-I
              Support Center. But enough about that, something I've done is save over a 
              thousand hours of staffing work by developing automations for the Support Center.
              Something unique to me is that I can wiggle my ears. I love playing the piano
              and cooking up food for my wife and friends when they come over.
            </p>

            <h3 className="text-2xl font-bold text-[color:var(--link)] mb-4">Current Focus</h3>
            <ul className="list-disc list-inside space-y-2 text-[color:var(--muted-foreground)] mb-6">
              <li>
                <strong>Full-Stack Development:</strong> Building web and mobile
                applications with modern frameworks
              </li>
              <li>
                <strong>Machine Learning:</strong> Developing AI-powered solutions to
                improve efficiency and user experience
              </li>
              <li>
                <strong>Data Engineering:</strong> Working with large datasets and
                creating data visualization tools
              </li>
              <li>
                <strong>Software Architecture:</strong> Designing scalable systems with
                proper CI/CD practices
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-[color:var(--link)] mb-4">Resume</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card glass-card-hover rounded-lg p-6 text-center"
              >
                <h4 className="text-xl font-bold text-[color:var(--link)] mb-2">PDF Resume</h4>
                <p className="text-[color:var(--muted-foreground)] text-sm">
                  One-page condensed resume for job applications
                </p>
              </a>
              <Link
                to="/resume"
                className="glass-card glass-card-hover rounded-lg p-6 text-center"
              >
                <h4 className="text-xl font-bold text-[color:var(--link)] mb-2">View Full Resume</h4>
                <p className="text-[color:var(--muted-foreground)] text-sm">
                  Extended resume with additional projects and details
                </p>
              </Link>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Home;

