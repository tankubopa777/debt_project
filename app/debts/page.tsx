// ============================
// Debts Page (Server Component)
// หน้าจัดการหนี้สิน
// ============================

import { DebtList } from "./_components/debt-list";

export default function DebtsPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    จัดการหนี้สิน
                </h1>
                <p className="mt-1 text-muted-foreground">
                    เพิ่ม แก้ไข และติดตามหนี้สินทั้งหมดของคุณ
                </p>
            </div>

            {/* Debt List */}
            <DebtList />
        </div>
    );
}
