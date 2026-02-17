// ============================
// Transactions Page (Server Component)
// หน้าจัดการรายรับ-รายจ่าย
// ============================

import { TransactionList } from "./_components/transaction-list";

export default function TransactionsPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    รายรับ-รายจ่าย
                </h1>
                <p className="mt-1 text-muted-foreground">
                    บันทึกและติดตามรายรับรายจ่ายทั้งหมดของคุณ
                </p>
            </div>

            {/* Transaction List */}
            <TransactionList />
        </div>
    );
}
