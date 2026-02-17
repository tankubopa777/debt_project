"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Pencil,
    Trash2,
    Landmark,
    Percent,
    CalendarDays,
    Wallet,
    TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import type { DebtRow } from "@/lib/repositories/debt.repository";

interface DebtDetailModalProps {
    isOpen: boolean;
    debt: DebtRow | null;
    onClose: () => void;
    onEdit: (debt: DebtRow) => void;
    onDelete: (debt: DebtRow) => void;
}

const STATUS_CONFIG: Record<
    string,
    { label: string; className: string }
> = {
    active: {
        label: "กำลังผ่อน",
        className:
            "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    },
    paid_off: {
        label: "ปลดหนี้แล้ว",
        className:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    paused: {
        label: "หยุดชั่วคราว",
        className:
            "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
};

export function DebtDetailModal({
    isOpen,
    debt,
    onClose,
    onEdit,
    onDelete,
}: DebtDetailModalProps) {
    if (!debt) return null;

    const paid = debt.total_amount - debt.remaining_amount;
    const progress = calculateProgress(paid, debt.total_amount);
    const statusConfig = STATUS_CONFIG[debt.status] ?? STATUS_CONFIG.active;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-foreground">
                                    {debt.name}
                                </h2>
                                <span
                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}
                                >
                                    {statusConfig.label}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Progress Section */}
                            <div>
                                <div className="flex items-end justify-between mb-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">ชำระแล้ว</p>
                                        <p className="text-2xl font-bold text-primary">
                                            {formatCurrency(paid)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">คงเหลือ</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {formatCurrency(debt.remaining_amount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                                    <motion.div
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                </div>
                                <p className="mt-1 text-center text-sm font-medium text-muted-foreground">
                                    {progress}% จาก {formatCurrency(debt.total_amount)}
                                </p>
                            </div>

                            {/* Detail Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem
                                    icon={<Landmark className="h-4 w-4" />}
                                    label="เจ้าหนี้"
                                    value={debt.lender || "-"}
                                />
                                <DetailItem
                                    icon={<Percent className="h-4 w-4" />}
                                    label="อัตราดอกเบี้ย"
                                    value={`${debt.interest_rate}%`}
                                />
                                <DetailItem
                                    icon={<Wallet className="h-4 w-4" />}
                                    label="ยอดจ่ายขั้นต่ำ"
                                    value={formatCurrency(debt.minimum_payment)}
                                />
                                <DetailItem
                                    icon={<CalendarDays className="h-4 w-4" />}
                                    label="กำหนดชำระ"
                                    value={
                                        debt.due_date_day
                                            ? `ทุกวันที่ ${debt.due_date_day}`
                                            : "-"
                                    }
                                />
                                <DetailItem
                                    icon={<TrendingDown className="h-4 w-4" />}
                                    label="ยอดรวมทั้งหมด"
                                    value={formatCurrency(debt.total_amount)}
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex gap-3 border-t border-border px-6 py-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => onEdit(debt)}
                            >
                                <Pencil className="h-4 w-4" />
                                แก้ไข
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => onDelete(debt)}
                            >
                                <Trash2 className="h-4 w-4" />
                                ลบ
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DetailItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <p className="font-semibold text-foreground">{value}</p>
        </div>
    );
}
