"use client";
import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { TransactionRow } from "@/lib/repositories/transaction.repository";
import {
    TRANSACTION_CATEGORY_ICONS,
    TRANSACTION_CATEGORY_LABELS,
} from "@/lib/constants";
import type { TransactionCategory } from "@/lib/types";

interface RecentTransactionsProps {
    transactions: TransactionRow[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        ธุรกรรมล่าสุด
                    </CardTitle>
                    <a
                        href="/transactions"
                        className="text-xs text-primary hover:underline"
                    >
                        ดูทั้งหมด →
                    </a>
                </div>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Receipt className="h-10 w-10 text-muted-foreground/30" />
                        <p className="mt-3 text-sm text-muted-foreground">
                            ยังไม่มีรายการธุรกรรม
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {transactions.map((tx, index) => {
                            const isIncome = tx.type === "income";
                            const categoryIcon =
                                TRANSACTION_CATEGORY_ICONS[
                                tx.category as TransactionCategory
                                ] ?? "📌";
                            const categoryLabel =
                                TRANSACTION_CATEGORY_LABELS[
                                tx.category as TransactionCategory
                                ] ?? tx.category;
                            const date = new Date(tx.transaction_date);
                            const dateStr = date.toLocaleDateString("th-TH", {
                                day: "numeric",
                                month: "short",
                            });

                            return (
                                <motion.div
                                    key={tx.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.06,
                                        duration: 0.3,
                                    }}
                                    className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/50"
                                >
                                    {/* Category icon */}
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm ${isIncome
                                            ? "bg-emerald-100 dark:bg-emerald-500/10"
                                            : "bg-red-100 dark:bg-red-500/10"
                                            }`}
                                    >
                                        {categoryIcon}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {categoryLabel}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {dateStr}
                                            {tx.note ? ` • ${tx.note}` : ""}
                                        </p>
                                    </div>

                                    {/* Amount */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {isIncome ? (
                                            <ArrowUpCircle className="h-3.5 w-3.5 text-emerald-500" />
                                        ) : (
                                            <ArrowDownCircle className="h-3.5 w-3.5 text-red-500" />
                                        )}
                                        <span
                                            className={`text-sm font-semibold ${isIncome
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-red-600 dark:text-red-400"
                                                }`}
                                        >
                                            {isIncome ? "+" : "-"}
                                            {formatCurrency(tx.amount)}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
