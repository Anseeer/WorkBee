import { useEffect, useState } from "react";
import { fetchWallet } from "../../services/workerService";
import AnimatedNumber from "../../utilities/AnimatedNumber";

interface Transaction {
  transactionId: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description?: string;
  createdAt: string;
}

interface WalletPageProps {
  balancePrev?: number;
  historyPrev?: Transaction[];
  workerId: string;
  reload?: boolean;
}

const Wallet = ({ balancePrev, historyPrev, workerId, reload }: WalletPageProps) => {
  const [balance, setBalance] = useState<number>(balancePrev as number ?? 0);
  const [history, setHistory] = useState<Transaction[]>(historyPrev as Transaction[] ?? []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const loadWallet = async () => {
      try {
        if (!workerId) throw new Error("WorkerID not get");
        const res = await fetchWallet(workerId);
        const wallet = res.wallet;
        console.log("wallet :", wallet)
        setBalance(wallet.balance || 0);
        setHistory(wallet.transactions || []);
      } catch (err) {
        console.error("Failed to fetch wallet:", err);
      }
    };
    loadWallet();
  }, [workerId, reload, balancePrev]);

  const totalPages = Math.ceil(history.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = Array.isArray(history) ? history?.slice(startIndex, startIndex + itemsPerPage) : [];

  return (
    <div className="bg-gray-50 flex flex-col items-center p-2 sm:p-3 md:p-4 min-h-[400px] animate-fadeInScale">
      <main className="w-full max-w-4xl">

        {/* Wallet Card */}
        <div className="rounded-lg flex flex-col items-center animate-fadeInUp">
          <div className="bg-gradient-to-r from-green-700 to-blue-900 text-white rounded-xl p-3 sm:p-4 md:p-5 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-[120px] sm:h-[140px] md:h-[150px] flex justify-between items-center shadow-md">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                ₹<AnimatedNumber value={Number(balance?.toFixed(2))} />
              </div>
              <small className="text-xs sm:text-sm">**** **** **** 2757</small>
              <small className="text-xs sm:text-sm">09/25</small>
            </div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
              alt="Card"
              className="w-10 h-6 sm:w-12 sm:h-8 md:w-15 md:h-10"
            />
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 md:p-4 mt-4 sm:mt-6 animate-fadeInUp">
          <div className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">Recent Transactions</div>
          {history.length > 0 ? (
            <div className="border rounded flex flex-col h-auto min-h-[200px] sm:h-[230px] animate-fadeInUp">

              {/* Table Wrapper */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm md:text-base">
                  <thead className="sticky top-0 bg-[#8FC39D]">
                    <tr>
                      <th className="p-1 sm:p-2">Amount</th>
                      <th className="p-1 sm:p-2">Type</th>
                      <th className="p-1 sm:p-2 hidden sm:table-cell">Transaction ID</th>
                      <th className="p-1 sm:p-2">Date</th>
                      <th className="p-1 sm:p-2 hidden md:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((tx, i) => (
                      <tr
                        key={tx.transactionId}
                        className="border-b border-gray-300 hover:bg-gray-50 animate-fadeInUp"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <td className={`p-1 sm:p-2 font-bold ${tx.type === "CREDIT" ? "text-green-600" : "text-red-600"}`}>
                          ₹{tx.amount.toFixed(2)}
                        </td>
                        <td className="p-1 sm:p-2">{tx.type}</td>
                        <td className="p-1 sm:p-2 hidden sm:table-cell break-words">{tx.transactionId?.slice(0, 15).toUpperCase()}</td>
                        <td className="p-1 sm:p-2 break-words">{new Date(tx.createdAt).toLocaleDateString("en-GB")}</td>
                        <td className="p-1 sm:p-2 hidden md:table-cell break-words">{tx.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination fixed at bottom */}
              <div className="flex justify-between items-center m-1 sm:m-2 bg-white text-xs sm:text-sm animate-fadeInUp">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-900 text-white hover:bg-green-600"}`}
                >
                  Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-900 text-white hover:bg-green-600"}`}
                >
                  Next
                </button>
              </div>

            </div>
          ) : (
            <div className="text-gray-500 text-xs sm:text-sm md:text-base text-center py-4 sm:py-6 animate-fadeInScale">
              Empty History
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Wallet;
