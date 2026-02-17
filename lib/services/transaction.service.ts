import {
    TransactionRepository,
    type TransactionRow,
    type CreateTransactionData,
    type UpdateTransactionData,
    type TransactionFilters,
    type MonthlySummaryRow,
    type DailySummaryRow,
} from "../repositories/transaction.repository";
import {
    TRANSACTION_CATEGORY_LABELS,
} from "../constants";
import type { TransactionCategory } from "../types";

export class TransactionService {
    constructor(private txRepository: TransactionRepository) { }

    /**
     * ดึง transactions ทั้งหมดของ user (filter optional)
     */
    async getAllTransactions(
        userId: string,
        filters?: TransactionFilters
    ): Promise<TransactionRow[]> {
        return this.txRepository.findAllByUserId(userId, filters);
    }

    /**
     * ดึง transaction ตาม id พร้อมตรวจสอบ ownership
     */
    async getTransactionById(
        userId: string,
        txId: string
    ): Promise<TransactionRow | null> {
        const tx = await this.txRepository.findById(txId);
        if (!tx || tx.user_id !== userId) return null;
        return tx;
    }

    /**
     * สร้าง transaction ใหม่
     */
    async createTransaction(
        userId: string,
        data: Omit<CreateTransactionData, "user_id">
    ): Promise<TransactionRow> {
        return this.txRepository.create({
            ...data,
            user_id: userId,
        });
    }

    /**
     * อัพเดต transaction (ต้องเป็นเจ้าของ)
     */
    async updateTransaction(
        userId: string,
        txId: string,
        data: UpdateTransactionData
    ): Promise<TransactionRow | null> {
        const tx = await this.txRepository.findById(txId);
        if (!tx || tx.user_id !== userId) return null;

        return this.txRepository.update(txId, data);
    }

    /**
     * ลบ transaction (ต้องเป็นเจ้าของ)
     */
    async deleteTransaction(userId: string, txId: string): Promise<boolean> {
        const tx = await this.txRepository.findById(txId);
        if (!tx || tx.user_id !== userId) return false;

        await this.txRepository.delete(txId);
        return true;
    }

    // ============================
    // Summary Methods
    // ============================

    /**
     * สรุปรายเดือน — group by YYYY-MM
     */
    async getMonthlySummary(
        userId: string,
        year?: number
    ): Promise<MonthlySummaryRow[]> {
        const filters: TransactionFilters = {};
        if (year) {
            filters.startDate = `${year}-01-01T00:00:00.000Z`;
            filters.endDate = `${year}-12-31T23:59:59.999Z`;
        }

        const transactions = await this.txRepository.findAllByUserId(userId, filters);

        const map = new Map<string, MonthlySummaryRow>();

        for (const tx of transactions) {
            const d = new Date(tx.transaction_date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

            if (!map.has(key)) {
                map.set(key, { month: key, totalIncome: 0, totalExpense: 0, balance: 0, count: 0 });
            }
            const row = map.get(key)!;
            row.count++;
            if (tx.type === "income") {
                row.totalIncome += tx.amount;
            } else {
                row.totalExpense += tx.amount;
            }
            row.balance = row.totalIncome - row.totalExpense;
        }

        return Array.from(map.values()).sort((a, b) => b.month.localeCompare(a.month));
    }

    /**
     * สรุปรายวัน — group by YYYY-MM-DD
     */
    async getDailySummary(
        userId: string,
        year?: number,
        month?: number
    ): Promise<DailySummaryRow[]> {
        const filters: TransactionFilters = {};
        if (year && month) {
            const lastDay = new Date(year, month, 0).getDate();
            const mm = String(month).padStart(2, "0");
            filters.startDate = `${year}-${mm}-01T00:00:00.000Z`;
            filters.endDate = `${year}-${mm}-${String(lastDay).padStart(2, "0")}T23:59:59.999Z`;
        } else if (year) {
            filters.startDate = `${year}-01-01T00:00:00.000Z`;
            filters.endDate = `${year}-12-31T23:59:59.999Z`;
        }

        const transactions = await this.txRepository.findAllByUserId(userId, filters);

        const map = new Map<string, DailySummaryRow>();

        for (const tx of transactions) {
            const d = new Date(tx.transaction_date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

            if (!map.has(key)) {
                map.set(key, { date: key, totalIncome: 0, totalExpense: 0, balance: 0, count: 0 });
            }
            const row = map.get(key)!;
            row.count++;
            if (tx.type === "income") {
                row.totalIncome += tx.amount;
            } else {
                row.totalExpense += tx.amount;
            }
            row.balance = row.totalIncome - row.totalExpense;
        }

        return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
    }

    /**
     * Export transactions as CSV string
     */
    async exportTransactionsCSV(
        userId: string,
        filters?: TransactionFilters
    ): Promise<string> {
        const transactions = await this.txRepository.findAllByUserId(userId, filters);

        const BOM = "\uFEFF"; // UTF-8 BOM for Excel
        const header = "วันที่,ประเภท,หมวดหมู่,จำนวนเงิน,หมายเหตุ";
        const rows = transactions.map((tx) => {
            const date = new Date(tx.transaction_date).toLocaleDateString("th-TH");
            const type = tx.type === "income" ? "รายรับ" : "รายจ่าย";
            const category = TRANSACTION_CATEGORY_LABELS[tx.category as TransactionCategory] ?? tx.category;
            const amount = tx.amount.toFixed(2);
            const note = (tx.note ?? "").replace(/"/g, '""');
            return `${date},${type},${category},${amount},"${note}"`;
        });

        return BOM + [header, ...rows].join("\n");
    }
}

