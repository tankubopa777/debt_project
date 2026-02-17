import { Hono } from "hono";
import { createClient } from "@/lib/supabase/server";
import { TransactionRepository } from "@/lib/repositories/transaction.repository";
import { TransactionService } from "@/lib/services/transaction.service";

const transactionRoutes = new Hono();

async function getAuthUserId(
    supabase: Awaited<ReturnType<typeof createClient>>
) {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user.id;
}

transactionRoutes.get("/", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const filters = {
            type: c.req.query("type") || undefined,
            category: c.req.query("category") || undefined,
            startDate: c.req.query("startDate") || undefined,
            endDate: c.req.query("endDate") || undefined,
        };

        const txRepo = new TransactionRepository(supabase);
        const txService = new TransactionService(txRepo);

        const transactions = await txService.getAllTransactions(userId, filters);
        return c.json({ data: transactions });
    } catch (error) {
        console.error("GET /api/transactions error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

// ============================
// GET /api/transactions/summary/monthly
// Query: ?year=2026
// ============================
transactionRoutes.get("/summary/monthly", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const year = c.req.query("year") ? Number(c.req.query("year")) : undefined;

        const txRepo = new TransactionRepository(supabase);
        const txService = new TransactionService(txRepo);

        const summary = await txService.getMonthlySummary(userId, year);
        return c.json({ data: summary });
    } catch (error) {
        console.error("GET /api/transactions/summary/monthly error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

// ============================
// GET /api/transactions/summary/daily
// Query: ?year=2026&month=2
// ============================
transactionRoutes.get("/summary/daily", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const year = c.req.query("year") ? Number(c.req.query("year")) : undefined;
        const month = c.req.query("month") ? Number(c.req.query("month")) : undefined;

        const txRepo = new TransactionRepository(supabase);
        const txService = new TransactionService(txRepo);

        const summary = await txService.getDailySummary(userId, year, month);
        return c.json({ data: summary });
    } catch (error) {
        console.error("GET /api/transactions/summary/daily error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

// ============================
// GET /api/transactions/export
// Query: ?type=income|expense&category=food&startDate=...&endDate=...
// Returns CSV file
// ============================
transactionRoutes.get("/export", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const filters = {
            type: c.req.query("type") || undefined,
            category: c.req.query("category") || undefined,
            startDate: c.req.query("startDate") || undefined,
            endDate: c.req.query("endDate") || undefined,
        };

        const txRepo = new TransactionRepository(supabase);
        const txService = new TransactionService(txRepo);

        const csv = await txService.exportTransactionsCSV(userId, filters);

        return new Response(csv, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="transactions_${new Date().toISOString().slice(0, 10)}.csv"`,
            },
        });
    } catch (error) {
        console.error("GET /api/transactions/export error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

// ============================
// GET /api/transactions/:id
// ============================
transactionRoutes.get("/:id", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const txId = c.req.param("id");

        const txRepo = new TransactionRepository(supabase);
        const txService = new TransactionService(txRepo);

        const tx = await txService.getTransactionById(userId, txId);
        if (!tx) return c.json({ error: "Transaction not found" }, 404);

        return c.json({ data: tx });
    } catch (error) {
        console.error("GET /api/transactions/:id error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});


transactionRoutes.post("/", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const body = await c.req.json();

        // Validate required fields
        if (!body.type || !body.category || body.amount === undefined) {
            return c.json(
                { error: "Missing required fields: type, category, amount" },
                400
            );
        }

        if (!["income", "expense"].includes(body.type)) {
            return c.json({ error: "type must be 'income' or 'expense'" }, 400);
        }

        if (Number(body.amount) <= 0) {
            return c.json({ error: "amount must be greater than 0" }, 400);
        }

        const txRepo = new TransactionRepository(supabase);
        const txService = new TransactionService(txRepo);

        const tx = await txService.createTransaction(userId, {
            type: body.type,
            category: body.category,
            amount: Number(body.amount),
            note: body.note || null,
            debt_id: body.debt_id || null,
            transaction_date: body.transaction_date || undefined,
        });

        return c.json({ data: tx }, 201);
    } catch (error) {
        console.error("POST /api/transactions error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

transactionRoutes.put("/:id", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const txId = c.req.param("id");
        const body = await c.req.json();

        const txRepo = new TransactionRepository(supabase);
        const txService = new TransactionService(txRepo);

        const updateData: Record<string, unknown> = {};
        if (body.type !== undefined) updateData.type = body.type;
        if (body.category !== undefined) updateData.category = body.category;
        if (body.amount !== undefined) updateData.amount = Number(body.amount);
        if (body.note !== undefined) updateData.note = body.note;
        if (body.debt_id !== undefined) updateData.debt_id = body.debt_id || null;
        if (body.transaction_date !== undefined)
            updateData.transaction_date = body.transaction_date;

        const tx = await txService.updateTransaction(userId, txId, updateData);
        if (!tx) return c.json({ error: "Transaction not found" }, 404);

        return c.json({ data: tx });
    } catch (error) {
        console.error("PUT /api/transactions/:id error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

transactionRoutes.delete("/:id", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const txId = c.req.param("id");

        const txRepo = new TransactionRepository(supabase);
        const txService = new TransactionService(txRepo);

        const deleted = await txService.deleteTransaction(userId, txId);
        if (!deleted) return c.json({ error: "Transaction not found" }, 404);

        return c.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("DELETE /api/transactions/:id error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

export { transactionRoutes };
