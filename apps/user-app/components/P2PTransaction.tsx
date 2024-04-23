import { Card } from "@repo/ui/card";

export const P2PTransaction = ({
  transactions,
}: {
  transactions: {
    number: string;
    time: Date;
    amount: number;
    // TODO: Can the type of `status` be more specific?
    status?: string;
    fromUser: any;
    toUser: any;
  }[];
}) => {
//   console.log(transactions);

  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {transactions.map((t, i) => (
          <div key={i} className="flex justify-between">
            <div>
              <div className="text-sm">Received INR</div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()} {t.number == t.fromUser.number ? `'==>' ${t.toUser?.number}` : `'<==' ${t.toUser.number}`} 
              </div>
            </div>
            

            <div className="flex flex-col justify-center">
            {t.number == t.fromUser.number ? "-" : "+"}
              {" "} Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
