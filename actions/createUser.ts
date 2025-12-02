"use server"

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const createUser = async ({ name, email, password }: { name: string, email: string, password: string }) => {
    try {
        if (!email || !password) {
            return ({
                status: 400,
                statusText: 'Email and password are required'
            })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (existingUser) {
            return ({
                statusText: "Invalid email address"
            })
        }
        const hashedPassword = await bcrypt.hashSync(password);
        const user = await prisma.user.create({
            data: {
                name, email, password: hashedPassword
            }
        })
        if (!user) {
            return ({
                status: 400,
                statusText: "Failed to create account"
            })
        }

        const userStat = await prisma.userStat.create({
            data: {
                userId: user.id
            }
        })
        
    } catch (error) {
        throw new Error(`Error occured while creating account: ${error}`)
    }
}