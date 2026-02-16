"use client";

// ============================
// Quiz Result Section — Detailed Assessment
// แสดงผลการประเมินสุขภาพการเงินแบบละเอียด
// อ้างอิง DTI จาก ธปท. และ CFPB
// Theme: Dynamic by risk level
// ============================

import {
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Target,
  Shield,
  TrendingUp,
  BookOpen,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import type { QuizResultLevel, CategoryScore } from "@/lib/quiz-data";
import { getCategoryScores, DTI_CRITERIA } from "@/lib/quiz-data";

// ── Animations ──

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

// ── Risk Level Colors ──

const RISK_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  low: {
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
    text: "#10B981",
  },
  moderate: {
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
    text: "#3B82F6",
  },
  high: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    text: "#F59E0B",
  },
  critical: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    text: "#EF4444",
  },
};

// ── Props ──

interface QuizResultProps {
  result: QuizResultLevel;
  totalScore: number;
  maxScore: number;
  answers: Record<number, string>;
  onRestart: () => void;
}

// ── Main Component ──

export function QuizResult({
  result,
  totalScore,
  maxScore,
  answers,
  onRestart,
}: QuizResultProps) {
  const percentage = Math.round((totalScore / maxScore) * 100);
  const categoryScores = getCategoryScores(answers);
  const riskColor = RISK_COLORS[result.riskLevel];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0A0F1C 0%, #0D1424 50%, #0A0F1C 100%)",
          }}
        />
        <motion.div
          className="absolute left-1/2 top-[10%] h-[500px] w-[800px] -translate-x-1/2 rounded-full"
          style={{
            background: `radial-gradient(ellipse, ${result.ringColors[0]}11 0%, transparent 60%)`,
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${result.ringColors[0]}08 1px, transparent 1px), linear-gradient(90deg, ${result.ringColors[0]}08 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          {/* ═══════════════════════════════════════
              1. Score Circle + Level Title
              ═══════════════════════════════════════ */}
          <div className="text-center">
            {/* Score Circle */}
            <motion.div
              variants={scaleIn}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-full opacity-25 blur-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${result.ringColors[0]}, ${result.ringColors[1]})`,
                  }}
                />
                <div
                  className="relative flex h-36 w-36 items-center justify-center rounded-full backdrop-blur-xl shadow-2xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "2px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 144 144"
                  >
                    <circle
                      cx="72"
                      cy="72"
                      r="65"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="5"
                    />
                    <motion.circle
                      cx="72"
                      cy="72"
                      r="65"
                      fill="none"
                      stroke="url(#score-gradient)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={408}
                      initial={{ strokeDashoffset: 408 }}
                      animate={{
                        strokeDashoffset: 408 - (408 * percentage) / 100,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="score-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={result.ringColors[0]} />
                        <stop offset="50%" stopColor={result.ringColors[1]} />
                        <stop offset="100%" stopColor={result.ringColors[2]} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center">
                    <motion.span
                      className="block text-3xl font-extrabold text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {totalScore}
                    </motion.span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "rgba(148,163,184,0.5)" }}
                    >
                      /{maxScore}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Emoji */}
            <motion.div variants={fadeUp} custom={0}>
              <span className="text-5xl">{result.emoji}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight"
            >
              <span
                className={`bg-linear-to-r ${result.gradient} bg-clip-text text-transparent`}
              >
                {result.title}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-2 text-lg font-semibold"
              style={{ color: "rgba(226,232,240,0.9)" }}
            >
              {result.subtitle}
            </motion.p>

            {/* Risk Level Badge */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-4 flex justify-center"
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
                style={{
                  background: riskColor.bg,
                  border: `1px solid ${riskColor.border}`,
                }}
              >
                <Shield className="h-3.5 w-3.5" style={{ color: riskColor.text }} />
                <span
                  className="text-sm font-bold"
                  style={{ color: riskColor.text }}
                >
                  {result.riskLevelLabel}
                </span>
              </div>
            </motion.div>

            {/* Score stats row */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-5 flex flex-wrap justify-center gap-3"
            >
              {[
                {
                  icon: TrendingUp,
                  label: "คะแนนรวม",
                  value: `${totalScore}/${maxScore} (${percentage}%)`,
                },
                {
                  icon: Target,
                  label: "ระดับ",
                  value: result.title,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <stat.icon
                    className="h-4 w-4"
                    style={{ color: riskColor.text }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: "rgba(148,163,184,0.5)" }}
                  >
                    {stat.label}:
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#E2E8F0" }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════
              2. คำแนะนำเฉพาะคุณ (Personalized Advice)
              ═══════════════════════════════════════ */}
          <motion.div variants={fadeUp} custom={5}>
            <GlassCard accentColor={riskColor.text}>
              <div className="flex items-center gap-3 mb-4">
                <IconBox color={riskColor.text}>
                  <Lightbulb className="h-5 w-5" />
                </IconBox>
                <h3 className="text-lg font-bold text-white">
                  คำแนะนำเฉพาะคุณ
                </h3>
              </div>

              {/* Status highlight */}
              <div
                className="rounded-xl p-4 mb-4"
                style={{
                  background: riskColor.bg,
                  border: `1px solid ${riskColor.border}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <Sparkles
                    className="h-5 w-5 mt-0.5 shrink-0"
                    style={{ color: riskColor.text }}
                  />
                  <div>
                    <span
                      className="text-sm font-bold block mb-1"
                      style={{ color: riskColor.text }}
                    >
                      {result.title}
                    </span>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#CBD5E1" }}
                    >
                      {result.personalizedAdvice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed analysis */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(148,163,184,0.8)" }}
              >
                {result.detailedAnalysis}
              </p>

              {/* Strengths */}
              {result.strengths.length > 0 && (
                <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <h4
                    className="text-sm font-bold mb-3 flex items-center gap-2"
                    style={{ color: "#22C55E" }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    จุดแข็งของคุณ
                  </h4>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 1.4 + i * 0.08,
                          duration: 0.35,
                        }}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2
                          className="h-4 w-4 mt-0.5 shrink-0"
                          style={{ color: "#22C55E" }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "#CBD5E1" }}
                        >
                          {s}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* ═══════════════════════════════════════
              3. ผลการประเมินรายด้าน (Category Breakdown)
              ═══════════════════════════════════════ */}
          <motion.div variants={fadeUp} custom={6}>
            <GlassCard accentColor={riskColor.text}>
              <div className="flex items-center gap-3 mb-6">
                <IconBox color={riskColor.text}>
                  <TrendingUp className="h-5 w-5" />
                </IconBox>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    ผลการประเมินรายด้าน
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(148,163,184,0.5)" }}
                  >
                    วิเคราะห์ตาม 5 มิติสุขภาพทางการเงิน
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {categoryScores.map((cs, i) => (
                  <CategoryBar key={cs.category.id} data={cs} index={i} />
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* ═══════════════════════════════════════
              4. แผนปฏิบัติที่แนะนำ (Action Plan)
              ═══════════════════════════════════════ */}
          <motion.div variants={fadeUp} custom={7}>
            <GlassCard accentColor={riskColor.text}>
              <div className="flex items-center gap-3 mb-5">
                <IconBox color={riskColor.text}>
                  <Target className="h-5 w-5" />
                </IconBox>
                <h3 className="text-lg font-bold text-white">
                  แผนปฏิบัติที่แนะนำ
                </h3>
              </div>

              <ol className="space-y-3">
                {result.actionPlan.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 1.8 + i * 0.08,
                      duration: 0.35,
                    }}
                    className="flex items-start gap-3"
                  >
                    {/* Step number */}
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5"
                      style={{
                        background: riskColor.bg,
                        border: `1px solid ${riskColor.border}`,
                        color: riskColor.text,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: "#CBD5E1" }}
                    >
                      {step}
                    </span>
                  </motion.li>
                ))}
              </ol>
            </GlassCard>
          </motion.div>

          {/* ═══════════════════════════════════════
              5. สัญญาณที่ควรระวัง (Warning Signals)
              ═══════════════════════════════════════ */}
          {result.warningSignals.length > 0 && (
            <motion.div variants={fadeUp} custom={8}>
              <GlassCard accentColor="#F59E0B">
                <div className="flex items-center gap-3 mb-5">
                  <IconBox color="#F59E0B">
                    <AlertTriangle className="h-5 w-5" />
                  </IconBox>
                  <h3 className="text-lg font-bold text-white">
                    สัญญาณที่ควรระวัง
                  </h3>
                </div>

                <ul className="space-y-3">
                  {result.warningSignals.map((w, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 2.0 + i * 0.08,
                        duration: 0.35,
                      }}
                      className="flex items-start gap-3"
                    >
                      <AlertTriangle
                        className="h-4 w-4 mt-0.5 shrink-0"
                        style={{ color: "#F59E0B" }}
                      />
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: "#CBD5E1" }}
                      >
                        {w}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════
              6. เกณฑ์ DTI อ้างอิง ธปท. (DTI Reference)
              ═══════════════════════════════════════ */}
          <motion.div variants={fadeUp} custom={9}>
            <GlassCard accentColor="#3B82F6">
              <div className="flex items-center gap-3 mb-5">
                <IconBox color="#3B82F6">
                  <BookOpen className="h-5 w-5" />
                </IconBox>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    เกณฑ์ DTI ที่ใช้ประเมิน
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(148,163,184,0.5)" }}
                  >
                    Debt-to-Income Ratio — อ้างอิง ธนาคารแห่งประเทศไทย (ธปท.)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {DTI_CRITERIA.map((dti, i) => {
                  const isActive = i === result.dtiIndex;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 2.2 + i * 0.1,
                        duration: 0.35,
                      }}
                      className="relative rounded-xl p-3.5 transition-all duration-300"
                      style={{
                        background: isActive
                          ? `${dti.color}11`
                          : "rgba(255,255,255,0.02)",
                        border: isActive
                          ? `1px solid ${dti.color}40`
                          : "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                          style={{ background: dti.color }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 2.3 + i * 0.1, duration: 0.3 }}
                        />
                      )}

                      <div className="flex items-center gap-3">
                        <span className="text-base">{dti.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-sm font-bold"
                              style={{
                                color: isActive ? dti.color : "#E2E8F0",
                              }}
                            >
                              {dti.range}
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: "rgba(148,163,184,0.5)" }}
                            >
                              —
                            </span>
                            <span
                              className="text-sm font-semibold"
                              style={{
                                color: isActive
                                  ? "#E2E8F0"
                                  : "rgba(148,163,184,0.7)",
                              }}
                            >
                              {dti.label}
                            </span>
                          </div>
                          <p
                            className="text-xs mt-1 leading-relaxed"
                            style={{
                              color: isActive
                                ? "rgba(203,213,225,0.8)"
                                : "rgba(148,163,184,0.4)",
                            }}
                          >
                            {dti.description}
                          </p>
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 2.4, type: "spring" }}
                          >
                            <ChevronRight
                              className="h-5 w-5 shrink-0"
                              style={{ color: dti.color }}
                            />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* ═══════════════════════════════════════
              7. อ้างอิงมาตรฐาน (Reference Standards)
              ═══════════════════════════════════════ */}
          <motion.div variants={fadeUp} custom={10}>
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(148,163,184,0.4)" }}
              >
                เกณฑ์การประเมินอ้างอิงจาก: ธนาคารแห่งประเทศไทย (BOT) — Debt-to-Income
                Ratio Guidelines | Consumer Financial Protection Bureau (CFPB) —
                Financial Well-Being Assessment | International Labour
                Organization (ILO) — Financial Wellness Standards
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: "rgba(148,163,184,0.3)" }}
              >
                ผลการประเมินนี้เป็นการประเมินเบื้องต้นเท่านั้น
                ไม่สามารถใช้แทนคำแนะนำจากที่ปรึกษาทางการเงินมืออาชีพได้
              </p>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════
              8. CTA Buttons
              ═══════════════════════════════════════ */}
          <motion.div
            variants={fadeUp}
            custom={11}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center pt-4"
          >
            <Button
              href="/dashboard"
              size="lg"
              className="group relative overflow-hidden rounded-xl px-8 py-6 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              style={{
                background: `linear-gradient(135deg, ${result.ringColors[0]}, ${result.ringColors[0]}CC)`,
                boxShadow: `0 8px 32px ${result.ringColors[0]}40`,
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                เริ่มใช้งาน DebtFree
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>

            <Button
              onClick={onRestart}
              variant="outline"
              size="lg"
              className="group rounded-xl px-8 py-6 text-base font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm w-full sm:w-auto"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                color: "#94A3B8",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-rotate-180" />
              ทำแบบทดสอบอีกครั้ง
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════
// Sub-components
// ══════════════════════════════════

