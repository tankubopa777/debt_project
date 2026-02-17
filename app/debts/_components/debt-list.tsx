"use client";

// ============================
// Debt List Component
// Container หลักสำหรับจัดการ state รายการหนี้
// Fetch, Filter, Sort, CRUD operations
// ============================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Filter,
    ArrowUpDown,
    Loader2,
    Inbox,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DebtCard } from "./debt-card";
import { DebtFormModal, type DebtFormData } from "./debt-form-modal";
import { DebtDetailModal } from "./debt-detail-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { QuickPayModal } from "./quick-pay-modal";
import { DebtCalendar } from "./debt-calendar";
import type { DebtRow } from "@/lib/repositories/debt.repository";

type StatusFilter = "all" | "active" | "paid_off" | "paused";
type SortOption = "newest" | "remaining_desc" | "remaining_asc" | "interest_desc" | "due_date";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "ทั้งหมด" },
    { value: "active", label: "กำลังผ่อน" },
    { value: "paid_off", label: "ปลดหนี้แล้ว" },
    { value: "paused", label: "หยุดชั่วคราว" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "newest", label: "ล่าสุด" },
    { value: "remaining_desc", label: "ยอดคงเหลือ (มาก→น้อย)" },
    { value: "remaining_asc", label: "ยอดคงเหลือ (น้อย→มาก)" },
    { value: "interest_desc", label: "ดอกเบี้ย (มาก→น้อย)" },
    { value: "due_date", label: "วันครบกำหนด" },
];

