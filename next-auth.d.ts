import { type DefaultSession } from "next-auth";

export type ExtendSessionForUser = DefaultSession["user"] & {
  id: string;
  role: string;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  image: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendSessionForUser;
  }
}
