import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

export default function TypewriterText({ text, delay = 40 }: { text: string, delay?: number }) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, isInView]);

  return (
    <span ref={ref} className="inline-block">
      {currentText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle -mt-1"
      />
    </span>
  );
}
