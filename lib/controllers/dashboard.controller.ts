import { Hono } from "hono";
import { createClient } from "@/lib/supabase/server";
import { DashboardRepository } from "@/lib/repositories/dashboard.repository";
import { DashboardService } from "@/lib/services/dashboard.service";

const dashboardRoutes = new Hono();

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

// ============================
// GET /api/dashboard/summary
// Returns full dashboard data
// ============================
dashboardRoutes.get("/summary", async (c) => {
    try {
        const supabase = await createClient();
        const userId = await getAuthUserId(supabase);
        if (!userId) return c.json({ error: "Unauthorized" }, 401);

        const repo = new DashboardRepository(supabase);
        const service = new DashboardService(repo);

        const data = await service.getDashboardData(userId);
        return c.json({ data });
    } catch (error) {
        console.error("GET /api/dashboard/summary error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

export { dashboardRoutes };
