"use client";

import { motion } from "framer-motion";

const BurgerButton = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { isOpen, setIsOpen } = props;

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg focus:outline-none sm:hidden"
      aria-label="Menu"
    >
      {/* Top bar */}
      <motion.span
        className="absolute h-0.5 w-6 bg-primary-900"
        animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
        transition={{ duration: 0.3 }}
      />

      {/* Middle bar */}
      <motion.span
        className="absolute h-0.5 w-6 bg-primary-900"
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Bottom bar */}
      <motion.span
        className="absolute h-0.5 w-6 bg-primary-900"
        animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
};

export default BurgerButton;
