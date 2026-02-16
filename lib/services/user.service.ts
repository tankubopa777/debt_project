import type { User as AuthUser } from "@supabase/supabase-js";
import {
  UserRepository,
  type UserRow,
  type CreateUserData,
} from "../repositories/user.repository";

export class UserService {
  constructor(private userRepository: UserRepository) { }

  async syncAuthUser(authUser: AuthUser): Promise<UserRow> {
    if (!authUser.email) {
      throw new Error("Auth user must have an email address");
    }

    const displayName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email.split("@")[0];

    const userData: CreateUserData = {
      id: authUser.id,
      email: authUser.email,
      display_name: displayName,
    };

    return this.userRepository.upsert(userData);
  }

  async getProfile(userId: string): Promise<UserRow | null> {
    return this.userRepository.findById(userId);
  }
}
