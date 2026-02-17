"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DebtRow } from "@/lib/repositories/debt.repository";

interface DebtFormModalProps {
    isOpen: boolean;
    editingDebt: DebtRow | null; // null = สร้างใหม่
    onClose: () => void;
    onSubmit: (data: DebtFormData) => Promise<void>;
}

export interface DebtFormData {
    name: string;
    lender: string;
    total_amount: number;
    remaining_amount: number;
    interest_rate: number;
    minimum_payment: number;
    due_date_day: number | null;
    status: "active" | "paid_off" | "paused";
}

const INITIAL_FORM: DebtFormData = {
    name: "",
    lender: "",
    total_amount: 0,
    remaining_amount: 0,
    interest_rate: 0,
    minimum_payment: 0,
    due_date_day: null,
    status: "active",
};

export function DebtFormModal({
    isOpen,
    editingDebt,
    onClose,
    onSubmit,
}: DebtFormModalProps) {
    const [form, setForm] = useState<DebtFormData>(INITIAL_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof DebtFormData, string>>>({});
    const [loading, setLoading] = useState(false);

    const isEditing = !!editingDebt;

    // Populate form when editing
    useEffect(() => {
        if (editingDebt) {
            setForm({
                name: editingDebt.name,
                lender: editingDebt.lender ?? "",
                total_amount: editingDebt.total_amount,
                remaining_amount: editingDebt.remaining_amount,
                interest_rate: editingDebt.interest_rate,
                minimum_payment: editingDebt.minimum_payment,
                due_date_day: editingDebt.due_date_day,
                status: editingDebt.status,
            });
        } else {
            setForm(INITIAL_FORM);
        }
        setErrors({});
    }, [editingDebt, isOpen]);

    function validate(): boolean {
        const newErrors: Partial<Record<keyof DebtFormData, string>> = {};

        if (!form.name.trim()) {
            newErrors.name = "กรุณากรอกชื่อหนี้";
        }
        if (form.total_amount <= 0) {
            newErrors.total_amount = "ยอดหนี้ต้องมากกว่า 0";
        }
        if (form.remaining_amount < 0) {
            newErrors.remaining_amount = "ยอดคงเหลือต้องไม่ติดลบ";
        }
        if (form.remaining_amount > form.total_amount) {
            newErrors.remaining_amount = "ยอดคงเหลือต้องไม่เกินยอดรวม";
        }
        if (form.interest_rate < 0) {
            newErrors.interest_rate = "ดอกเบี้ยต้องไม่ติดลบ";
        }
        if (
            form.due_date_day !== null &&
            (form.due_date_day < 1 || form.due_date_day > 31)
        ) {
            newErrors.due_date_day = "วันที่ต้องอยู่ระหว่าง 1-31";
        }

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

    function updateField<K extends keyof DebtFormData>(
        key: K,
        value: DebtFormData[K]
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
                            <h2 className="text-lg font-semibold text-foreground">
                                {isEditing ? "แก้ไขหนี้" : "เพิ่มหนี้ใหม่"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* ชื่อหนี้ */}
                            <FormField
                                label="ชื่อหนี้ *"
                                error={errors.name}
                            >
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    placeholder="เช่น สินเชื่อบ้าน, บัตรเครดิต"
                                    className="form-input"
                                />
                            </FormField>

                            {/* เจ้าหนี้ */}
                            <FormField label="เจ้าหนี้">
                                <input
                                    type="text"
                                    value={form.lender}
                                    onChange={(e) => updateField("lender", e.target.value)}
                                    placeholder="เช่น ธนาคารกสิกรไทย"
                                    className="form-input"
                                />
                            </FormField>

                            {/* ยอดรวม + ยอดคงเหลือ */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="ยอดหนี้ทั้งหมด (฿) *"
                                    error={errors.total_amount}
                                >
                                    <input
                                        type="number"
                                        value={form.total_amount || ""}
                                        onChange={(e) =>
                                            updateField("total_amount", Number(e.target.value))
                                        }
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="form-input"
                                    />
                                </FormField>
                                <FormField
                                    label="ยอดคงเหลือ (฿)"
                                    error={errors.remaining_amount}
                                >
                                    <input
                                        type="number"
                                        value={form.remaining_amount || ""}
                                        onChange={(e) =>
                                            updateField("remaining_amount", Number(e.target.value))
                                        }
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="form-input"
                                    />
                                </FormField>
                            </div>

                            {/* ดอกเบี้ย + ยอดจ่ายขั้นต่ำ */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="ดอกเบี้ย (%)"
                                    error={errors.interest_rate}
                                >
                                    <input
                                        type="number"
                                        value={form.interest_rate || ""}
                                        onChange={(e) =>
                                            updateField("interest_rate", Number(e.target.value))
                                        }
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="form-input"
                                    />
                                </FormField>
                                <FormField label="ยอดจ่ายขั้นต่ำ (฿)">
                                    <input
                                        type="number"
                                        value={form.minimum_payment || ""}
                                        onChange={(e) =>
                                            updateField("minimum_payment", Number(e.target.value))
                                        }
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="form-input"
                                    />
                                </FormField>
                            </div>

                            {/* วันครบกำหนด + สถานะ */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="วันครบกำหนด (วันที่)"
                                    error={errors.due_date_day}
                                >
                                    <input
                                        type="number"
                                        value={form.due_date_day ?? ""}
                                        onChange={(e) =>
                                            updateField(
                                                "due_date_day",
                                                e.target.value ? Number(e.target.value) : null
                                            )
                                        }
                                        placeholder="1-31"
                                        min="1"
                                        max="31"
                                        className="form-input"
                                    />
                                </FormField>
                                <FormField label="สถานะ">
                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            updateField(
                                                "status",
                                                e.target.value as DebtFormData["status"]
                                            )
                                        }
                                        className="form-input"
                                    >
                                        <option value="active">กำลังผ่อน</option>
                                        <option value="paid_off">ปลดหนี้แล้ว</option>
                                        <option value="paused">หยุดชั่วคราว</option>
                                    </select>
                                </FormField>
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
                                            เพิ่มหนี้
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

function FormField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-xs text-destructive">{error}</p>
            )}
        </div>
    );
}
