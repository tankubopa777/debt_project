"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { SummaryCards } from "./_components/summary-cards";
import { ProgressSection } from "./_components/progress-section";
import { QuickActions } from "./_components/quick-actions";
import { UpcomingPayments } from "./_components/upcoming-payments";
import { RecentTransactions } from "./_components/recent-transactions";
import { MonthlyChart } from "./_components/monthly-chart";
import { DebtBreakdown } from "./_components/debt-breakdown";
import type { DashboardData } from "@/lib/services/dashboard.service";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDashboard() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/summary");
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || "Failed to fetch dashboard");
      setData(json.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาด"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ============================
  // Loading skeleton
  // ============================
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-48 rounded-xl bg-muted animate-pulse" />
          <div className="mt-2 h-4 w-72 rounded-lg bg-muted animate-pulse" />
        </div>

        {/* Summary skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl border border-border bg-card animate-pulse"
            />
          ))}
        </div>

        {/* Chart skeletons */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-64 rounded-2xl border border-border bg-card animate-pulse" />
          <div className="h-64 rounded-2xl border border-border bg-card animate-pulse" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-80 rounded-2xl border border-border bg-card animate-pulse" />
          <div className="h-80 rounded-2xl border border-border bg-card animate-pulse" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="h-64 rounded-2xl border border-border bg-card animate-pulse" />
          <div className="h-64 rounded-2xl border border-border bg-card animate-pulse" />
        </div>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">
            กำลังโหลดข้อมูล...
          </span>
        </div>
      </div>
    );
  }

  // ============================
  // Error state
  // ============================
  if (error || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-destructive">
            {error || "ไม่สามารถโหลดข้อมูลได้"}
          </p>
          <button
            onClick={fetchDashboard}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // Dashboard content
  // ============================
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            แดชบอร์ด
          </h1>
          <p className="mt-1 text-muted-foreground">
            ภาพรวมหนี้สินและความคืบหน้าของคุณ
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className="inline-flex items-center justify-center rounded-xl border border-border bg-card p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="รีเฟรชข้อมูล"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </motion.div>

      {/* Row 1: Summary Cards */}
      <SummaryCards summary={data.summary} />

      {/* Row 2: Progress + Quick Actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressSection summary={data.summary} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Row 3: Monthly Chart + Debt Breakdown */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlyChart data={data.monthlyChart} />
        </div>
        <div>
          <DebtBreakdown data={data.debtBreakdown} />
        </div>
      </div>

      {/* Row 4: Upcoming Payments + Recent Transactions */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <UpcomingPayments payments={data.upcomingPayments} />
        <RecentTransactions transactions={data.recentTransactions} />
      </div>
    </div>
  );
}
