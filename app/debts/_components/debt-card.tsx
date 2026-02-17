"use client";

// ============================
// Debt Card Component
// แสดงข้อมูลหนี้แต่ละรายการแบบ card
// ============================

import { motion } from "framer-motion";
import {
    Eye,
    Pencil,
    Trash2,
    Percent,
    CalendarDays,
    Wallet,
    Banknote,
    AlertTriangle,
    Clock,
} from "lucide-react";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import type { DebtRow } from "@/lib/repositories/debt.repository";

interface DebtCardProps {
    debt: DebtRow;
    index: number;
    onView: (debt: DebtRow) => void;
    onEdit: (debt: DebtRow) => void;
    onDelete: (debt: DebtRow) => void;
    onPay: (debt: DebtRow) => void;
}

const STATUS_CONFIG: Record<
    string,
    { label: string; className: string; dotColor: string }
> = {
    active: {
        label: "กำลังผ่อน",
        className:
            "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        dotColor: "bg-blue-500",
    },
    paid_off: {
        label: "ปลดหนี้แล้ว",
        className:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        dotColor: "bg-emerald-500",
    },
    paused: {
        label: "หยุดชั่วคราว",
        className:
            "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        dotColor: "bg-amber-500",
    },
};

/**
 * Calculate days until next due date
 */
function getDueDateInfo(dueDateDay: number | null): {
    daysUntil: number | null;
    label: string;
    urgency: "normal" | "warning" | "danger" | "overdue";
} {
    if (dueDateDay === null) return { daysUntil: null, label: "", urgency: "normal" };

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Calculate next due date
    let nextDueDate: Date;
    if (currentDay <= dueDateDay) {
        // Due date is in this month
        const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const clampedDay = Math.min(dueDateDay, daysInCurrentMonth);
        nextDueDate = new Date(currentYear, currentMonth, clampedDay);
    } else {
        // Due date is next month
        const nextMonth = currentMonth + 1;
        const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
        const actualNextMonth = nextMonth > 11 ? 0 : nextMonth;
        const daysInNextMonth = new Date(nextYear, actualNextMonth + 1, 0).getDate();
        const clampedDay = Math.min(dueDateDay, daysInNextMonth);
        nextDueDate = new Date(nextYear, actualNextMonth, clampedDay);
    }

    const diffTime = nextDueDate.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
        return { daysUntil, label: "เลยกำหนดแล้ว!", urgency: "overdue" };
    } else if (daysUntil === 0) {
        return { daysUntil: 0, label: "ครบกำหนดวันนี้!", urgency: "danger" };
    } else if (daysUntil <= 3) {
        return { daysUntil, label: `อีก ${daysUntil} วัน`, urgency: "danger" };
    } else if (daysUntil <= 7) {
        return { daysUntil, label: `อีก ${daysUntil} วัน`, urgency: "warning" };
    } else {
        return { daysUntil, label: `อีก ${daysUntil} วัน`, urgency: "normal" };
    }
}

const URGENCY_STYLES = {
    normal: "bg-muted text-muted-foreground",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 animate-pulse",
    overdue: "bg-red-200 text-red-800 dark:bg-red-500/20 dark:text-red-300 animate-pulse",
};

export function DebtCard({
    debt,
    index,
    onView,
    onEdit,
    onDelete,
    onPay,
}: DebtCardProps) {
    const paid = debt.total_amount - debt.remaining_amount;
    const progress = calculateProgress(paid, debt.total_amount);
    const statusConfig = STATUS_CONFIG[debt.status] ?? STATUS_CONFIG.active;
    const dueDateInfo = getDueDateInfo(debt.due_date_day);
    const isActive = debt.status === "active";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-lg hover:border-primary/30"
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate text-base">
                        {debt.name}
                    </h3>
                    {debt.lender && (
                        <p className="text-sm text-muted-foreground mt-0.5 truncate">
                            {debt.lender}
                        </p>
                    )}
                </div>
                <div className="ml-3 flex items-center gap-2 shrink-0">
                    {/* Due Date Urgency Badge */}
                    {isActive && debt.due_date_day && dueDateInfo.urgency !== "normal" && (
                        <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${URGENCY_STYLES[dueDateInfo.urgency]}`}
                        >
                            {dueDateInfo.urgency === "overdue" ? (
                                <AlertTriangle className="h-3 w-3" />
                            ) : (
                                <Clock className="h-3 w-3" />
                            )}
                            {dueDateInfo.label}
                        </span>
                    )}
                    {/* Status Badge */}
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor}`}
                        />
                        {statusConfig.label}
                    </span>
                </div>
            </div>

            {/* Amount */}
            <div className="mt-4 flex items-end justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">ยอดคงเหลือ</p>
                    <p className="text-xl font-bold text-foreground">
                        {formatCurrency(debt.remaining_amount)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">จากยอดรวม</p>
                    <p className="text-sm font-medium text-muted-foreground">
                        {formatCurrency(debt.total_amount)}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">ชำระแล้ว</span>
                    <span className="text-xs font-medium text-primary">
                        {progress}%
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                    />
                </div>
            </div>

            {/* Quick Info */}
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    {debt.interest_rate}%
                </span>
                <span className="inline-flex items-center gap-1">
                    <Wallet className="h-3 w-3" />
                    {formatCurrency(debt.minimum_payment)}
                </span>
                {debt.due_date_day && (
                    <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        วันที่ {debt.due_date_day}
                        {isActive && dueDateInfo.urgency === "normal" && dueDateInfo.daysUntil !== null && (
                            <span className="text-muted-foreground/70">
                                ({dueDateInfo.label})
                            </span>
                        )}
                    </span>
                )}
            </div>

            {/* Actions - Always visible */}
            <div className="mt-4 flex gap-2">
                {/* Quick Pay Button - prominent green */}
                {isActive && (
                    <button
                        onClick={() => onPay(debt)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
                    >
                        <Banknote className="h-3.5 w-3.5" />
                        จ่ายหนี้
                    </button>
                )}
                <button
                    onClick={() => onView(debt)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                    <Eye className="h-3.5 w-3.5" />
                    ดูรายละเอียด
                </button>
                <button
                    onClick={() => onEdit(debt)}
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => onDelete(debt)}
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </motion.div>
    );
}
