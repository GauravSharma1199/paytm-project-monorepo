
import { getServerSession } from "next-auth";
import { P2PTransaction } from "../../../components/P2PTransaction";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getP2PTransaction() {
    const session = await getServerSession(authOptions);
    const userId = session.user.id;
    const number = session.user.email;
    console.log(session);
    
    if(!userId) {        
        return []
    }
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                {fromUserId: Number(userId)},
                {toUserId: Number(userId)},
            ]
        },
        include: {
            fromUser: true,  // Includes details of the user sending the money
            toUser: true,    // Includes details of the user receiving the money
          }
    })
    // console.log({txns});
    
    return txns.map((txn) => ({
        number,
        time: txn.timestamp,
        amount: txn.amount,
        fromUser: txn.fromUser,
        toUser: txn.toUser
    }))
}
export default async function () {
    const transactions = await getP2PTransaction();
    // console.log(transactions);
    
  return (
    <div className="w-screen">
      <SendCard />
      <P2PTransaction transactions={transactions} />
    </div>
  );
}
