"use client";

// ============================
// Transaction Card Component
// แสดง transaction แต่ละรายการ
// ============================

import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatThaiDateShort } from "@/lib/utils";
import {
    TRANSACTION_CATEGORY_ICONS,
    TRANSACTION_CATEGORY_LABELS,
} from "@/lib/constants";
import type { TransactionCategory } from "@/lib/types";
import type { TransactionRow } from "@/lib/repositories/transaction.repository";

interface TransactionCardProps {
    tx: TransactionRow;
    index: number;
    onEdit: (tx: TransactionRow) => void;
    onDelete: (tx: TransactionRow) => void;
}

export function TransactionCard({
    tx,
    index,
    onEdit,
    onDelete,
}: TransactionCardProps) {
    const icon =
        TRANSACTION_CATEGORY_ICONS[tx.category as TransactionCategory] ?? "📌";
    const label =
        TRANSACTION_CATEGORY_LABELS[tx.category as TransactionCategory] ?? tx.category;
    const isIncome = tx.type === "income";

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:shadow-md hover:border-primary/20"
        >
            {/* Category Icon */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
                {icon}
            </span>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{label}</p>
                {tx.note && (
                    <p className="text-xs text-muted-foreground truncate">{tx.note}</p>
                )}
                <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatThaiDateShort(tx.transaction_date)}
                </p>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
                <p
                    className={`text-sm font-bold ${isIncome
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                        }`}
                >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                </p>
                <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${isIncome
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                >
                    {isIncome ? "รายรับ" : "รายจ่าย"}
                </span>
            </div>

            {/* Actions - Always visible */}
            <div className="flex gap-1 shrink-0">
                <button
                    onClick={() => onEdit(tx)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => onDelete(tx)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </motion.div>
    );
}
