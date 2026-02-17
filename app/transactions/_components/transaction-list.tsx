"use client";

// ============================
// Transaction List Component
// Container: fetch, filter, sort, CRUD
// ============================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Filter,
    Loader2,
    Inbox,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Wallet,
    List,
    CalendarDays,
    BarChart3,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionCard } from "./transaction-card";
import { TransactionCalendar } from "./transaction-calendar";
import { TransactionSummary } from "./transaction-summary";
import {
    TransactionFormModal,
    type TransactionFormData,
} from "./transaction-form-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import {
    TRANSACTION_CATEGORY_LABELS,
    TRANSACTION_CATEGORY_ICONS,
} from "@/lib/constants";
import type { TransactionCategory } from "@/lib/types";
import type { TransactionRow } from "@/lib/repositories/transaction.repository";

type ViewMode = "list" | "calendar" | "summary";

type TypeFilter = "all" | "income" | "expense";

const TYPE_FILTERS: { value: TypeFilter; label: string; icon: string }[] = [
    { value: "all", label: "ทั้งหมด", icon: "" },
    { value: "income", label: "รายรับ", icon: "💰" },
    { value: "expense", label: "รายจ่าย", icon: "💸" },
];

const VIEW_MODES: { value: ViewMode; label: string; Icon: typeof List }[] = [
    { value: "list", label: "รายการ", Icon: List },
    { value: "calendar", label: "ปฏิทิน", Icon: CalendarDays },
    { value: "summary", label: "สรุป", Icon: BarChart3 },
];

