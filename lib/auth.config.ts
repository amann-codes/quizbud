import { NextAuthConfig, Session, User } from "next-auth";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
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
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    events: {
        createUser: async ({ user }) => {
            if (user.email?.endsWith(".org")) {
                const org = user.email.split("@")[1]
                await prisma.userStat.create({
                    data: {
                        userId: user.id,
                        org,
                        correct: 0,
                        incorrect: 0,
                        skipped: 0,
                        score: 0,
                        globalCurrentRank: null,
                        gloablPrevRank: null,
                        orgCurrentRank: null,
                        orgPrevRank: null,
                    }
                });
            }
            else {
                await prisma.userStat.create({
                    data: {
                        userId: user.id,
                        org: null,
                        correct: 0,
                        incorrect: 0,
                        skipped: 0,
                        score: 0,
                        globalCurrentRank: null,
                        gloablPrevRank: null,
                        orgCurrentRank: null,
                        orgPrevRank: null,
                    }
                });
            }
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") {
                const existing = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (existing && existing.password) {
                    throw new Error("OAuthAccountNotLinked");
                }
            }
            return true;
        },

        jwt: async ({ token }: { user?: User | AdapterUser; token: JWT }): Promise<JWT> => {
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
        signIn: "/auth"
    }
} satisfies NextAuthConfig;
