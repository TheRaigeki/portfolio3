import { GITHUB_URL } from "../constants";

import ProjectCard from "./ProjectCard";

const Work = ({ t, projects, restCols }) => (
  <section id="work" className="section">
    <div className="section-head section-head--work">
      <span className="section-num">01</span>
      <span className="section-label">{t.navWork}</span>
      <span className="section-dot" />
      <p className="section-lead">
        {t.workIntro}{" "}
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        .
      </p>
    </div>

    <div className="grid-featured">
      {projects.slice(0, 2).map((p) => (
        <ProjectCard key={p.name} project={p} />
      ))}
    </div>

    <div className="grid-rest" style={{ gridTemplateColumns: restCols }}>
      {projects.slice(2).map((p) => (
        <ProjectCard key={p.name} project={p} small />
      ))}
    </div>
  </section>
);

export default Work;
