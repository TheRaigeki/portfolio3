const cn = (base, small) => (small ? `${base} ${base}--sm` : base);

const ProjectCard = ({ project, small = false }) => (
  <a
    href={project.href}
    target="_blank"
    rel="noreferrer"
    className={cn("card", small)}
  >
    <div className={cn("card-media", small)}>
      <img src={project.image} alt={project.name} className="card-img" />
    </div>
    <div className={cn("card-body", small)}>
      <div className={cn("card-head", small)}>
        <h3 className={cn("card-title", small)}>{project.name}</h3>
        <span className="card-kind" style={{ color: project.kindColor }}>
          {project.kind}
        </span>
      </div>
      <p className={cn("card-desc", small)}>{project.description}</p>
      <div className={cn("card-tags", small)}>{project.tagline}</div>
    </div>
  </a>
);

export default ProjectCard;
