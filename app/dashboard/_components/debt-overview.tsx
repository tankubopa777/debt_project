// ============================
// Debt Overview Table (Server Component)
// แสดงรายการหนี้ทั้งหมดในรูปแบบตาราง/cards
// ============================

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import type { Debt } from "@/lib/types";

interface DebtOverviewProps {
  debts: Debt[];
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  active: {
    label: "กำลังผ่อน",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  paid_off: {
    label: "ปลดหนี้แล้ว",
    className:
      "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  },
  paused: {
    label: "หยุดชั่วคราว",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
};

export function DebtOverview({ debts }: DebtOverviewProps) {
  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>รายการหนี้</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              ยังไม่มีรายการหนี้ เพิ่มหนี้รายการแรกเพื่อเริ่มต้น!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>รายการหนี้ทั้งหมด</CardTitle>
          <span className="text-sm text-muted-foreground">
            {debts.length} รายการ
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  ชื่อหนี้
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  เจ้าหนี้
                </th>
                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                  คงเหลือ
                </th>
                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                  ดอกเบี้ย
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  ความคืบหน้า
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {debts.map((debt) => {
                const progress = calculateProgress(
                  debt.totalAmount - debt.remainingAmount,
                  debt.totalAmount
                );
                const statusConfig = STATUS_LABELS[debt.status];

                return (
                  <tr key={debt.id} className="group">
                    <td className="py-4">
                      <p className="font-medium text-foreground">
                        {debt.name}
                      </p>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {debt.lender}
                    </td>
                    <td className="py-4 text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(debt.remainingAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        จาก {formatCurrency(debt.totalAmount)}
                      </p>
                    </td>
                    <td className="py-4 text-right text-sm text-muted-foreground">
                      {debt.interestRate}%
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="space-y-4 md:hidden">
          {debts.map((debt) => {
            const progress = calculateProgress(
              debt.totalAmount - debt.remainingAmount,
              debt.totalAmount
            );
            const statusConfig = STATUS_LABELS[debt.status];

            return (
              <div
                key={debt.id}
                className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{debt.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {debt.lender}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                {/* Amount */}
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(debt.remainingAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      จาก {formatCurrency(debt.totalAmount)} | ดอกเบี้ย{" "}
                      {debt.interestRate}%
                    </p>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    {progress}%
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
