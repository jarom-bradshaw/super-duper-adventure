import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="glass-card glass-card-hover rounded-lg p-6 group">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">{project.title}</h3>
        {project.date && (
          <p className="text-gray-400 text-sm">{project.date}</p>
        )}
      </div>

      <p className="text-gray-300 mb-4">{project.description}</p>

      {project.bullets && project.bullets.length > 0 && (
        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
          {project.bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      )}

      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {project.links && project.links.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {project.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;

