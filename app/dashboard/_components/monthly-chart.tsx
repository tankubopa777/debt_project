"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import type { MonthlyChartItem } from "@/lib/repositories/dashboard.repository";

interface MonthlyChartProps {
    data: MonthlyChartItem[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
            <p className="text-sm font-medium text-foreground mb-2">{label}</p>
            {payload.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (item: any, index: number) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 text-xs"
                    >
                        <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">
                            {item.name}:
                        </span>
                        <span className="font-semibold text-foreground">
                            {formatCurrency(item.value)}
                        </span>
                    </div>
                )
            )}
        </div>
    );
}

export function MonthlyChart({ data }: MonthlyChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            <Card className="h-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>รายรับ-รายจ่ายรายเดือน</CardTitle>
                        <span className="text-xs text-muted-foreground">
                            ปี {new Date().getFullYear() + 543}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 5,
                                    left: -10,
                                    bottom: 5,
                                }}
                                barCategoryGap="20%"
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--border)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="monthLabel"
                                    tick={{
                                        fontSize: 11,
                                        fill: "var(--muted-foreground)",
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{
                                        fontSize: 11,
                                        fill: "var(--muted-foreground)",
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) =>
                                        val >= 1000
                                            ? `${(val / 1000).toFixed(0)}k`
                                            : val
                                    }
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: "12px" }}
                                    iconType="circle"
                                    iconSize={8}
                                />
                                <Bar
                                    dataKey="income"
                                    name="รายรับ"
                                    fill="#059669"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={24}
                                />
                                <Bar
                                    dataKey="expense"
                                    name="รายจ่าย"
                                    fill="#ef4444"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={24}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
