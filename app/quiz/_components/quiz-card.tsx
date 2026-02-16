"use client";

// ============================
// Quiz Question Card
// แสดงคำถามพร้อมตัวเลือกแบบ Interactive
// Theme: Green (#00A651 / #00C9A7 / #34D399)
// ============================

import { useState } from "react";
import { ArrowRight, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { QuizQuestion } from "@/lib/quiz-data";

const cardVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
};

const optionVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

interface QuizCardProps {
  question: QuizQuestion;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  direction: number;
}

export function QuizCard({
  question,
  selectedOptionId,
  onSelect,
  onNext,
  onPrev,
  isFirst,
  isLast,
  direction,
}: QuizCardProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full"
      >
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,166,81,0.5), transparent)",
            }}
          />

          {/* Decorative gradient blob */}
          <div
            className="absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(0,166,81,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative p-6 sm:p-10">
            {/* Question header */}
            <div className="flex items-start gap-4 mb-8">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(0,166,81,0.1)",
                  border: "1px solid rgba(0,166,81,0.15)",
                }}
              >
                <HelpCircle
                  className="h-6 w-6"
                  style={{ color: "#00A651" }}
                />
              </div>
              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold leading-snug"
                  style={{ color: "#FFFFFF" }}
                >
                  {question.question}
                </h2>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  {question.description}
                </p>
              </div>
            </div>

            {/* Options */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {question.options.map((option, i) => {
                const isSelected = selectedOptionId === option.id;
                const isHovered = hoveredId === option.id;

                return (
                  <motion.button
                    key={option.id}
                    custom={i}
                    variants={optionVariants}
                    onClick={() => onSelect(option.id)}
                    onMouseEnter={() => setHoveredId(option.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="group relative w-full text-left rounded-xl p-5 transition-all duration-300 cursor-pointer"
                    style={
                      isSelected
                        ? {
                            background:
                              "linear-gradient(135deg, #00A651, #00874A)",
                            boxShadow: "0 8px 24px rgba(0,166,81,0.25)",
                            transform: "scale(1.01)",
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }
                    }
                  >
                    <div className="flex items-center gap-4">
                      {/* Radio indicator */}
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300"
                        style={{
                          borderColor: isSelected
                            ? "rgba(255,255,255,0.6)"
                            : isHovered
                              ? "rgba(0,166,81,0.5)"
                              : "rgba(255,255,255,0.15)",
                          background: isSelected
                            ? "rgba(255,255,255,0.2)"
                            : "transparent",
                        }}
                      >
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isSelected ? 1 : 0,
                            opacity: isSelected ? 1 : 0,
                          }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="h-2.5 w-2.5 rounded-full bg-white"
                        />
                      </div>

                      {/* Option text */}
                      <span
                        className="text-[15px] font-medium leading-snug transition-colors duration-300"
                        style={{
                          color: isSelected ? "#FFFFFF" : "#CBD5E1",
                        }}
                      >
                        {option.text}
                      </span>
                    </div>

                    {/* Hover shine */}
                    {!isSelected && isHovered && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(0,166,81,0.05), transparent)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                onClick={onPrev}
                variant="ghost"
                disabled={isFirst}
                className="group gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: "rgba(148,163,184,0.7)" }}
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                ย้อนกลับ
              </Button>

              <Button
                onClick={onNext}
                disabled={!selectedOptionId}
                className="group relative overflow-hidden text-sm font-bold rounded-xl px-6 py-2.5 transition-all duration-300"
                style={
                  selectedOptionId
                    ? {
                        background:
                          "linear-gradient(135deg, #00A651, #00874A)",
                        color: "#FFFFFF",
                        boxShadow: "0 4px 16px rgba(0,166,81,0.2)",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(148,163,184,0.4)",
                        cursor: "not-allowed",
                      }
                }
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLast ? "ดูผลลัพธ์" : "ถัดไป"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
                {selectedOptionId && (
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
