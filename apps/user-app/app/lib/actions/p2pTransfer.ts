"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";

export const p2pTransfer = async (to:string, amount: number) => {
    const session = await getServerSession(authOptions);
    const from = await session?.user?.id;
    if(!from) {
        return {
            message: "your not logged in"
        }
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    })

    if(!toUser) {
        throw new Error('Invalid user')
    
    }

    // console.log({toUser, from});
    if(toUser.id === Number(from)) {
        throw new Error('You are not send money to yourself')
    }

    console.log({from, to, amount});
    
    await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`Select * from "Balance" where "userId" = ${Number(from)} FOR UPDATE`;
        const fromBalance = await tx.balance.findUnique({
            where: {
                userId: Number(from)
            }
        });
        console.log(fromBalance);
        
        if(!fromBalance || fromBalance?.amount < amount){
            
            throw new Error('Insufficient Balance')
        }

        await tx.balance.update({
            where: {
                userId: Number(from)
            },
            data:{
                amount: { decrement: amount}
            }
        });
        await tx.balance.update({
            where: {
                userId: Number(toUser.id)
            },
            data:{
                amount: { increment: amount}
            }
        });

        await tx.p2pTransfer.create({
            data:{
                amount,
                timestamp: new Date(),
                fromUserId: Number(from),
                toUserId: Number(toUser.id)
            }
        })

    })
}