export function TransactionList() {
    const [transactions, setTransactions] = useState<TransactionRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [prefillDate, setPrefillDate] = useState<string | null>(null);

    // Modals
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingTx, setEditingTx] = useState<TransactionRow | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingTx, setDeletingTx] = useState<TransactionRow | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ============================
    // Fetch
    // ============================
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (typeFilter !== "all") params.set("type", typeFilter);
            if (categoryFilter !== "all") params.set("category", categoryFilter);

            const qs = params.toString();
            const res = await fetch(`/api/transactions${qs ? `?${qs}` : ""}`);
            const json = await res.json();

            if (!res.ok) throw new Error(json.error || "Failed to fetch");
            setTransactions(json.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    }, [typeFilter, categoryFilter]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // ============================
    // CRUD
    // ============================
    async function handleCreateOrUpdate(data: TransactionFormData) {
        if (editingTx) {
            const res = await fetch(`/api/transactions/${editingTx.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            setTransactions((prev) =>
                prev.map((t) => (t.id === editingTx.id ? json.data : t))
            );
        } else {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            setTransactions((prev) => [json.data, ...prev]);
        }

        setEditingTx(null);
    }

    async function handleDelete() {
        if (!deletingTx) return;

        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/transactions/${deletingTx.id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);

            setTransactions((prev) =>
                prev.filter((t) => t.id !== deletingTx.id)
            );
            setShowDeleteModal(false);
            setDeletingTx(null);
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setDeleteLoading(false);
        }
    }

    // ============================
    // Modal helpers
    // ============================
    function openCreate() {
        setEditingTx(null);
        setPrefillDate(null);
        setShowFormModal(true);
    }
    function openCreateWithDate(date: string) {
        setEditingTx(null);
        setPrefillDate(date);
        setShowFormModal(true);
    }
    function openEdit(tx: TransactionRow) {
        setEditingTx(tx);
        setPrefillDate(null);
        setShowFormModal(true);
    }
    function openDelete(tx: TransactionRow) {
        setDeletingTx(tx);
        setShowDeleteModal(true);
    }

    // ============================
    // Summary
    // ============================
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // Categories present in current data
    const usedCategories = Array.from(
        new Set(transactions.map((t) => t.category))
    );

    const fmt = (n: number) =>
        new Intl.NumberFormat("th-TH", {
            style: "currency",
            currency: "THB",
            minimumFractionDigits: 0,
        }).format(n);

    return (
        <div>
            {/* Summary Bar */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6"
            >
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-medium">รายรับ</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{fmt(totalIncome)}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-xs font-medium">รายจ่าย</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{fmt(totalExpense)}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Wallet className="h-4 w-4" />
                        <span className="text-xs font-medium">คงเหลือ</span>
                    </div>
                    <p
                        className={`text-xl font-bold ${balance >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                            }`}
                    >
                        {fmt(balance)}
                    </p>
                </div>
            </motion.div>

            {/* Filters + Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                {/* Type Filters */}
                <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                    {TYPE_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setTypeFilter(f.value)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${typeFilter === f.value
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            {f.icon && <span className="mr-1">{f.icon}</span>}
                            <Filter className="mr-1 inline-block h-3 w-3" />
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex items-center gap-0.5 rounded-xl border border-border bg-card p-0.5">
                        {VIEW_MODES.map(({ value, label, Icon }) => (
                            <button
                                key={value}
                                onClick={() => setViewMode(value)}
                                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all cursor-pointer ${viewMode === value
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="h-3 w-3" />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground appearance-none cursor-pointer"
                    >
                        <option value="all">ทุกหมวดหมู่</option>
                        {usedCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {TRANSACTION_CATEGORY_ICONS[cat as TransactionCategory] ?? "📌"}{" "}
                                {TRANSACTION_CATEGORY_LABELS[cat as TransactionCategory] ?? cat}
                            </option>
                        ))}
                    </select>

                    {/* Export CSV */}
                    <button
                        onClick={() => {
                            const params = new URLSearchParams();
                            if (typeFilter !== "all") params.set("type", typeFilter);
                            if (categoryFilter !== "all") params.set("category", categoryFilter);
                            const qs = params.toString();
                            window.open(`/api/transactions/export${qs ? `?${qs}` : ""}`, "_blank");
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        title="Export CSV"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">CSV</span>
                    </button>

                    {/* Refresh */}
                    <button
                        onClick={fetchTransactions}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                    </button>

                    {/* Add */}
                    <Button variant="primary" size="sm" onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        เพิ่มรายการ
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
                        onClick={fetchTransactions}
                    >
                        ลองใหม่
                    </Button>
                </div>
            ) : viewMode === "summary" ? (
                <TransactionSummary />
            ) : viewMode === "calendar" ? (
                <TransactionCalendar
                    transactions={transactions}
                    onAddTransaction={openCreateWithDate}
                    onEditTransaction={openEdit}
                />
            ) : transactions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Inbox className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-base font-medium text-foreground">
                        ยังไม่มีรายการ
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        เริ่มบันทึกรายรับรายจ่ายเพื่อติดตามการเงินของคุณ
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        className="mt-4"
                        onClick={openCreate}
                    >
                        <Plus className="h-4 w-4" />
                        เพิ่มรายการใหม่
                    </Button>
                </motion.div>
            ) : (
                <div className="space-y-2">
                    <AnimatePresence>
                        {transactions.map((tx, index) => (
                            <TransactionCard
                                key={tx.id}
                                tx={tx}
                                index={index}
                                onEdit={openEdit}
                                onDelete={openDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modals */}
            <TransactionFormModal
                isOpen={showFormModal}
                editingTx={editingTx}
                prefillDate={prefillDate}
                onClose={() => {
                    setShowFormModal(false);
                    setEditingTx(null);
                    setPrefillDate(null);
                }}
                onSubmit={handleCreateOrUpdate}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                description={
                    deletingTx
                        ? `${TRANSACTION_CATEGORY_LABELS[
                        deletingTx.category as TransactionCategory
                        ] ?? deletingTx.category
                        } - ${new Intl.NumberFormat("th-TH", {
                            style: "currency",
                            currency: "THB",
                            minimumFractionDigits: 0,
                        }).format(deletingTx.amount)}`
                        : ""
                }
                loading={deleteLoading}
                onConfirm={handleDelete}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeletingTx(null);
                }}
            />
        </div>
    );
}
