"use client";
import { motion } from "framer-motion";
import { CalendarClock, AlertTriangle, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { UpcomingPayment } from "@/lib/repositories/dashboard.repository";

interface UpcomingPaymentsProps {
    payments: UpcomingPayment[];
}

function getUrgencyConfig(daysUntil: number) {
    if (daysUntil <= 0) {
        return {
            badge: "วันนี้!",
            badgeClass:
                "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
            borderClass: "border-l-red-500",
            icon: AlertTriangle,
            iconColor: "text-red-500",
        };
    }
    if (daysUntil <= 3) {
        return {
            badge: `อีก ${daysUntil} วัน`,
            badgeClass:
                "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
            borderClass: "border-l-amber-500",
            icon: Clock,
            iconColor: "text-amber-500",
        };
    }
    return {
        badge: `อีก ${daysUntil} วัน`,
        badgeClass:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        borderClass: "border-l-emerald-500",
        icon: CalendarClock,
        iconColor: "text-emerald-500",
    };
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-primary" />
                        การชำระที่ใกล้ถึง
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                        {payments.length} รายการ
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                {payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <CalendarClock className="h-10 w-10 text-muted-foreground/30" />
                        <p className="mt-3 text-sm text-muted-foreground">
                            ไม่มีรายการชำระที่ใกล้ถึง
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {payments.slice(0, 5).map((payment, index) => {
                            const urgency = getUrgencyConfig(
                                payment.daysUntilDue
                            );

                            return (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.08,
                                        duration: 0.3,
                                    }}
                                    className={`rounded-xl border border-border bg-background p-3.5 border-l-4 ${urgency.borderClass} transition-colors hover:bg-muted/50`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <urgency.icon
                                                className={`h-4 w-4 shrink-0 ${urgency.iconColor}`}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {payment.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {payment.lender
                                                        ? `${payment.lender} • `
                                                        : ""}
                                                    วันที่ {payment.dueDateDay}{" "}
                                                    ของเดือน
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-3">
                                            <p className="text-sm font-bold text-foreground">
                                                {formatCurrency(
                                                    payment.minimumPayment
                                                )}
                                            </p>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${urgency.badgeClass}`}
                                            >
                                                {urgency.badge}
                                            </span>
                                        </div>
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
