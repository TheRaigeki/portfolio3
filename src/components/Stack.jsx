import { motion } from "framer-motion";

import { stack } from "../constants";
import { SectionWrapper } from "../hoc";
import { reveal } from "../utils/motion";

const StackItem = ({ label }) => {
  const [main, ...rest] = label.split(" · ");
  return (
    <li>
      {main}
      {rest.length > 0 && <span> · {rest.join(" · ")}</span>}
    </li>
  );
};

const Stack = () => {
  return (
    <>
      <motion.div variants={reveal()}>
        <div className="secnum">04 / stack</div>
        <h2 className="sectitle">The stack.</h2>
      </motion.div>

      <motion.p variants={reveal(0.05)} className="secintro">
        The tools I work with day to day.
      </motion.p>

      <div className="stackgrid">
        {stack.map((col, i) => (
          <motion.div
            key={col.group}
            variants={reveal(i * 0.05)}
            className="stackcol"
          >
            <div className="h">{col.group}</div>
            <ul>
              {col.items.map((item) => (
                <StackItem key={item} label={item} />
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Stack, "stack");
