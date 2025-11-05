import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import { mobileProjects } from '../data/projects';

const Mobile = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <Section>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">Mobile Development</h1>
            <p className="text-[color:var(--muted-foreground)] text-lg">
              Cross-platform mobile applications built with modern frameworks and technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mobileProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>

          <Section>
            <div className="glass-card rounded-lg p-8 mt-12">
              <h2 className="text-3xl font-bold text-[color:var(--link)] mb-6">
                Technologies & Tools
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  '.NET Maui',
                  'MongoDB',
                ].map((tech) => (
                  <div
                    key={tech}
                    className="px-4 py-2 bg-[color:var(--link)]/20 text-[color:var(--link)] rounded-lg text-center"
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

export default Mobile;

