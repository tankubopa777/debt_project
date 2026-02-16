"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Target,
  TrendingDown,
  PieChart,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Wallet,
  ChevronDown,
  Banknote,
  LineChart,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Constants ──

const FEATURES = [
  {
    icon: Target,
    title: "ตั้งเป้าหมายปลดหนี้",
    description:
      "กำหนดเป้าหมายและระยะเวลาที่ต้องการปลดหนี้ ระบบจะคำนวณแผนให้คุณอัตโนมัติ",
    gradient: "from-emerald-400 to-green-500",
    lightIcon: "text-emerald-600",
    darkIcon: "dark:text-emerald-400",
  },
  {
    icon: TrendingDown,
    title: "ติดตามยอดหนี้แบบเรียลไทม์",
    description:
      "ดูยอดหนี้คงเหลือ ดอกเบี้ยสะสม และความคืบหน้าในการปลดหนี้ได้ทุกเมื่อ",
    gradient: "from-green-400 to-teal-500",
    lightIcon: "text-teal-600",
    darkIcon: "dark:text-green-400",
  },
  {
    icon: PieChart,
    title: "วิเคราะห์รายรับรายจ่าย",
    description:
      "เข้าใจพฤติกรรมการใช้จ่ายของคุณ พร้อมคำแนะนำในการลดรายจ่ายที่ไม่จำเป็น",
    gradient: "from-teal-400 to-emerald-500",
    lightIcon: "text-green-600",
    darkIcon: "dark:text-teal-400",
  },
  {
    icon: Shield,
    title: "กลยุทธ์ปลดหนี้ที่เหมาะกับคุณ",
    description:
      "เลือกระหว่าง Snowball, Avalanche หรือกลยุทธ์แบบกำหนดเอง ตามสไตล์ของคุณ",
    gradient: "from-green-400 to-emerald-500",
    lightIcon: "text-emerald-600",
    darkIcon: "dark:text-green-400",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "เพิ่มข้อมูลหนี้",
    description: "บันทึกหนี้ทั้งหมดของคุณ พร้อมดอกเบี้ยและยอดผ่อนขั้นต่ำ",
    icon: Banknote,
  },
  {
    step: "02",
    title: "เลือกกลยุทธ์",
    description: "ระบบจะแนะนำกลยุทธ์ที่ดีที่สุด หรือคุณจะเลือกเองก็ได้",
    icon: Calculator,
  },
  {
    step: "03",
    title: "ติดตามความคืบหน้า",
    description: "บันทึกการชำระเงินและดูเส้นทางสู่อิสรภาพทางการเงิน",
    icon: LineChart,
  },
] as const;

// ── Floating particle component (theme-aware, green hue) ──
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 0.8,
        opacity: Math.random() * 0.5 + 0.15,
        hue: Math.random() * 60 + 130,
      });
    }

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (dark) {
          ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        } else {
          ctx.fillStyle = `hsla(${p.hue}, 90%, 45%, ${p.opacity * 1.2})`;
        }
        ctx.fill();
      });

      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / maxDist) * (dark ? 0.06 : 0.12);
            ctx.strokeStyle = dark
              ? `hsla(155, 70%, 70%, ${alpha})`
              : `hsla(155, 80%, 40%, ${alpha})`;
            ctx.lineWidth = dark ? 0.5 : 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70 dark:opacity-60"
    />
  );
}

