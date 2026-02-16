"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizHero } from "./_components/quiz-hero";
import { QuizProgress } from "./_components/quiz-progress";
import { QuizCard } from "./_components/quiz-card";
import { QuizResult } from "./_components/quiz-result";
import { QUIZ_QUESTIONS, getQuizResult } from "@/lib/quiz-data";

type QuizPhase = "intro" | "quiz" | "result";

export default function QuizPage() {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [direction, setDirection] = useState(1);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  // ── Handlers ──

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setCurrentIndex(0);
    setAnswers({});
    setDirection(1);
  }, []);

  const handleSelect = useCallback(
    (optionId: string) => {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));
    },
    [currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (!answers[currentQuestion.id]) return;

    if (currentIndex < totalQuestions - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setPhase("result");
    }
  }, [answers, currentQuestion, currentIndex, totalQuestions]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setCurrentIndex(0);
    setAnswers({});
    setDirection(1);
  }, []);

  // ── Calculate Score ──

  const calculateTotalScore = () => {
    let total = 0;
    for (const question of QUIZ_QUESTIONS) {
      const selectedOptionId = answers[question.id];
      if (selectedOptionId) {
        const option = question.options.find((o) => o.id === selectedOptionId);
        if (option) total += option.score;
      }
    }
    return total;
  };

  const maxScore = QUIZ_QUESTIONS.length * 4;

  // ── Render ──

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#0A0F1C", color: "#E2E8F0" }}
    >
      <AnimatePresence mode="wait">
        {/* ── Intro Phase ── */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuizHero onStart={handleStart} />
          </motion.div>
        )}

        {/* ── Quiz Phase ── */}
        {phase === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative flex-1 flex items-center"
          >
            {/* Quiz Background */}
            <QuizBackground />

            <div className="relative z-10 mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
              {/* Progress */}
              <div className="mb-8">
                <QuizProgress
                  current={currentIndex + 1}
                  total={totalQuestions}
                />
              </div>

              {/* Question Card */}
              <QuizCard
                question={currentQuestion}
                selectedOptionId={answers[currentQuestion.id] ?? null}
                onSelect={handleSelect}
                onNext={handleNext}
                onPrev={handlePrev}
                isFirst={currentIndex === 0}
                isLast={currentIndex === totalQuestions - 1}
                direction={direction}
              />
            </div>
          </motion.div>
        )}

        {/* ── Result Phase ── */}
        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuizResult
              result={getQuizResult(calculateTotalScore())}
              totalScore={calculateTotalScore()}
              maxScore={maxScore}
              answers={answers}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Quiz Phase Background ──

function QuizBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0A0F1C 0%, #0D1424 50%, #0A0F1C 100%)",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,166,81,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,166,81,0.03) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />

      {/* Green glow */}
      <motion.div
        className="absolute left-1/2 top-[20%] h-[400px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,166,81,0.06) 0%, transparent 60%)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary glow */}
      <div
        className="absolute -left-32 bottom-[20%] h-[300px] w-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,201,167,0.04) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
