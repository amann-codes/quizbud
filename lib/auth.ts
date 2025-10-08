import NextAuth from "next-auth";
import { authOptions } from "./auth.config";

export const { signIn, signOut, handlers, auth } = NextAuth(authOptions);