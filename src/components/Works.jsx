import { motion } from "framer-motion";

import { projects, githubUrl } from "../constants";
import { SectionWrapper } from "../hoc";
import { reveal } from "../utils/motion";

const ProjectCard = ({ project, index }) => {
  const { name, repo, description, tags, image, live, source } = project;

  return (
    <motion.div variants={reveal((index % 3) * 0.05)} className="card">
      <div className="card-bar">
        <span>{repo}</span>
        <span className="ind">
          {live && (
            <a href={live} target="_blank" rel="noreferrer" className="live">
              ● live
            </a>
          )}
          {source && (
            <a href={source} target="_blank" rel="noreferrer">
              ↗ source
            </a>
          )}
        </span>
      </div>

      <div className="card-thumb">
        <img src={image} alt={name} loading="lazy" />
      </div>

      <div className="card-body">
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="tags">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={reveal()}>
        <div className="secnum">03 / selected work</div>
        <h2 className="sectitle">Projects.</h2>
      </motion.div>

      <motion.p variants={reveal(0.05)} className="secintro">
        A few things I built for myself and for clients. More on my{" "}
        <a href={githubUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
        .
      </motion.p>

      <div className="cards">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "work");
