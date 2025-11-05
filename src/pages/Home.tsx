import { useEffect } from 'react';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { Link } from 'react-router-dom';

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
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">
              Professional Overview
            </h2>
            <p className="text-gray-300 mb-6">
              I'm a software developer with experience across full-stack development,
              machine learning, and data engineering. My work spans from designing
              Discrete Event Modeling systems for supply chain optimization at Hill Air
              Force Base to building REST APIs and maintaining Power BI reports at BYU-I
              Support Center. I'm passionate about creating efficient solutions that solve
              real-world problems.
            </p>

            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Current Focus</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
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

            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Explore My Work</h3>
            <p className="text-gray-300 mb-4">
              Navigate through the sections above to see my projects in:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/full-stack"
                className="glass-card glass-card-hover rounded-lg p-6 text-center"
              >
                <h4 className="text-xl font-bold text-cyan-400 mb-2">Full Stack</h4>
                <p className="text-gray-300 text-sm">
                  Web and mobile applications including FinBuddy, Personal Notes Manager,
                  and more
                </p>
              </Link>
              <Link
                to="/ml"
                className="glass-card glass-card-hover rounded-lg p-6 text-center"
              >
                <h4 className="text-xl font-bold text-cyan-400 mb-2">
                  Machine Learning
                </h4>
                <p className="text-gray-300 text-sm">
                  AI chatbots and data analysis projects
                </p>
              </Link>
              <Link
                to="/resume"
                className="glass-card glass-card-hover rounded-lg p-6 text-center"
              >
                <h4 className="text-xl font-bold text-cyan-400 mb-2">My Resume</h4>
                <p className="text-gray-300 text-sm">
                  Complete professional experience and accomplishments
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

