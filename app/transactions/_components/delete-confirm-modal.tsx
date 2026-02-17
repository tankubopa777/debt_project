"use client";

// ============================
// Transaction Delete Confirm Modal
// ============================

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    description: string;
    loading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export function DeleteConfirmModal({
    isOpen,
    description,
    loading,
    onConfirm,
    onClose,
}: DeleteConfirmModalProps) {
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
                        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-7 w-7 text-destructive" />
                        </div>

                        <h3 className="text-center text-lg font-semibold text-foreground">
                            ยืนยันการลบรายการ
                        </h3>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            คุณต้องการลบรายการ{" "}
                            <span className="font-medium text-foreground">
                                &ldquo;{description}&rdquo;
                            </span>{" "}
                            ใช่หรือไม่?
                        </p>

                        <div className="mt-6 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={onClose}
                                disabled={loading}
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                {loading ? "กำลังลบ..." : "ลบรายการ"}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
