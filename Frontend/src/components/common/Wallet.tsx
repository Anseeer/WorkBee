import { useState } from "react";

interface Transaction {
  transactionId: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description?: string;
  createdAt: string;
}


interface WalletPageProps {
  balance?: number;
  history?: Transaction[];
}

const Wallet = ({ balance, history }: WalletPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  if (!history?.length) {
    history = [];
  } else if (!balance) {
    balance = 0.00;
  }
  // pagination
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = history.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-gray-50 flex flex-col items-center p-2">
      <main className="w-full max-w-4xl">
        {/* Wallet Card */}
        <div className="rounded-lg  flex flex-col items-center">
          <div className="bg-gradient-to-r from-green-700 to-blue-900 text-white rounded-xl p-5 w-[320px] h-[150px] flex justify-between items-center shadow-md">
            <div className="flex flex-col gap-3">
              <div className="text-3xl font-bold">₹{balance?.toFixed(2)}</div>
              <small>**** **** **** 2757</small>
              <small>09/25</small>
            </div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
              alt="Card"
              className="w-15 h-10"
            />
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-lg font-bold mb-1 ">Recent Transactions</div>
          {history.length > 0 ? (
            <div className="border rounded flex flex-col h-[230px]">
              {/* Table Wrapper */}
              <div className="flex-1">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-[#8FC39D]">
                    <tr>
                      <th className="p-2">Amount</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Transaction ID</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((tx) => (
                      <tr
                        key={tx.transactionId}
                        className="border-b border-gray-300 hover:bg-gray-50"
                      >
                        <td
                          className={`p-2 font-bold ${tx.type === "CREDIT"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                        >
                          ₹{tx.amount.toFixed(2)}
                        </td>
                        <td className="p-2">{tx.type}</td>
                        <td className="p-2">{tx.transactionId.slice(0,15).toUpperCase()}</td>
                        <td className="p-2">
                          {new Date(tx.createdAt).toLocaleDateString("en-GB")}
                        </td>
                        <td className="p-2">{tx.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination fixed at bottom */}
              <div className="flex justify-between items-center m-2 bg-white text-sm">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded ${currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-900 text-white hover:bg-green-600"
                    }`}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-900 text-white hover:bg-green-600"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Empty History</div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Wallet;
