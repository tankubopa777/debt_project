"use client";

// ============================
// Quiz Hero Section
// แสดงข้อมูลเบื้องต้นก่อนเริ่มทำแบบทดสอบ
// Theme: Green (#00A651 / #00C9A7 / #34D399)
// ============================

import {
  ClipboardCheck,
  Sparkles,
  Clock,
  Brain,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const QUIZ_INFO = [
  { icon: Clock, text: "ใช้เวลาเพียง 3 นาที" },
  { icon: Brain, text: "10 คำถามง่ายๆ" },
  { icon: Shield, text: "ไม่ต้องกรอกข้อมูลส่วนตัว" },
] as const;

interface QuizHeroProps {
  onStart: () => void;
}

export function QuizHero({ onStart }: QuizHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Background ── */}
      <QuizHeroBackground />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} custom={0}>
            <span
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium tracking-wide"
              style={{
                background: "rgba(0,166,81,0.08)",
                border: "1px solid rgba(0,166,81,0.2)",
                color: "#00C9A7",
              }}
            >
              <Sparkles className="h-4 w-4" />
              ก่อนเริ่มใช้งาน
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight"
          >
            <span className="text-gray-900 dark:text-white">
              ทดสอบสุขภาพ
            </span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #00A651, #00C9A7, #34D399)",
              }}
            >
              ทางการเงินของคุณ
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
            style={{ color: "rgba(148,163,184,0.9)" }}
          >
            ตอบคำถามง่ายๆ เพียง 10 ข้อ
            เพื่อประเมินสถานะทางการเงินของคุณ
            <br className="hidden sm:block" />
            และรับคำแนะนำที่เหมาะกับคุณโดยเฉพาะ
          </motion.p>

          {/* Info Cards */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            {QUIZ_INFO.map((info) => (
              <div
                key={info.text}
                className="flex items-center gap-2.5 rounded-xl px-5 py-3 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <info.icon className="h-4 w-4" style={{ color: "#00A651" }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "#CBD5E1" }}
                >
                  {info.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Icon Preview */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-12 flex justify-center"
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="flex h-24 w-24 items-center justify-center rounded-3xl shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #00A651, #00874A)",
                  boxShadow: "0 8px 32px rgba(0,166,81,0.3)",
                }}
              >
                <ClipboardCheck className="h-12 w-12 text-white" />
              </div>
              <div
                className="absolute -inset-3 rounded-3xl opacity-25 blur-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #00A651, #00C9A7)",
                }}
              />
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeUp} custom={5} className="mt-10">
            <Button
              onClick={onStart}
              size="lg"
              className="group relative overflow-hidden rounded-xl px-10 py-6 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #00A651, #00874A)",
                boxShadow: "0 8px 32px rgba(0,166,81,0.25)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                เริ่มทำแบบทดสอบ
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={6}
            className="mt-5 text-sm"
            style={{ color: "rgba(148,163,184,0.5)" }}
          >
            ผลลัพธ์จะช่วยให้ระบบแนะนำแผนปลดหนี้ที่เหมาะกับคุณ
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Background ──

function QuizHeroBackground() {
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
          backgroundImage: `linear-gradient(rgba(0,166,81,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,166,81,0.04) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)",
        }}
      />

      {/* Green glow center */}
      <motion.div
        className="absolute left-1/2 top-[10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,166,81,0.08) 0%, transparent 60%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary glow */}
      <motion.div
        className="absolute -right-32 top-[40%] h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 60%)",
        }}
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