/** Glass-morphism card wrapper */
function GlassCard({
  children,
  accentColor,
}: {
  children: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)`,
        }}
      />
      {children}
    </div>
  );
}

/** Icon box for section headers */
function IconBox({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-xl"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}25`,
        color,
      }}
    >
      {children}
    </div>
  );
}

/** Category score bar */
function CategoryBar({
  data,
  index,
}: {
  data: CategoryScore;
  index: number;
}) {
  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-base">{data.category.emoji}</span>
          <span className="text-sm font-semibold text-white">
            {data.category.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${data.color}18`,
              color: data.color,
            }}
          >
            {data.label}
          </span>
          <span
            className="text-xs font-mono font-bold"
            style={{ color: data.color }}
          >
            {data.score}/{data.maxScore}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${data.color}, ${data.color}CC)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${data.percentage}%` }}
          transition={{
            duration: 1,
            delay: 1.0 + index * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>

      {/* Description */}
      <p
        className="text-xs mt-1.5"
        style={{ color: "rgba(148,163,184,0.4)" }}
      >
        {data.category.description}
      </p>

      {/* Category-specific advice (for weak areas) */}
      {data.advice && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 1.3 + index * 0.12, duration: 0.3 }}
          className="mt-2 flex items-start gap-2 rounded-lg p-2.5"
          style={{
            background: `${data.color}08`,
            border: `1px solid ${data.color}15`,
          }}
        >
          <Lightbulb
            className="h-3.5 w-3.5 mt-0.5 shrink-0"
            style={{ color: data.color }}
          />
          <span
            className="text-xs leading-relaxed"
            style={{ color: "rgba(203,213,225,0.7)" }}
          >
            {data.advice}
          </span>
        </motion.div>
      )}
    </div>
  );
}
