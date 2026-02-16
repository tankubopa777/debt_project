"use client";

// ============================
// Quiz Progress Bar
// แถบแสดงความคืบหน้าในการทำแบบทดสอบ
// Theme: Green (#00A651 / #00C9A7)
// ============================

import { motion } from "framer-motion";

interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold" style={{ color: "rgba(148,163,184,0.8)" }}>
          คำถามที่{" "}
          <span style={{ color: "#00C9A7" }}>{current}</span>
          {" "}จาก{" "}
          <span style={{ color: "#FFFFFF" }}>{total}</span>
        </span>
        <span
          className="text-sm font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #00A651, #00C9A7)" }}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "linear-gradient(90deg, #00A651, #00C9A7)" }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-transparent via-white/30 to-transparent"
          style={{ width: `${percentage}%` }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between mt-3 px-0.5">
        {Array.from({ length: total }, (_, i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
            style={{
              background:
                i < current ? "#00A651" : "rgba(255,255,255,0.1)",
            }}
            initial={false}
            animate={
              i === current - 1
                ? { scale: [1, 1.5, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
