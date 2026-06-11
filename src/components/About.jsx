import { motion } from "framer-motion";

import { about } from "../constants";
import { SectionWrapper } from "../hoc";
import { reveal } from "../utils/motion";

const About = () => {
  return (
    <>
      <motion.div variants={reveal()}>
        <div className="secnum">01 / about</div>
        <h2 className="sectitle">Overview.</h2>
      </motion.div>

      <motion.p variants={reveal(0.05)} className="secintro">
        {about}
      </motion.p>
    </>
  );
};

export default SectionWrapper(About, "about");