// ── Main Page Component ──

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }, []);

  return (
    <div className="flex flex-col">
      {/* ============================
          Hero Section
          ============================ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden min-h-screen flex items-center"
      >
        {/* ===== BACKGROUND LAYERS ===== */}

        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-100 via-green-50 to-white dark:from-slate-950 dark:via-[#0a0e1a] dark:to-[#030712]" />

        {/* ── LIGHT MODE Aurora ── */}
        <div className="absolute inset-0 dark:hidden">
          <div
            className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full animate-hero-aurora-1"
            style={{
              background:
                "radial-gradient(circle, rgba(0,166,81,0.25) 0%, rgba(16,185,129,0.12) 35%, transparent 65%)",
              transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
            }}
          />
          <div
            className="absolute top-[5%] right-[-10%] w-[750px] h-[750px] rounded-full animate-hero-aurora-2"
            style={{
              background:
                "radial-gradient(circle, rgba(0,201,167,0.22) 0%, rgba(16,185,129,0.10) 35%, transparent 65%)",
              transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
            }}
          />
          <div
            className="absolute bottom-[-15%] left-[15%] w-[700px] h-[700px] rounded-full animate-hero-aurora-3"
            style={{
              background:
                "radial-gradient(circle, rgba(52,211,153,0.20) 0%, rgba(0,166,81,0.08) 35%, transparent 65%)",
              transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
            }}
          />
          <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-linear-to-r from-emerald-300/15 via-green-300/20 to-teal-300/15 blur-3xl rounded-full animate-hero-breathe" />

          {/* Accent streaks */}
          <div className="absolute top-[8%] left-[25%] w-[300px] h-[2px] bg-linear-to-r from-transparent via-emerald-400/30 to-transparent rotate-15 animate-hero-streak" />
          <div className="absolute top-[15%] right-[20%] w-[250px] h-[2px] bg-linear-to-r from-transparent via-green-400/25 to-transparent rotate-[-10deg] animate-hero-streak-reverse" />
          <div
            className="absolute bottom-[30%] left-[10%] w-[200px] h-[2px] bg-linear-to-r from-transparent via-teal-400/20 to-transparent rotate-[5deg] animate-hero-streak"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* ── DARK MODE Aurora ── */}
        <div className="absolute inset-0 hidden dark:block">
          <div
            className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full animate-hero-aurora-1"
            style={{
              background:
                "radial-gradient(circle, rgba(0,166,81,0.15) 0%, rgba(16,185,129,0.08) 40%, transparent 70%)",
              transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
            }}
          />
          <div
            className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full animate-hero-aurora-2"
            style={{
              background:
                "radial-gradient(circle, rgba(0,201,167,0.12) 0%, rgba(52,211,153,0.06) 40%, transparent 70%)",
              transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
            }}
          />
          <div
            className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] rounded-full animate-hero-aurora-3"
            style={{
              background:
                "radial-gradient(circle, rgba(52,211,153,0.12) 0%, rgba(0,201,167,0.06) 40%, transparent 70%)",
              transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
            }}
          />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-linear-to-r from-emerald-500/5 via-green-500/8 to-teal-500/5 blur-3xl rounded-full animate-hero-breathe" />
        </div>

        {/* Particles */}
        <FloatingParticles />

        {/* Mesh grid overlay */}
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="hero-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-emerald-400 dark:text-emerald-300"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* ── Decorative floating elements ── */}

        {/* Glass orb - top right */}
        <div
          className="absolute top-[12%] right-[12%] w-20 h-20 rounded-full hidden lg:block animate-hero-orbit"
          style={{
            transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`,
          }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-emerald-300/40 dark:border-emerald-400/10" />
          <div className="absolute inset-2 rounded-full bg-linear-to-br from-emerald-400/15 to-green-400/15 dark:from-emerald-400/5 dark:to-green-400/5 backdrop-blur-sm" />
          <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-white/40 dark:bg-white/10 blur-[1px]" />
        </div>

        {/* Rotating square - bottom left */}
        <div
          className="absolute bottom-[22%] left-[6%] w-16 h-16 hidden lg:block animate-hero-float"
          style={{
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
          }}
        >
          <div className="w-full h-full rounded-2xl border-2 border-teal-300/40 dark:border-teal-400/10 rotate-45 bg-linear-to-br from-green-100/50 to-teal-100/50 dark:from-green-400/5 dark:to-teal-400/5 backdrop-blur-sm shadow-lg shadow-green-500/10 dark:shadow-none" />
        </div>

        {/* Small circle - right */}
        <div className="absolute top-[55%] right-[5%] w-12 h-12 rounded-full bg-linear-to-br from-emerald-200/50 to-green-300/50 dark:from-emerald-400/8 dark:to-green-400/8 border border-emerald-300/30 dark:border-emerald-400/10 animate-hero-float-reverse hidden lg:block shadow-lg shadow-emerald-500/10 dark:shadow-none" />

        {/* Wallet glass card */}
        <div
          className="absolute top-[25%] left-[7%] hidden lg:flex items-center justify-center w-14 h-14 rounded-xl bg-white/60 dark:bg-white/5 border border-emerald-200/50 dark:border-white/10 backdrop-blur-md animate-hero-float shadow-xl shadow-emerald-500/10 dark:shadow-emerald-500/5"
          style={{
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          }}
        >
          <Wallet className="w-6 h-6 text-emerald-500 dark:text-emerald-400/40" />
        </div>

        {/* Target glass card */}
        <div
          className="absolute top-[35%] right-[7%] hidden lg:flex items-center justify-center w-12 h-12 rounded-xl bg-white/60 dark:bg-white/5 border border-teal-200/50 dark:border-white/10 backdrop-blur-md animate-hero-float-reverse shadow-xl shadow-teal-500/10 dark:shadow-teal-500/5"
          style={{
            transform: `translate(${mousePos.x * 18}px, ${mousePos.y * 18}px)`,
            animationDelay: "1s",
          }}
        >
          <Target className="w-5 h-5 text-teal-500 dark:text-teal-400/40" />
        </div>

        {/* Shield glass card */}
        <div
          className="absolute bottom-[35%] right-[14%] hidden lg:flex items-center justify-center w-11 h-11 rounded-lg bg-white/60 dark:bg-white/5 border border-emerald-200/50 dark:border-white/10 backdrop-blur-md animate-hero-float shadow-xl shadow-emerald-500/10 dark:shadow-emerald-500/5"
          style={{
            transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px)`,
            animationDelay: "2s",
          }}
        >
          <Shield className="w-5 h-5 text-emerald-500 dark:text-emerald-400/40" />
        </div>

        {/* Decorative rings */}
        <div className="absolute top-[65%] left-[15%] w-24 h-24 rounded-full border border-emerald-200/30 dark:border-transparent hidden lg:block animate-hero-spin-slow" />
        <div
          className="absolute top-[10%] left-[40%] w-16 h-16 rounded-full border border-green-200/25 dark:border-transparent hidden lg:block animate-hero-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "25s" }}
        />

        {/* Glowing accent lines */}
        <div className="absolute top-0 left-[22%] w-px h-[180px] bg-linear-to-b from-transparent via-emerald-400/25 dark:via-emerald-400/15 to-transparent animate-hero-line-down hidden lg:block" />
        <div
          className="absolute top-0 right-[28%] w-px h-[140px] bg-linear-to-b from-transparent via-green-400/20 dark:via-green-400/10 to-transparent animate-hero-line-down hidden lg:block"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-0 left-[55%] w-px h-[100px] bg-linear-to-b from-transparent via-teal-400/15 dark:via-teal-400/8 to-transparent animate-hero-line-down hidden lg:block"
          style={{ animationDelay: "3s" }}
        />

        {/* Radial spotlight */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-linear-to-b from-emerald-200/25 via-green-100/10 to-transparent dark:from-emerald-500/5 dark:via-transparent dark:to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* ===== CONTENT ===== */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 lg:py-20 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Announcement Badge */}
            <div
              className={`transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="mb-8 inline-flex items-center gap-2 bg-white/80 dark:bg-white/7 text-emerald-700 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-400/20 hover:bg-white/95 dark:hover:bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-xl shadow-lg shadow-emerald-500/8 dark:shadow-emerald-500/10 rounded-full cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                วางแผนปลดหนี้อย่างชาญฉลาด
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              </div>
            </div>

            {/* Main Title */}
            <div
              className={`transition-all duration-700 delay-250 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-[1.05] tracking-tight">
                <span className="text-gray-900 dark:text-white">
                  ปลดหนี้ได้จริง
                </span>
                <br />
                <span className="relative inline-block">
                  <span className="bg-linear-to-r from-emerald-600 via-green-500 to-teal-600 dark:from-emerald-300 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                    ด้วยแผนที่ใช่
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8C30 3 60 2 100 5C140 8 170 4 198 6"
                      stroke="url(#underline-grad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="animate-hero-draw"
                    />
                    <defs>
                      <linearGradient
                        id="underline-grad"
                        x1="0"
                        y1="0"
                        x2="200"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#00A651" />
                        <stop offset="0.5" stopColor="#00C9A7" />
                        <stop offset="1" stopColor="#34D399" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div
              className={`transition-all duration-700 delay-350 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                <span className="bg-linear-to-r from-emerald-500 via-green-500 to-teal-500 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                  DebtFree
                </span>
              </p>
            </div>

            {/* Description */}
            <div
              className={`transition-all duration-700 delay-450 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <p className="text-lg lg:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                จัดการหนี้สินทั้งหมดในที่เดียว วิเคราะห์รายรับรายจ่าย
                <br className="hidden sm:block" />
                เลือกกลยุทธ์ปลดหนี้ที่เหมาะกับคุณ
                และติดตามความคืบหน้าแบบเรียลไทม์
              </p>
            </div>

            {/* Social Proof */}
            <div
              className={`transition-all duration-700 delay-550 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-12">
                {[
                  "ใช้งานฟรี ไม่มีค่าใช้จ่าย",
                  "ข้อมูลปลอดภัย 100%",
                  "ไม่ต้องสมัครสมาชิก",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className={`transition-all duration-700 delay-650 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-14">
                <Button
                  href="/quiz"
                  size="lg"
                  className="group relative overflow-hidden bg-linear-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/35 w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    เริ่มต้นใช้งานฟรี
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
                <Button
                  href="#features"
                  variant="outline"
                  size="lg"
                  className="group border-2 border-gray-200 dark:border-white/15 text-gray-700 dark:text-white hover:border-emerald-400 dark:hover:border-emerald-400/40 hover:text-emerald-600 dark:hover:text-emerald-300 bg-white/60 dark:bg-white/5 hover:bg-emerald-50/80 dark:hover:bg-emerald-500/10 px-8 py-6 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/10 w-full sm:w-auto"
                >
                  ดูฟีเจอร์ทั้งหมด
                  <Sparkles className="w-4 h-4 ml-2 text-emerald-400 dark:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </div>

            {/* Scroll indicator */}
            <div
              className={`transition-all duration-700 delay-800 ${mounted ? "opacity-100" : "opacity-0"}`}
            >
              <div className="mt-8 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wider uppercase">
                  เลื่อนลง
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white dark:from-[#030712] to-transparent pointer-events-none" />
      </section>

      {/* ============================
          Features Section
          ============================ */}
      <section
        id="features"
        className="relative py-20 sm:py-28 overflow-hidden"
      >
        {/* Section background */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-green-50/30 to-white dark:from-[#030712] dark:via-[#0a0e1a] dark:to-[#030712]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="features-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="currentColor" className="text-emerald-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#features-grid)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/5 border border-emerald-200/50 dark:border-emerald-400/15 px-4 py-2 rounded-full text-sm font-medium text-emerald-600 dark:text-emerald-300 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              ฟีเจอร์ครบครัน
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
              <span className="text-gray-900 dark:text-white">
                ทุกเครื่องมือที่คุณ
              </span>
              <span className="bg-linear-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                ต้องการ
              </span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              ฟีเจอร์ครบครันเพื่อช่วยให้คุณปลดหนี้ได้เร็วขึ้น
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative bg-white/70 dark:bg-white/4 border border-gray-200/70 dark:border-white/8 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 hover:-translate-y-1.5 hover:border-emerald-300/60 dark:hover:border-emerald-400/20 overflow-hidden backdrop-blur-xl"
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/0 to-white/0 group-hover:from-emerald-50/60 group-hover:via-transparent group-hover:to-green-50/40 dark:group-hover:from-emerald-500/5 dark:group-hover:via-transparent dark:group-hover:to-green-500/5 transition-all duration-500" />
                  {/* Top accent line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r ${feature.gradient} opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
                  />

                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-50 to-green-50 dark:from-white/10 dark:to-white/5 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/10 border border-emerald-100/50 dark:border-transparent">
                      <Icon
                        className={`w-6 h-6 ${feature.lightIcon} ${feature.darkIcon}`}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="leading-7 text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================
          How It Works Section
          ============================ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Section background */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-green-50/20 to-white dark:from-[#030712] dark:via-[#080c18] dark:to-[#030712]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/5 border border-emerald-200/50 dark:border-emerald-400/15 px-4 py-2 rounded-full text-sm font-medium text-emerald-600 dark:text-emerald-300 mb-6 backdrop-blur-sm">
              <ArrowRight className="w-4 h-4" />
              เริ่มต้นง่ายๆ
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
              <span className="text-gray-900 dark:text-white">
                แค่{" "}
              </span>
              <span className="bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                3 ขั้นตอน
              </span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              ไม่ซับซ้อน ไม่ต้องเป็นผู้เชี่ยวชาญด้านการเงิน
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            {STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group relative text-center"
                >
                  {/* Connecting line (between steps) */}
                  {item.step !== "03" && (
                    <div className="hidden sm:block absolute top-10 left-[60%] w-[80%] h-px bg-linear-to-r from-emerald-300/40 via-green-300/30 to-transparent dark:from-emerald-500/20 dark:via-green-500/10 dark:to-transparent" />
                  )}

                  <div className="relative">
                    {/* Step number + icon */}
                    <div className="mx-auto mb-5 relative w-20 h-20">
                      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-50 to-green-50 dark:from-white/6 dark:to-white/3 border border-emerald-100/50 dark:border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-emerald-500/10" />
                      <div className="relative flex flex-col items-center justify-center h-full">
                        <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-0.5" />
                        <span className="text-xs font-bold text-emerald-400 dark:text-emerald-300/60">
                          {item.step}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================
          CTA Section
          ============================ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white to-green-50/30 dark:from-[#030712] dark:to-[#0a0e1a]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            {/* CTA Background */}
            <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-green-600 to-teal-700 dark:from-emerald-700 dark:via-green-800 dark:to-teal-900" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl animate-hero-aurora-1" />
              <div className="absolute bottom-[-50%] right-[-20%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl animate-hero-aurora-2" />
            </div>
            {/* Grid pattern inside CTA */}
            <div className="absolute inset-0 opacity-[0.08]">
              <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="cta-grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-grid)" />
              </svg>
            </div>

            <div className="relative px-6 py-16 sm:px-16 sm:py-20 text-center">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-2 rounded-full text-sm font-medium text-white/90 mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-300" />
                เริ่มต้นวันนี้
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-4">
                พร้อมเริ่มต้นเส้นทางปลดหนี้?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100/80 mb-10">
                เริ่มใช้งาน DebtFree วันนี้ ฟรี ไม่มีค่าใช้จ่าย
                <br />
                แค่เริ่มบันทึก ก็เห็นทางออก
              </p>
              <Button
                href="/dashboard"
                size="lg"
                className="group relative overflow-hidden bg-white text-emerald-700 font-bold px-10 py-6 text-lg rounded-2xl shadow-xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  เริ่มใช้งานเลย
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
