"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Banknote,
    ArrowRight,
    CheckCircle2,
    Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { DebtRow } from "@/lib/repositories/debt.repository";

interface QuickPayModalProps {
    isOpen: boolean;
    debt: DebtRow | null;
    onClose: () => void;
    onConfirm: (debtId: string, paymentAmount: number) => Promise<void>;
}

export function QuickPayModal({
    isOpen,
    debt,
    onClose,
    onConfirm,
}: QuickPayModalProps) {
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && debt) {
            setAmount("");
            setError(null);
        }
    }, [isOpen, debt]);

    if (!debt) return null;

    const paymentAmount = Number(amount) || 0;
    const newRemaining = Math.max(debt.remaining_amount - paymentAmount, 0);
    const willPayOff = newRemaining === 0 && paymentAmount > 0;

    function validate(): boolean {
        if (paymentAmount <= 0) {
            setError("กรุณากรอกจำนวนเงินที่ต้องการจ่าย");
            return false;
        }
        if (paymentAmount > debt!.remaining_amount) {
            setError("จำนวนเงินมากกว่ายอดคงเหลือ");
            return false;
        }
        return true;
    }

    async function handleConfirm() {
        if (!validate() || !debt) return;

        setLoading(true);
        setError(null);
        try {
            await onConfirm(debt.id, paymentAmount);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "เกิดข้อผิดพลาด"
            );
        } finally {
            setLoading(false);
        }
    }

    function setQuickAmount(value: number) {
        setAmount(String(value));
        setError(null);
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
                        className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/5 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                                    <Banknote className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        จ่ายหนี้
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {debt.name}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Current debt info */}
                            <div className="rounded-xl border border-border bg-muted/30 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            ยอดคงเหลือ
                                        </p>
                                        <p className="text-xl font-bold text-foreground">
                                            {formatCurrency(debt.remaining_amount)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">
                                            ยอดขั้นต่ำ
                                        </p>
                                        <p className="text-sm font-semibold text-muted-foreground">
                                            {formatCurrency(debt.minimum_payment)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Amount Input */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    จำนวนเงินที่จ่าย (฿)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        setError(null);
                                    }}
                                    placeholder="0"
                                    min="0"
                                    max={debt.remaining_amount}
                                    step="0.01"
                                    className="form-input text-lg font-semibold"
                                    autoFocus
                                />
                                {error && (
                                    <p className="mt-1 text-xs text-destructive">{error}</p>
                                )}
                            </div>

                            {/* Quick Amount Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {debt.minimum_payment > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setQuickAmount(debt.minimum_payment)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        <Wallet className="h-3 w-3" />
                                        จ่ายขั้นต่ำ ({formatCurrency(debt.minimum_payment)})
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setQuickAmount(debt.remaining_amount)}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors cursor-pointer"
                                >
                                    <CheckCircle2 className="h-3 w-3" />
                                    จ่ายทั้งหมด ({formatCurrency(debt.remaining_amount)})
                                </button>
                            </div>

                            {/* Preview */}
                            {paymentAmount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-xl border border-border bg-muted/20 p-4"
                                >
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                ยอดปัจจุบัน
                                            </p>
                                            <p className="font-semibold text-foreground">
                                                {formatCurrency(debt.remaining_amount)}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                จ่าย
                                            </p>
                                            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                -{formatCurrency(paymentAmount)}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                ยอดใหม่
                                            </p>
                                            <p className={`font-bold ${willPayOff ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                                                {formatCurrency(newRemaining)}
                                            </p>
                                        </div>
                                    </div>
                                    {willPayOff && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-3 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400"
                                        >
                                            🎉 ปลดหนี้สำเร็จ! สถานะจะเปลี่ยนเป็น &quot;ปลดหนี้แล้ว&quot;
                                        </motion.p>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 border-t border-border px-6 py-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={onClose}
                                disabled={loading}
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 !bg-emerald-600 hover:!bg-emerald-700"
                                onClick={handleConfirm}
                                disabled={loading || paymentAmount <= 0}
                            >
                                {loading ? (
                                    "กำลังบันทึก..."
                                ) : (
                                    <>
                                        <Banknote className="h-4 w-4" />
                                        ยืนยันการชำระ
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
