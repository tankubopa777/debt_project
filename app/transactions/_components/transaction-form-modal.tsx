"use client";

// ============================
// Transaction Form Modal
// เพิ่ม/แก้ไข รายรับ-รายจ่าย
// ============================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    TRANSACTION_CATEGORY_ICONS,
    TRANSACTION_CATEGORY_LABELS,
} from "@/lib/constants";
import type { TransactionCategory } from "@/lib/types";
import type { TransactionRow } from "@/lib/repositories/transaction.repository";

interface TransactionFormModalProps {
    isOpen: boolean;
    editingTx: TransactionRow | null;
    prefillDate?: string | null;
    onClose: () => void;
    onSubmit: (data: TransactionFormData) => Promise<void>;
}

export interface TransactionFormData {
    type: "income" | "expense";
    category: string;
    amount: number;
    note: string;
    transaction_date: string;
    debt_id: string | null;
}

const INCOME_CATEGORIES: TransactionCategory[] = [
    "salary",
    "freelance",
    "other",
];

const EXPENSE_CATEGORIES: TransactionCategory[] = [
    "food",
    "transport",
    "housing",
    "utilities",
    "entertainment",
    "health",
    "education",
    "shopping",
    "debt_payment",
    "savings",
    "other",
];

function getInitialForm(): TransactionFormData {
    return {
        type: "expense",
        category: "food",
        amount: 0,
        note: "",
        transaction_date: new Date().toISOString().split("T")[0],
        debt_id: null,
    };
}

export function TransactionFormModal({
    isOpen,
    editingTx,
    prefillDate,
    onClose,
    onSubmit,
}: TransactionFormModalProps) {
    const [form, setForm] = useState<TransactionFormData>(getInitialForm());
    const [errors, setErrors] = useState<
        Partial<Record<keyof TransactionFormData, string>>
    >({});
    const [loading, setLoading] = useState(false);

    const isEditing = !!editingTx;

    useEffect(() => {
        if (editingTx) {
            setForm({
                type: editingTx.type,
                category: editingTx.category,
                amount: editingTx.amount,
                note: editingTx.note ?? "",
                transaction_date: editingTx.transaction_date
                    ? editingTx.transaction_date.split("T")[0]
                    : new Date().toISOString().split("T")[0],
                debt_id: editingTx.debt_id,
            });
        } else {
            const initial = getInitialForm();
            if (prefillDate) {
                initial.transaction_date = prefillDate;
            }
            setForm(initial);
        }
        setErrors({});
    }, [editingTx, isOpen, prefillDate]);

    const categories =
        form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    // Reset category when type changes (if current category doesn't match)
    function handleTypeChange(newType: "income" | "expense") {
        const newCategories =
            newType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        setForm((prev) => ({
            ...prev,
            type: newType,
            category: newCategories.includes(prev.category as TransactionCategory)
                ? prev.category
                : newCategories[0],
        }));
    }

    function validate(): boolean {
        const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};
        if (form.amount <= 0) newErrors.amount = "จำนวนเงินต้องมากกว่า 0";
        if (!form.category) newErrors.category = "กรุณาเลือกหมวดหมู่";
        if (!form.transaction_date)
            newErrors.transaction_date = "กรุณาเลือกวันที่";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await onSubmit(form);
            onClose();
        } catch {
            // Error handling in parent
        } finally {
            setLoading(false);
        }
    }

    function updateField<K extends keyof TransactionFormData>(
        key: K,
        value: TransactionFormData[K]
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
                            <h2 className="text-lg font-semibold text-foreground">
                                {isEditing ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Type Toggle */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    ประเภท
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange("income")}
                                        className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all cursor-pointer ${form.type === "income"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 shadow-sm"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                            }`}
                                    >
                                        💰 รายรับ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange("expense")}
                                        className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all cursor-pointer ${form.type === "expense"
                                            ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 shadow-sm"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                            }`}
                                    >
                                        💸 รายจ่าย
                                    </button>
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">
                                    จำนวนเงิน (฿) *
                                </label>
                                <input
                                    type="number"
                                    value={form.amount || ""}
                                    onChange={(e) =>
                                        updateField("amount", Number(e.target.value))
                                    }
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="form-input text-lg font-semibold"
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    หมวดหมู่ *
                                </label>
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => updateField("category", cat)}
                                            className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs transition-all cursor-pointer ${form.category === cat
                                                ? "border-primary bg-primary/10 text-primary font-medium"
                                                : "border-border bg-background text-muted-foreground hover:bg-muted"
                                                }`}
                                        >
                                            <span className="text-base">
                                                {TRANSACTION_CATEGORY_ICONS[cat]}
                                            </span>
                                            <span className="truncate w-full text-center">
                                                {TRANSACTION_CATEGORY_LABELS[cat]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {errors.category && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">
                                    วันที่ *
                                </label>
                                <input
                                    type="date"
                                    value={form.transaction_date}
                                    onChange={(e) =>
                                        updateField("transaction_date", e.target.value)
                                    }
                                    className="form-input"
                                />
                                {errors.transaction_date && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.transaction_date}
                                    </p>
                                )}
                            </div>

                            {/* Note */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">
                                    หมายเหตุ
                                </label>
                                <textarea
                                    value={form.note}
                                    onChange={(e) => updateField("note", e.target.value)}
                                    placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
                                    rows={2}
                                    className="form-input resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        "กำลังบันทึก..."
                                    ) : isEditing ? (
                                        <>
                                            <Save className="h-4 w-4" />
                                            บันทึก
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            เพิ่มรายการ
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
