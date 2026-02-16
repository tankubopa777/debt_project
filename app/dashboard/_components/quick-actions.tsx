// ============================
// Quick Actions (Server Component)
// ปุ่มลัดสำหรับการดำเนินการเร็วๆ
// ============================

import { Plus, CreditCard, TrendingUp, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ACTIONS = [
  {
    icon: Plus,
    label: "เพิ่มหนี้ใหม่",
    href: "/debts",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CreditCard,
    label: "บันทึกการชำระ",
    href: "/transactions",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    icon: TrendingUp,
    label: "ดูกลยุทธ์",
    href: "/strategy",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  },
  {
    icon: FileText,
    label: "รายงานสรุป",
    href: "/transactions",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
] as const;

export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>ดำเนินการเร็ว</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {ACTIONS.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {action.label}
            </span>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
