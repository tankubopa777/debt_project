"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Banknote,
    X,
    AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { DebtRow } from "@/lib/repositories/debt.repository";

interface DebtCalendarProps {
    debts: DebtRow[];
    onPayDebt: (debt: DebtRow) => void;
    onViewDebt: (debt: DebtRow) => void;
}

const THAI_MONTHS = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const THAI_DAYS_SHORT = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

type DayData = {
    day: number;
    dateKey: string;
    debts: DebtRow[];
    totalDue: number;
    isPastDue: boolean;
};

export function DebtCalendar({
    debts,
    onPayDebt,
    onViewDebt,
}: DebtCalendarProps) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [slideDir, setSlideDir] = useState<"left" | "right">("right");

    // Only active debts with due dates
    const activeDebts = useMemo(
        () => debts.filter((d) => d.status === "active" && d.due_date_day !== null),
        [debts]
    );

    // Build map: day -> debts due on that day
    const debtsByDay = useMemo(() => {
        const map: Record<number, DebtRow[]> = {};
        activeDebts.forEach((debt) => {
            const day = debt.due_date_day!;
            if (!map[day]) map[day] = [];
            map[day].push(debt);
        });
        return map;
    }, [activeDebts]);

    // Calendar grid
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const calendarDays: (DayData | null)[] = useMemo(() => {
        const days: (DayData | null)[] = [];

        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        const todayDate = new Date();
        const isCurrentMonth =
            currentYear === todayDate.getFullYear() &&
            currentMonth === todayDate.getMonth();

        // Fill days
        for (let d = 1; d <= daysInMonth; d++) {
            const mm = String(currentMonth + 1).padStart(2, "0");
            const dd = String(d).padStart(2, "0");
            const dateKey = `${currentYear}-${mm}-${dd}`;
            const dayDebts = debtsByDay[d] ?? [];
            const totalDue = dayDebts.reduce(
                (sum, debt) => sum + debt.minimum_payment,
                0
            );
            const isPastDue = isCurrentMonth && d < todayDate.getDate() && dayDebts.length > 0;

            days.push({ day: d, dateKey, debts: dayDebts, totalDue, isPastDue });
        }

        return days;
    }, [currentYear, currentMonth, daysInMonth, firstDay, debtsByDay]);

    // Monthly totals
    const monthlyTotalDue = activeDebts.reduce(
        (sum, d) => sum + d.minimum_payment,
        0
    );
    const upcomingCount = activeDebts.length;

    // Selected day debts
    const selectedDayData = useMemo(() => {
        if (!selectedDate) return null;
        return calendarDays.find(
            (d) => d !== null && d.dateKey === selectedDate
        ) as DayData | null;
    }, [selectedDate, calendarDays]);

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

    if (activeDebts.length === 0) return null;

    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-6">
            {/* Calendar Header */}
            <div className="border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-primary/5 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-foreground">
                                ปฏิทินชำระหนี้
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                คลิกวันที่เพื่อดูหนี้ที่ครบกำหนด
                            </p>
                        </div>
                    </div>

                    {/* Month Nav */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToday}
                            className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        >
                            เดือนนี้
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
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">หนี้ที่ต้องจ่าย</span>
                        <span className="font-semibold text-primary">
                            {upcomingCount} รายการ
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                        <span className="text-muted-foreground">ยอดขั้นต่ำรวม</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {formatCurrency(monthlyTotalDue)}
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
                                    className="min-h-[64px] border-b border-r border-border/50 bg-muted/10 sm:min-h-[72px]"
                                />
                            );
                        }

                        const { day, dateKey, debts: dayDebts, totalDue, isPastDue } = dayData;
                        const isToday = dateKey === todayKey;
                        const isSelected = dateKey === selectedDate;
                        const hasDebts = dayDebts.length > 0;
                        const colIdx = idx % 7;
                        const isSunday = colIdx === 0;
                        const isSaturday = colIdx === 6;

                        return (
                            <motion.button
                                key={dateKey}
                                onClick={() =>
                                    setSelectedDate(isSelected ? null : dateKey)
                                }
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative min-h-[64px] sm:min-h-[72px] border-b border-r border-border/50 p-1 sm:p-1.5 text-left transition-all cursor-pointer
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
                                    {hasDebts && (
                                        <span className={`rounded-full px-1 text-[9px] font-medium ${isPastDue
                                            ? "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                                            : "bg-primary/10 text-primary"
                                            }`}>
                                            {dayDebts.length}
                                        </span>
                                    )}
                                </div>

                                {/* Debt Indicators */}
                                {hasDebts && (
                                    <div className="mt-0.5 space-y-0.5">
                                        <div
                                            className={`flex items-center gap-0.5 rounded px-0.5 py-px ${isPastDue
                                                ? "bg-red-500/10"
                                                : "bg-amber-500/10"
                                                }`}
                                        >
                                            <span className={`text-[8px] ${isPastDue
                                                ? "text-red-600 dark:text-red-400"
                                                : "text-amber-600 dark:text-amber-400"
                                                }`}>
                                                {isPastDue ? "⚠️" : "💰"} ฿{new Intl.NumberFormat("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalDue)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Bottom dots */}
                                {hasDebts && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                        {dayDebts.map((debt) => (
                                            <span
                                                key={debt.id}
                                                className={`h-1 w-1 rounded-full ${isPastDue ? "bg-red-500" : "bg-primary"}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {/* Selected Day Detail Panel */}
            <AnimatePresence>
                {selectedDate && selectedDayData && (
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
                                    📅 วันที่ {selectedDayData.day} — หนี้ที่ครบกำหนด
                                </h4>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {selectedDayData.debts.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedDayData.debts.map((debt) => (
                                        <motion.div
                                            key={debt.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {debt.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    คงเหลือ {formatCurrency(debt.remaining_amount)} · ขั้นต่ำ {formatCurrency(debt.minimum_payment)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {selectedDayData.isPastDue && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        เลยกำหนด
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => onPayDebt(debt)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-colors cursor-pointer"
                                                >
                                                    <Banknote className="h-3 w-3" />
                                                    จ่ายหนี้
                                                </button>
                                                <button
                                                    onClick={() => onViewDebt(debt)}
                                                    className="inline-flex items-center rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                                                >
                                                    ดูรายละเอียด
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-xs text-muted-foreground py-4">
                                    ไม่มีหนี้ครบกำหนดในวันนี้
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
