import { Hono } from "hono";
import { createClient } from "@/lib/supabase/server";
import { UserRepository } from "@/lib/repositories/user.repository";
import { UserService } from "@/lib/services/user.service";

const userRoutes = new Hono();

userRoutes.get("/me", async (c) => {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userRepository = new UserRepository(supabase);
    const userService = new UserService(userRepository);

    const profile = await userService.getProfile(authUser.id);

    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ data: profile });
  } catch (error) {
    console.error("GET /api/users/me error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export { userRoutes };
