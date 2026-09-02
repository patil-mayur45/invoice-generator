import { useEffect, useRef } from "react";
import { useSpring, useTransform, motion } from "framer-motion";

const AnimatedNumber = ({ value = 0, prefix = "", decimals = 0 }) => {
  const spring = useSpring(0, { stiffness: 90, damping: 20 });
  const display = useTransform(spring, (v) =>
    `${prefix}${v.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`
  );
  const ref = useRef(null);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsub = display.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return unsub;
  }, [display]);

  return <motion.span ref={ref}>{prefix}0</motion.span>;
};

export default AnimatedNumber;
