import { motion } from "framer-motion";

import { staggerContainer } from "../utils/motion";

const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="block"
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>
        <div className="container">
          <Component />
        </div>
      </motion.section>
    );
  };

export default SectionWrapper;
