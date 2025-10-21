// ProjectModal.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { LuX } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";
import Typography from "@/foundation/Typography";
import { LuExternalLink, LuChevronRight, LuChevronLeft } from "react-icons/lu";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (page: number) => void;
  title: string;
  year: string;
  href?: string;
  backgroundImage?: string;
  content: ReactNode;
  currentPage?: number;
}

export default function ProjectModal({
  isOpen,
  onClose,
  onChange,
  title,
  year,
  href,
  backgroundImage,
  content,
  currentPage,
}: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bottom-0 z-50 flex items-center justify-center gap-2">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
            onClick={onClose}
          />
          <Button
            onClick={() => onChange((currentPage || 0) - 1)}
            variant="clear"
            shape="circle"
            size="md"
            disabled={currentPage === 0}
            classes="!p-3 !size-[48px] relative z-10 hidden sm:flex"
          >
            <LuChevronLeft className="text-3xl text-white" />
          </Button>
          {/* Modal content */}
          <motion.div className="bg-primary-900 relative z-10 mb-6 h-[calc(100vh-100px)] w-[calc(100%-32px)] max-w-3xl translate-y-[40px] overflow-hidden rounded-2xl shadow-lg">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 text-2xl mix-blend-difference hover:opacity-70"
            >
              <LuX />
            </button>
            {backgroundImage && (
              <div
                className="relative h-[120px] bg-cover bg-top sm:h-[200px]"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              >
                {title === "Kevin Design System" && (
                  <div className="from-primary-900 via-primary-900/60 absolute top-[-2px] h-[80px] w-full bg-gradient-to-b to-transparent" />
                )}
                <div className="from-primary-900 via-primary-900/60 absolute bottom-[-2px] size-full bg-gradient-to-t to-transparent" />

                <div className="absolute bottom-4 left-6">
                  <div className="flex items-center gap-4">
                    <Typography
                      variant="H3"
                      classes="!text-2xl sm:text-3xl !text-primary-100 !font-semibold"
                    >
                      {title}
                    </Typography>
                    {href && (
                      <Button
                        variant="contain"
                        size="sm"
                        classes="!w-[30px]"
                        onClick={() => window.open(href, "_blank")}
                      >
                        <LuExternalLink className="text-lg" />
                      </Button>
                    )}
                  </div>
                  <span className="text-gray-500">{year}</span>
                </div>
              </div>
            )}
            <div className="h-[calc(100dvh-100px-120px)] overflow-y-auto p-6 sm:h-[calc(100dvh-100px-200px)]">
              {content}
            </div>
          </motion.div>
          <Button
            onClick={() => onChange((currentPage || 0) + 1)}
            variant="clear"
            shape="circle"
            disabled={currentPage === 6}
            size="md"
            classes="!p-3 !size-[48px] relative z-10 hidden sm:flex"
          >
            <LuChevronRight className="text-3xl text-white" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
