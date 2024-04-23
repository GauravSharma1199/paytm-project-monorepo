"use server"

import prisma, { enums } from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export const createOnRampTxn = async (amount: number, provider: string) => {
    const session = await getServerSession(authOptions);
    const token = Math.random().toString(); // that is come from bank api (we have to hit bank api for it)
    const userId = session.user.id;
    if (!userId) {
        return {
            message: "User not Logged in",
        }
    }
    await prisma.onRampTransaction.create({
        data: {
            status: enums.OnRampStatus.Processing,
            token,
            provider,
            amount: amount * 100,
            startTime: new Date(),
            userId: Number(userId)
        }
    })
    return {
        message: "onRampTransaction is added",
    }
}