import { Hono } from "hono";
import { createClient } from "@/lib/supabase/server";
import { DebtRepository } from "@/lib/repositories/debt.repository";
import { DebtService } from "@/lib/services/debt.service";

const debtRoutes = new Hono();

async function getAuthUserId(supabase: Awaited<ReturnType<typeof createClient>>) {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user.id;
}

debtRoutes.get("/", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const status = c.req.query("status") || undefined;

        const debtRepository = new DebtRepository(supabase);
        const debtService = new DebtService(debtRepository);

        const debts = await debtService.getAllDebts(userId, status);
        return c.json({ data: debts });
    } catch (error) {
        console.error("GET /api/debts error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

debtRoutes.get("/:id", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const debtId = c.req.param("id");

        const debtRepository = new DebtRepository(supabase);
        const debtService = new DebtService(debtRepository);

        const debt = await debtService.getDebtById(userId, debtId);
        if (!debt) return c.json({ error: "Debt not found" }, 404);

        return c.json({ data: debt });
    } catch (error) {
        console.error("GET /api/debts/:id error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

debtRoutes.post("/", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const body = await c.req.json();

        // Validate required fields
        if (!body.name || body.total_amount === undefined) {
            return c.json(
                { error: "Missing required fields: name, total_amount" },
                400
            );
        }

        if (body.total_amount <= 0) {
            return c.json({ error: "total_amount must be greater than 0" }, 400);
        }

        const debtRepository = new DebtRepository(supabase);
        const debtService = new DebtService(debtRepository);

        const debt = await debtService.createDebt(userId, {
            name: body.name,
            lender: body.lender || null,
            total_amount: Number(body.total_amount),
            remaining_amount: body.remaining_amount
                ? Number(body.remaining_amount)
                : undefined,
            interest_rate: body.interest_rate ? Number(body.interest_rate) : 0,
            minimum_payment: body.minimum_payment
                ? Number(body.minimum_payment)
                : 0,
            due_date_day: body.due_date_day ? Number(body.due_date_day) : null,
            status: body.status || "active",
        });

        return c.json({ data: debt }, 201);
    } catch (error) {
        console.error("POST /api/debts error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});


debtRoutes.put("/:id", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const debtId = c.req.param("id");
        const body = await c.req.json();

        const debtRepository = new DebtRepository(supabase);
        const debtService = new DebtService(debtRepository);

        const updateData: Record<string, unknown> = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.lender !== undefined) updateData.lender = body.lender;
        if (body.total_amount !== undefined)
            updateData.total_amount = Number(body.total_amount);
        if (body.remaining_amount !== undefined)
            updateData.remaining_amount = Number(body.remaining_amount);
        if (body.interest_rate !== undefined)
            updateData.interest_rate = Number(body.interest_rate);
        if (body.minimum_payment !== undefined)
            updateData.minimum_payment = Number(body.minimum_payment);
        if (body.due_date_day !== undefined)
            updateData.due_date_day = body.due_date_day
                ? Number(body.due_date_day)
                : null;
        if (body.status !== undefined) updateData.status = body.status;

        const debt = await debtService.updateDebt(userId, debtId, updateData);
        if (!debt) return c.json({ error: "Debt not found" }, 404);

        return c.json({ data: debt });
    } catch (error) {
        console.error("PUT /api/debts/:id error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

debtRoutes.delete("/:id", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const debtId = c.req.param("id");

        const debtRepository = new DebtRepository(supabase);
        const debtService = new DebtService(debtRepository);

        const deleted = await debtService.deleteDebt(userId, debtId);
        if (!deleted) return c.json({ error: "Debt not found" }, 404);

        return c.json({ message: "Debt deleted successfully" });
    } catch (error) {
        console.error("DELETE /api/debts/:id error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

export { debtRoutes };
