"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2,
    CalendarDays,
    CalendarRange,
    TrendingUp,
    TrendingDown,
    ChevronLeft,
    ChevronRight,
    Inbox,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type SummaryMode = "monthly" | "daily";

interface MonthlySummary {
    month: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    count: number;
}

interface DailySummary {
    date: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    count: number;
}

const THAI_MONTHS = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

function formatMonth(monthStr: string): string {
    const [y, m] = monthStr.split("-");
    const thaiYear = Number(y) + 543;
    return `${THAI_MONTHS[Number(m) - 1]} ${thaiYear}`;
}

function formatDay(dateStr: string): string {
    const [y, m, d] = dateStr.split("-");
    const thaiYear = Number(y) + 543;
    return `${Number(d)} ${THAI_MONTHS[Number(m) - 1]} ${thaiYear}`;
}

export function TransactionSummary() {
    const [mode, setMode] = useState<SummaryMode>("monthly");
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState<MonthlySummary[]>([]);
    const [dailyData, setDailyData] = useState<DailySummary[]>([]);

    const fetchMonthly = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/transactions/summary/monthly?year=${year}`);
            const json = await res.json();
            if (res.ok) setMonthlyData(json.data);
        } catch (err) {
            console.error("Fetch monthly summary error:", err);
        } finally {
            setLoading(false);
        }
    }, [year]);

    const fetchDaily = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/transactions/summary/daily?year=${year}&month=${month}`
            );
            const json = await res.json();
            if (res.ok) setDailyData(json.data);
        } catch (err) {
            console.error("Fetch daily summary error:", err);
        } finally {
            setLoading(false);
        }
    }, [year, month]);

    useEffect(() => {
        if (mode === "monthly") fetchMonthly();
        else fetchDaily();
    }, [mode, fetchMonthly, fetchDaily]);

    // Total for the current view
    const currentData = mode === "monthly" ? monthlyData : dailyData;
    const grandIncome = currentData.reduce((s, r) => s + r.totalIncome, 0);
    const grandExpense = currentData.reduce((s, r) => s + r.totalExpense, 0);
    const grandBalance = grandIncome - grandExpense;

    return (
        <div className="space-y-4">
            {/* Controls Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Mode Toggle */}
                <div className="flex items-center gap-0.5 rounded-xl border border-border bg-card p-0.5">
                    <button
                        onClick={() => setMode("monthly")}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${mode === "monthly"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <CalendarRange className="h-3 w-3" />
                        รายเดือน
                    </button>
                    <button
                        onClick={() => setMode("daily")}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${mode === "daily"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <CalendarDays className="h-3 w-3" />
                        รายวัน
                    </button>
                </div>

                {/* Year / Month Picker */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (mode === "daily" && month === 1) {
                                setYear((y) => y - 1);
                                setMonth(12);
                            } else if (mode === "daily") {
                                setMonth((m) => m - 1);
                            } else {
                                setYear((y) => y - 1);
                            }
                        }}
                        className="rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-foreground min-w-[100px] text-center">
                        {mode === "monthly"
                            ? `ปี ${year + 543}`
                            : `${THAI_MONTHS[month - 1]} ${year + 543}`}
                    </span>
                    <button
                        onClick={() => {
                            if (mode === "daily" && month === 12) {
                                setYear((y) => y + 1);
                                setMonth(1);
                            } else if (mode === "daily") {
                                setMonth((m) => m + 1);
                            } else {
                                setYear((y) => y + 1);
                            }
                        }}
                        className="rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Grand Total Cards */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
                <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-0.5">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-medium">รวมรายรับ</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(grandIncome)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 mb-0.5">
                        <TrendingDown className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-medium">รวมรายจ่าย</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(grandExpense)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-1.5 text-primary mb-0.5">
                        <span className="text-[11px] font-medium">คงเหลือ</span>
                    </div>
                    <p
                        className={`text-lg font-bold ${grandBalance >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                            }`}
                    >
                        {formatCurrency(grandBalance)}
                    </p>
                </div>
            </motion.div>

            {/* Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">กำลังโหลดข้อมูล...</p>
                </div>
            ) : currentData.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Inbox className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-foreground">
                        ยังไม่มีข้อมูลในช่วงนี้
                    </h3>
                </motion.div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    {mode === "monthly" ? "เดือน" : "วัน"}
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                    รายรับ
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-red-600 dark:text-red-400">
                                    รายจ่าย
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                    คงเหลือ
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                    รายการ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {mode === "monthly"
                                    ? (monthlyData as MonthlySummary[]).map((row, i) => (
                                        <motion.tr
                                            key={row.month}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {formatMonth(row.month)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                +{formatCurrency(row.totalIncome)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-red-600 dark:text-red-400 font-semibold">
                                                -{formatCurrency(row.totalExpense)}
                                            </td>
                                            <td
                                                className={`px-4 py-3 text-right font-semibold ${row.balance >= 0
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-red-600 dark:text-red-400"
                                                    }`}
                                            >
                                                {formatCurrency(row.balance)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                {row.count}
                                            </td>
                                        </motion.tr>
                                    ))
                                    : (dailyData as DailySummary[]).map((row, i) => (
                                        <motion.tr
                                            key={row.date}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {formatDay(row.date)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                                                +{formatCurrency(row.totalIncome)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-red-600 dark:text-red-400 font-semibold">
                                                -{formatCurrency(row.totalExpense)}
                                            </td>
                                            <td
                                                className={`px-4 py-3 text-right font-semibold ${row.balance >= 0
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-red-600 dark:text-red-400"
                                                    }`}
                                            >
                                                {formatCurrency(row.balance)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                {row.count}
                                            </td>
                                        </motion.tr>
                                    ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
