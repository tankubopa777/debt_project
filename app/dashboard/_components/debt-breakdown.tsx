"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import type { DebtBreakdownItem } from "@/lib/repositories/dashboard.repository";

interface DebtBreakdownProps {
    data: DebtBreakdownItem[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0];

    return (
        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(item.value)} ({item.payload.percentage}%)
            </p>
        </div>
    );
}

export function DebtBreakdown({ data }: DebtBreakdownProps) {
    const chartData = data.map((d) => ({
        name: d.name,
        value: d.remainingAmount,
        percentage: d.percentage,
        color: d.color,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>สัดส่วนหนี้</CardTitle>
                </CardHeader>
                <CardContent>
                    {data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-muted-foreground">
                                ไม่มีหนี้ที่กำลังผ่อน
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="h-[180px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={70}
                                            innerRadius={40}
                                            dataKey="value"
                                            strokeWidth={2}
                                            stroke="var(--card)"
                                            animationDuration={1000}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend */}
                            <div className="mt-3 space-y-2">
                                {data.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.6 + index * 0.08,
                                            duration: 0.3,
                                        }}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div
                                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="text-muted-foreground truncate">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="font-medium text-foreground shrink-0 ml-2">
                                            {item.percentage}%
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
