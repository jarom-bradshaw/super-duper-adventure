import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import { fullStackProjects } from '../data/projects';

const FullStack = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <Section>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">
              Full Stack Development
            </h1>
            <p className="text-gray-300 text-lg">
              A collection of full-stack web and mobile applications built with modern
              frameworks and technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fullStackProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>

          <Section>
            <div className="glass-card rounded-lg p-8 mt-12">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Technologies & Tools
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'React',
                  'JavaScript',
                  'TypeScript',
                  'Java',
                  'Spring Boot',
                  'Node.js',
                  'Express',
                  'Vue',
                  'Flutter',
                  '.NET Maui',
                  'MongoDB',
                  'MySQL',
                  'AWS',
                  'S3',
                  'JWT',
                  'GitHub Actions',
                ].map((tech) => (
                  <div
                    key={tech}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg text-center"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </Section>
      </div>
    </div>
  );
};

export default FullStack;

