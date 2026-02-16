// ============================
// App Constants
// ============================

import type { TransactionCategory } from "./types";

/**
 * Transaction category icons (emoji)
 */
export const TRANSACTION_CATEGORY_ICONS: Record<TransactionCategory, string> = {
  food: "🍜",
  transport: "🚗",
  housing: "🏠",
  utilities: "💡",
  entertainment: "🎬",
  health: "🏥",
  education: "📚",
  shopping: "🛒",
  debt_payment: "💳",
  savings: "🏦",
  salary: "💰",
  freelance: "💻",
  other: "📌",
};

/**
 * Transaction category labels (Thai)
 */
export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  food: "อาหาร",
  transport: "การเดินทาง",
  housing: "ที่อยู่อาศัย",
  utilities: "สาธารณูปโภค",
  entertainment: "บันเทิง",
  health: "สุขภาพ",
  education: "การศึกษา",
  shopping: "ชอปปิ้ง",
  debt_payment: "ชำระหนี้",
  savings: "ออมเงิน",
  salary: "เงินเดือน",
  freelance: "ฟรีแลนซ์",
  other: "อื่นๆ",
};

/**
 * App navigation links
 */
export const NAV_LINKS = [
  { href: "/dashboard", label: "แดชบอร์ด" },
  { href: "/debts", label: "หนี้สิน" },
  { href: "/transactions", label: "รายรับรายจ่าย" },
  { href: "/strategy", label: "กลยุทธ์" },
] as const;
