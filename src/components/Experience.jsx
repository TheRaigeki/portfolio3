import { motion } from "framer-motion";

import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { reveal } from "../utils/motion";

const Experience = () => {
  return (
    <>
      <motion.div variants={reveal()}>
        <div className="secnum">02 / experience</div>
        <h2 className="sectitle">Deployment log.</h2>
      </motion.div>

      <div className="timeline">
        {experiences.map((exp, i) => (
          <motion.div
            key={`${exp.org}-${i}`}
            variants={reveal(i * 0.05)}
            className={`row ${exp.current ? "cur" : ""}`}
          >
            <div className="yr">
              {exp.from}
              <br />→ {exp.to}
            </div>
            <div className="node">
              <div className="role">
                {exp.role}
                {exp.qualifier && <span className="q"> {exp.qualifier}</span>}
                {exp.current && <span className="badge">current</span>}
              </div>
              <div className="org">{exp.org}</div>
              <div className="pts">
                {exp.points.map((point, j) => (
                  <div key={j} className="pt">
                    <span className="arr">→</span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "experience");
