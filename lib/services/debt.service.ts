import {
    DebtRepository,
    type DebtRow,
    type CreateDebtData,
    type UpdateDebtData,
} from "../repositories/debt.repository";

export class DebtService {
    constructor(private debtRepository: DebtRepository) { }

    /**
     * ดึงหนี้ทั้งหมดของ user (filter by status optional)
     */
    async getAllDebts(userId: string, status?: string): Promise<DebtRow[]> {
        return this.debtRepository.findAllByUserId(userId, status);
    }

    /**
     * ดึงหนี้ตาม id พร้อมตรวจสอบ ownership
     */
    async getDebtById(userId: string, debtId: string): Promise<DebtRow | null> {
        const debt = await this.debtRepository.findById(debtId);
        if (!debt || debt.user_id !== userId) return null;
        return debt;
    }

    /**
     * สร้างหนี้ใหม่
     * remaining_amount จะถูก set เท่ากับ total_amount ถ้าไม่ระบุ
     */
    async createDebt(
        userId: string,
        data: Omit<CreateDebtData, "user_id">
    ): Promise<DebtRow> {
        return this.debtRepository.create({
            ...data,
            user_id: userId,
            remaining_amount: data.remaining_amount ?? data.total_amount,
        });
    }

    /**
     * อัพเดตหนี้ (ต้องเป็นเจ้าของเท่านั้น)
     */
    async updateDebt(
        userId: string,
        debtId: string,
        data: UpdateDebtData
    ): Promise<DebtRow | null> {
        const debt = await this.debtRepository.findById(debtId);
        if (!debt || debt.user_id !== userId) return null;

        return this.debtRepository.update(debtId, data);
    }

    /**
     * ลบหนี้ (ต้องเป็นเจ้าของเท่านั้น)
     */
    async deleteDebt(userId: string, debtId: string): Promise<boolean> {
        const debt = await this.debtRepository.findById(debtId);
        if (!debt || debt.user_id !== userId) return false;

        await this.debtRepository.delete(debtId);
        return true;
    }
}
