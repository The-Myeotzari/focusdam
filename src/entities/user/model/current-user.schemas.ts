import { z } from "zod";

export const UserAccountSchema = z.object({
  name: z.string(),
  email: z.email(),
  socialProvider: z.enum(["google", "kakao", "apple"]),
});

export const CurrentUserResponseSchema = z.object({
  ok: z.literal(true),
  user: UserAccountSchema,
});
