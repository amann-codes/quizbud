import { NextAuthConfig, Session, User } from "next-auth";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    console.error("email and password are required");
                    return null;
                }
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email: credentials.email,
                    },
                    select: {
                        id: true,
                        email: true,
                        password: true,
                        name: true
                    }
                })
                if (existingUser && existingUser.password && (await compare(String(credentials.password), existingUser.password))) {
                    return {
                        id: existingUser.id,
                        name: existingUser.name,
                        email: existingUser.email,
                    }
                }
                console.error("Invalid email address or password")
                return null;
            }
        })
    ],
    secret:process.env.AUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    callbacks: {
        jwt: async ({ user, token }: { user?: User | AdapterUser; token: JWT }): Promise<JWT> => {
            return token;
        },
        session: async ({ session, token }: { session: Session; token: JWT }): Promise<Session> => {
            if (session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin"
    }
} satisfies NextAuthConfig;
