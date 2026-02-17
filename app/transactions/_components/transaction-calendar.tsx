"use client";

// ============================
// Transaction Calendar Component
// ปฏิทินรายรับ-รายจ่าย (Interactive Monthly View)
// ============================

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    TrendingUp,
    TrendingDown,
    Plus,
    X,
} from "lucide-react";
import { formatCurrency, formatThaiDateShort } from "@/lib/utils";
import {
    TRANSACTION_CATEGORY_ICONS,
    TRANSACTION_CATEGORY_LABELS,
} from "@/lib/constants";
import type { TransactionCategory } from "@/lib/types";
import type { TransactionRow } from "@/lib/repositories/transaction.repository";

interface TransactionCalendarProps {
    transactions: TransactionRow[];
    onAddTransaction: (date: string) => void;
    onEditTransaction: (tx: TransactionRow) => void;
}

const THAI_MONTHS = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const THAI_DAYS_SHORT = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function toDateKey(dateStr: string) {
    return dateStr.split("T")[0]; // "2026-02-17"
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

type DayData = {
    day: number;
    dateKey: string;
    income: number;
    expense: number;
    transactions: TransactionRow[];
};

export function TransactionCalendar({
    transactions,
    onAddTransaction,
    onEditTransaction,
}: TransactionCalendarProps) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [slideDir, setSlideDir] = useState<"left" | "right">("right");

    // Build a map: dateKey -> { income, expense, transactions[] }
    const txByDate = useMemo(() => {
        const map: Record<
            string,
            { income: number; expense: number; transactions: TransactionRow[] }
        > = {};

        transactions.forEach((tx) => {
            const key = toDateKey(tx.transaction_date);
            if (!map[key]) {
                map[key] = { income: 0, expense: 0, transactions: [] };
            }
            if (tx.type === "income") {
                map[key].income += tx.amount;
            } else {
                map[key].expense += tx.amount;
            }
            map[key].transactions.push(tx);
        });

        return map;
    }, [transactions]);

    // Calendar grid
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const calendarDays: (DayData | null)[] = useMemo(() => {
        const days: (DayData | null)[] = [];

        // Fill empty slots before 1st day
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Fill days
        for (let d = 1; d <= daysInMonth; d++) {
            const mm = String(currentMonth + 1).padStart(2, "0");
            const dd = String(d).padStart(2, "0");
            const dateKey = `${currentYear}-${mm}-${dd}`;
            const data = txByDate[dateKey];
            days.push({
                day: d,
                dateKey,
                income: data?.income ?? 0,
                expense: data?.expense ?? 0,
                transactions: data?.transactions ?? [],
            });
        }

        return days;
    }, [currentYear, currentMonth, daysInMonth, firstDay, txByDate]);

    // Monthly totals
    const monthlyIncome = calendarDays.reduce(
        (sum, d) => sum + (d?.income ?? 0),
        0
    );
    const monthlyExpense = calendarDays.reduce(
        (sum, d) => sum + (d?.expense ?? 0),
        0
    );

    // Selected day transactions
    const selectedDayData = selectedDate ? txByDate[selectedDate] : null;

    function prevMonth() {
        setSlideDir("left");
        setSelectedDate(null);
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    }

    function nextMonth() {
        setSlideDir("right");
        setSelectedDate(null);
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    }

    function goToday() {
        setSlideDir("right");
        setSelectedDate(null);
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    }

    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const fmt = (n: number) =>
        new Intl.NumberFormat("th-TH", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(n);

    // Intensity for heatmap (0.0-1.0)
    function getExpenseIntensity(expense: number): number {
        if (expense === 0) return 0;
        const maxExpense = Math.max(
            ...calendarDays.filter(Boolean).map((d) => d!.expense),
            1
        );
        return Math.min(expense / maxExpense, 1);
    }

    function getIncomeIntensity(income: number): number {
        if (income === 0) return 0;
        const maxIncome = Math.max(
            ...calendarDays.filter(Boolean).map((d) => d!.income),
            1
        );
        return Math.min(income / maxIncome, 1);
    }

    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-primary/5 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-foreground">
                                ปฏิทินรายรับรายจ่าย
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                คลิกวันที่เพื่อดูรายละเอียด
                            </p>
                        </div>
                    </div>

                    {/* Month Nav */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToday}
                            className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        >
                            วันนี้
                        </button>
                        <button
                            onClick={prevMonth}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="min-w-[140px] text-center text-sm font-semibold text-foreground">
                            {THAI_MONTHS[currentMonth]} {currentYear + 543}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Monthly Summary */}
                <div className="mt-3 flex gap-4">
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground">รายรับ</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ฿{fmt(monthlyIncome)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">รายจ่าย</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                            ฿{fmt(monthlyExpense)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/30">
                {THAI_DAYS_SHORT.map((d, i) => (
                    <div
                        key={d}
                        className={`py-2 text-center text-[11px] font-semibold ${i === 0
                                ? "text-red-500"
                                : i === 6
                                    ? "text-sky-500"
                                    : "text-muted-foreground"
                            }`}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${currentYear}-${currentMonth}`}
                    initial={{ opacity: 0, x: slideDir === "right" ? 30 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slideDir === "right" ? -30 : 30 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-7"
                >
                    {calendarDays.map((dayData, idx) => {
                        if (!dayData) {
                            return (
                                <div
                                    key={`empty-${idx}`}
                                    className="min-h-[72px] border-b border-r border-border/50 bg-muted/10 sm:min-h-[80px]"
                                />
                            );
                        }

                        const { day, dateKey, income, expense, transactions: txs } = dayData;
                        const isToday = dateKey === todayKey;
                        const isSelected = dateKey === selectedDate;
                        const hasTx = txs.length > 0;
                        const colIdx = idx % 7;
                        const isSunday = colIdx === 0;
                        const isSaturday = colIdx === 6;

                        const expIntensity = getExpenseIntensity(expense);
                        const incIntensity = getIncomeIntensity(income);

                        return (
                            <motion.button
                                key={dateKey}
                                onClick={() =>
                                    setSelectedDate(isSelected ? null : dateKey)
                                }
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative min-h-[72px] sm:min-h-[80px] border-b border-r border-border/50 p-1 sm:p-1.5 text-left transition-all cursor-pointer
                  ${isSelected ? "bg-primary/5 ring-2 ring-primary/30 ring-inset z-10" : "hover:bg-muted/40"}
                  ${isToday ? "bg-primary/[0.03]" : ""}
                `}
                            >
                                {/* Day Number */}
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium
                      ${isToday ? "bg-primary text-primary-foreground font-bold" : ""}
                      ${!isToday && isSunday ? "text-red-500" : ""}
                      ${!isToday && isSaturday ? "text-sky-500" : ""}
                      ${!isToday && !isSunday && !isSaturday ? "text-foreground" : ""}
                    `}
                                    >
                                        {day}
                                    </span>
                                    {hasTx && (
                                        <span className="rounded-full bg-muted px-1 text-[9px] font-medium text-muted-foreground">
                                            {txs.length}
                                        </span>
                                    )}
                                </div>

                                {/* Amount Indicators */}
                                {hasTx && (
                                    <div className="mt-0.5 space-y-0.5">
                                        {income > 0 && (
                                            <div
                                                className="flex items-center gap-0.5 rounded px-0.5 py-px"
                                                style={{
                                                    backgroundColor: `rgba(52, 211, 153, ${0.1 + incIntensity * 0.2})`,
                                                }}
                                            >
                                                <span className="text-[8px] text-emerald-600 dark:text-emerald-400">
                                                    +{fmt(income)}
                                                </span>
                                            </div>
                                        )}
                                        {expense > 0 && (
                                            <div
                                                className="flex items-center gap-0.5 rounded px-0.5 py-px"
                                                style={{
                                                    backgroundColor: `rgba(248, 113, 113, ${0.1 + expIntensity * 0.2})`,
                                                }}
                                            >
                                                <span className="text-[8px] text-red-600 dark:text-red-400">
                                                    -{fmt(expense)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Bottom dots */}
                                {hasTx && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                        {income > 0 && (
                                            <span className="h-1 w-1 rounded-full bg-emerald-500" />
                                        )}
                                        {expense > 0 && (
                                            <span className="h-1 w-1 rounded-full bg-red-500" />
                                        )}
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {/* Selected Day Detail Panel */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-border"
                    >
                        <div className="bg-muted/20 p-4 sm:p-5">
                            {/* Panel Header */}
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-foreground">
                                    📅 {formatThaiDateShort(selectedDate)}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onAddTransaction(selectedDate)}
                                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
                                    >
                                        <Plus className="h-3 w-3" />
                                        เพิ่มรายการ
                                    </button>
                                    <button
                                        onClick={() => setSelectedDate(null)}
                                        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Day Summary */}
                            {selectedDayData && (
                                <div className="flex gap-4 mb-3">
                                    <div className="flex items-center gap-1 text-xs">
                                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                                        <span className="text-muted-foreground">รายรับ</span>
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                            {formatCurrency(selectedDayData.income)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <TrendingDown className="h-3 w-3 text-red-500" />
                                        <span className="text-muted-foreground">รายจ่าย</span>
                                        <span className="font-semibold text-red-600 dark:text-red-400">
                                            {formatCurrency(selectedDayData.expense)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Day Transactions */}
                            {selectedDayData && selectedDayData.transactions.length > 0 ? (
                                <div className="space-y-1.5">
                                    {selectedDayData.transactions.map((tx) => {
                                        const icon =
                                            TRANSACTION_CATEGORY_ICONS[
                                            tx.category as TransactionCategory
                                            ] ?? "📌";
                                        const label =
                                            TRANSACTION_CATEGORY_LABELS[
                                            tx.category as TransactionCategory
                                            ] ?? tx.category;
                                        const isIncome = tx.type === "income";

                                        return (
                                            <motion.button
                                                key={tx.id}
                                                onClick={() => onEditTransaction(tx)}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ x: 4 }}
                                                className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 text-left transition-all hover:shadow-sm hover:border-primary/20 cursor-pointer"
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm">
                                                    {icon}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-foreground truncate">
                                                        {label}
                                                    </p>
                                                    {tx.note && (
                                                        <p className="text-[10px] text-muted-foreground truncate">
                                                            {tx.note}
                                                        </p>
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-xs font-bold ${isIncome
                                                            ? "text-emerald-600 dark:text-emerald-400"
                                                            : "text-red-600 dark:text-red-400"
                                                        }`}
                                                >
                                                    {isIncome ? "+" : "-"}
                                                    {formatCurrency(tx.amount)}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-xs text-muted-foreground py-4">
                                    ไม่มีรายการในวันนี้ —{" "}
                                    <button
                                        onClick={() => onAddTransaction(selectedDate)}
                                        className="text-primary hover:underline cursor-pointer"
                                    >
                                        เพิ่มรายการ
                                    </button>
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
