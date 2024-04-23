import express, { json } from "express";
import db from "@repo/db/client";
import { enums } from "@repo/db/client";
const app = express();

app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
  try {
    //TODO: Add zod validation here?
    const paymentInformation: {
      token: string;
      userId: string;
      amount: string;
    } = {
      token: req.body.token,
      userId: req.body.user_identifier,
      amount: req.body.amount,
    };

    // console.log(paymentInformation);

    // check onRampTxn if(!Proccessing) return false;
    const txn = await db.onRampTransaction.findUnique({
      where: {
        token: paymentInformation.token,
      },
    });
    console.log(txn);

    if (!txn) {
      return res.json({
        message: "Invalid token",
      });
    }
    if (txn.status !== enums.OnRampStatus.Processing) {
      return res.json({
        message: "token is expired",
      });
    }
    if (txn.userId !== Number(paymentInformation.userId)) {
      return res.json({
        message: "you are passing wrong user_identifier",
      });
    }
    if (txn.amount !== Number(paymentInformation.amount)) {
      return res.json({
        message: "you are passing wrong amount for this token",
      });
    }

    // Update balance in db, add txn
    await db.$transaction([
      db.balance.update({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: enums.OnRampStatus.Success,
        },
      }),
    ]);

    return res.json({
      message: "Captured",
    });
  } catch (e) {
    console.log(e);
    return res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});
console.log("listening on PORT 3003");

app.listen(3003);
