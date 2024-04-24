import { NextResponse } from "next/server"
import { PrismaClient } from "@repo/db/client";

const client = new PrismaClient();

<<<<<<< Updated upstream
export const GET = async () => {
    await client.user.create({
        data: {
            email: "asd",
            name: "adsads"
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}
=======
// export const GET = async () => {
//     await client.user.create({
//         data: {
//             email: "asd",
//             name: "adsads"
//         }
//     })
//     return NextResponse.json({
//         message: "hi there"
//     })
// }
>>>>>>> Stashed changes
