// ============================
// Progress Section (Server Component)
// แสดงความคืบหน้าในการปลดหนี้
// ============================

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DashboardSummary } from "@/lib/types";

interface ProgressSectionProps {
  summary: DashboardSummary;
}

export function ProgressSection({ summary }: ProgressSectionProps) {
  const { totalDebt, totalPaid, progressPercent } = summary;
  const totalOriginal = totalDebt + totalPaid;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ความคืบหน้าปลดหนี้</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {progressPercent}%
              </p>
              <p className="text-sm text-muted-foreground">ของหนี้ทั้งหมด</p>
            </div>
            <p className="text-sm text-muted-foreground">
              เป้าหมาย: {formatCurrency(totalOriginal)}
            </p>
          </div>

          {/* Bar */}
          <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary to-sky-400 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">
                ชำระแล้ว {formatCurrency(totalPaid)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              <span className="text-sm text-muted-foreground">
                คงเหลือ {formatCurrency(totalDebt)}
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 rounded-xl bg-accent/50 p-4">
          <p className="text-sm font-medium text-accent-foreground">
            {progressPercent < 25
              ? "เพิ่งเริ่มต้น แต่ทุกก้าวเล็กๆ สำคัญมาก! สู้ๆ นะ 💪"
              : progressPercent < 50
                ? "มาได้ดีมาก! คุณกำลังอยู่บนเส้นทางที่ถูกต้อง 🎯"
                : progressPercent < 75
                  ? "เกินครึ่งแล้ว! อิสรภาพทางการเงินใกล้เข้ามาแล้ว 🌟"
                  : "เหลืออีกนิดเดียว! คุณเก่งมากที่มาได้ไกลขนาดนี้ 🏆"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
