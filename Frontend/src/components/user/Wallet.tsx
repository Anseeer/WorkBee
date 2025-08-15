import { CheckCircle } from "lucide-react";

export default function Wallet() {
  const balance = 1299.0;
  const transactions = [
    {
      id: "TXN001",
      date: "2025-08-15",
      withdrawal: "-",
      deposit: "₹500",
      refunded: "-"
    },
    {
      id: "TXN002",
      date: "2025-08-14",
      withdrawal: "₹200",
      deposit: "-",
      refunded: "-"
    }
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Wallet Icon */}
      <div className="bg-yellow-400 rounded-full p-6">
        <img src="/wallet-icon.png" alt="Wallet" className="w-20 h-20" />
      </div>

      {/* Balance */}
      <div className="flex items-center text-green-600 text-xl font-semibold">
        ₹ {balance.toFixed(2)}
        <CheckCircle className="ml-2 w-6 h-6" />
      </div>

      {/* Transaction Table */}
      <div className="w-full max-w-4xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-yellow-400 text-black text-lg">
              <th className="py-2 px-4 text-left">Transaction Id</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Withdrawal</th>
              <th className="py-2 px-4 text-left">Deposit</th>
              <th className="py-2 px-4 text-left">Refunded</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index} className="border-b text-center">
                <td className="py-2 px-4">{txn.id}</td>
                <td className="py-2 px-4">{txn.date}</td>
                <td className="py-2 px-4">{txn.withdrawal}</td>
                <td className="py-2 px-4">{txn.deposit}</td>
                <td className="py-2 px-4">{txn.refunded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
