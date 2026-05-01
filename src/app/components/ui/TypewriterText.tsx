import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function TypewriterText({ text, delay = 40 }: { text: string, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: delay / 1000,
        delayChildren: 0.1,
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      filter: "blur(4px)",
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ display: "inline-block" }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          className="inline-block mr-[0.25em]"
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