export function DebtList() {
    const [debts, setDebts] = useState<DebtRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters & Sort
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [sortOption, setSortOption] = useState<SortOption>("newest");
    const [showSortMenu, setShowSortMenu] = useState(false);

    // Modals
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingDebt, setEditingDebt] = useState<DebtRow | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<DebtRow | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingDebt, setDeletingDebt] = useState<DebtRow | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Quick Pay Modal
    const [showPayModal, setShowPayModal] = useState(false);
    const [payingDebt, setPayingDebt] = useState<DebtRow | null>(null);

    // ============================
    // Fetch debts
    // ============================
    const fetchDebts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParam =
                statusFilter !== "all" ? `?status=${statusFilter}` : "";
            const res = await fetch(`/api/debts${queryParam}`);
            const json = await res.json();

            if (!res.ok) throw new Error(json.error || "Failed to fetch debts");
            setDebts(json.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchDebts();
    }, [fetchDebts]);

    // ============================
    // Sort
    // ============================
    function sortedDebts(items: DebtRow[]): DebtRow[] {
        const sorted = [...items];
        switch (sortOption) {
            case "newest":
                return sorted.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );
            case "remaining_desc":
                return sorted.sort(
                    (a, b) => b.remaining_amount - a.remaining_amount
                );
            case "remaining_asc":
                return sorted.sort(
                    (a, b) => a.remaining_amount - b.remaining_amount
                );
            case "interest_desc":
                return sorted.sort((a, b) => b.interest_rate - a.interest_rate);
            case "due_date":
                return sorted.sort(
                    (a, b) => (a.due_date_day ?? 32) - (b.due_date_day ?? 32)
                );
            default:
                return sorted;
        }
    }

    // ============================
    // CRUD handlers
    // ============================
    async function handleCreateOrUpdate(data: DebtFormData) {
        if (editingDebt) {
            // Update
            const res = await fetch(`/api/debts/${editingDebt.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            setDebts((prev) =>
                prev.map((d) => (d.id === editingDebt.id ? json.data : d))
            );
        } else {
            // Create
            const res = await fetch("/api/debts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            setDebts((prev) => [json.data, ...prev]);
        }

        setEditingDebt(null);
    }

    async function handleDelete() {
        if (!deletingDebt) return;

        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/debts/${deletingDebt.id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            setDebts((prev) => prev.filter((d) => d.id !== deletingDebt.id));
            setShowDeleteModal(false);
            setDeletingDebt(null);

            // Close detail modal if same debt
            if (selectedDebt?.id === deletingDebt.id) {
                setShowDetailModal(false);
                setSelectedDebt(null);
            }
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setDeleteLoading(false);
        }
    }

    // ============================
    // Quick Pay handler
    // ============================
    async function handleQuickPay(debtId: string, paymentAmount: number) {
        const debt = debts.find((d) => d.id === debtId);
        if (!debt) return;

        const newRemaining = Math.max(debt.remaining_amount - paymentAmount, 0);
        const newStatus = newRemaining === 0 ? "paid_off" : debt.status;

        const res = await fetch(`/api/debts/${debtId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                remaining_amount: newRemaining,
                status: newStatus,
            }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "ไม่สามารถบันทึกการชำระได้");

        setDebts((prev) =>
            prev.map((d) => (d.id === debtId ? json.data : d))
        );
    }

    // ============================
    // Modal helpers
    // ============================
    function openCreateModal() {
        setEditingDebt(null);
        setShowFormModal(true);
    }

    function openEditModal(debt: DebtRow) {
        setEditingDebt(debt);
        setShowFormModal(true);
        setShowDetailModal(false);
    }

    function openDetailModal(debt: DebtRow) {
        setSelectedDebt(debt);
        setShowDetailModal(true);
    }

    function openDeleteModal(debt: DebtRow) {
        setDeletingDebt(debt);
        setShowDeleteModal(true);
        setShowDetailModal(false);
    }

    function openPayModal(debt: DebtRow) {
        setPayingDebt(debt);
        setShowPayModal(true);
    }

    // ============================
    // Summary stats
    // ============================
    const totalRemaining = debts.reduce(
        (sum, d) => sum + d.remaining_amount,
        0
    );
    const totalDebts = debts.reduce((sum, d) => sum + d.total_amount, 0);
    const activeCount = debts.filter((d) => d.status === "active").length;

    const displayedDebts = sortedDebts(debts);

    return (
        <div>
            {/* Summary Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6"
            >
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <p className="text-xs text-muted-foreground">หนี้คงเหลือทั้งหมด</p>
                    <p className="text-xl font-bold text-foreground">
                        {new Intl.NumberFormat("th-TH", {
                            style: "currency",
                            currency: "THB",
                            minimumFractionDigits: 0,
                        }).format(totalRemaining)}
                    </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <p className="text-xs text-muted-foreground">ยอดหนี้รวมทั้งหมด</p>
                    <p className="text-xl font-bold text-foreground">
                        {new Intl.NumberFormat("th-TH", {
                            style: "currency",
                            currency: "THB",
                            minimumFractionDigits: 0,
                        }).format(totalDebts)}
                    </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <p className="text-xs text-muted-foreground">จำนวนหนี้ที่กำลังผ่อน</p>
                    <p className="text-xl font-bold text-primary">
                        {activeCount}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                            รายการ
                        </span>
                    </p>
                </div>
            </motion.div>

            {/* Debt Payment Calendar */}
            {!loading && debts.length > 0 && (
                <DebtCalendar
                    debts={debts}
                    onPayDebt={openPayModal}
                    onViewDebt={openDetailModal}
                />
            )}

            {/* Action Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                {/* Status Filters */}
                <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                    {STATUS_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${statusFilter === f.value
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Filter className="mr-1 inline-block h-3 w-3" />
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {/* Sort */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            จัดเรียง
                        </button>
                        <AnimatePresence>
                            {showSortMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                    className="absolute right-0 top-full z-30 mt-1 w-56 rounded-xl border border-border bg-card py-1 shadow-lg"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                setSortOption(opt.value);
                                                setShowSortMenu(false);
                                            }}
                                            className={`block w-full px-4 py-2 text-left text-xs transition-colors cursor-pointer ${sortOption === opt.value
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-foreground hover:bg-muted"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Refresh */}
                    <button
                        onClick={fetchDebts}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                    </button>

                    {/* Add */}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={openCreateModal}
                    >
                        <Plus className="h-4 w-4" />
                        เพิ่มหนี้
                    </Button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">
                        กำลังโหลดข้อมูล...
                    </p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={fetchDebts}
                    >
                        ลองใหม่
                    </Button>
                </div>
            ) : displayedDebts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Inbox className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-base font-medium text-foreground">
                        ยังไม่มีรายการหนี้
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        เพิ่มหนี้รายการแรกเพื่อเริ่มติดตามการปลดหนี้ของคุณ
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        className="mt-4"
                        onClick={openCreateModal}
                    >
                        <Plus className="h-4 w-4" />
                        เพิ่มหนี้ใหม่
                    </Button>
                </motion.div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {displayedDebts.map((debt, index) => (
                        <DebtCard
                            key={debt.id}
                            debt={debt}
                            index={index}
                            onView={openDetailModal}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                            onPay={openPayModal}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <DebtFormModal
                isOpen={showFormModal}
                editingDebt={editingDebt}
                onClose={() => {
                    setShowFormModal(false);
                    setEditingDebt(null);
                }}
                onSubmit={handleCreateOrUpdate}
            />

            <DebtDetailModal
                isOpen={showDetailModal}
                debt={selectedDebt}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedDebt(null);
                }}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                debtName={deletingDebt?.name ?? ""}
                loading={deleteLoading}
                onConfirm={handleDelete}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeletingDebt(null);
                }}
            />

            <QuickPayModal
                isOpen={showPayModal}
                debt={payingDebt}
                onClose={() => {
                    setShowPayModal(false);
                    setPayingDebt(null);
                }}
                onConfirm={handleQuickPay}
            />
        </div>
    );
}
