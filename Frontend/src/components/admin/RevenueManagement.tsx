import { useEffect, useState } from 'react';
import { TrendingUp, CreditCard, Download, IndianRupee } from 'lucide-react';
import { fetchWallet } from '../../services/adminService';
import type { ITransactions } from '../../types/ITransaction';
import { DataTable, type Column } from '../common/Table';
import PayoutModal from '../common/PayoutForm';

const RevenueManagement = () => {
    const [payoutModal, setPayoutModal] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0);
    const [history, setHistory] = useState<ITransactions[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCommission, setCommission] = useState(0);
    const [totalPlatformFees, setPlatformFee] = useState(0);
    const [totalSubscriptionFees, setSubscription] = useState(0);
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchData = async () => {
            const walletRes = await fetchWallet();
            setBalance(walletRes.earnings.balance);
            setHistory(walletRes.earnings.transactions);
            console.log("WalletREs :", walletRes.earnings);
        };
        fetchData();
    }, [payoutModal]);

    useEffect(() => {
        const calculateTotals = (transactions: ITransactions[]) => {
            let totalCommission = 0;
            let totalPlatformFees = 0;
            let totalSubscriptionFees = 0;

            transactions.forEach(txn => {
                if (txn.type !== "CREDIT") return;

                const desc = txn.description?.toLowerCase() || "";

                if (desc.startsWith("commission")) {
                    totalCommission += txn.amount;
                } else if (desc.startsWith("platform")) {
                    totalPlatformFees += txn.amount;
                } else if (desc.startsWith("subscription")) {
                    totalSubscriptionFees += txn.amount;
                }
            });

            setCommission(totalCommission)
            setPlatformFee(totalPlatformFees)
            setSubscription(totalSubscriptionFees)

        };

        if (history.length > 0) calculateTotals(history);

    }, [history])



    // Pagination logic
    const totalPages = Math.ceil(history.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = history.slice(startIndex, startIndex + itemsPerPage);

    const handlePayoutModal = () => {
        setPayoutModal(true);
    };

    const closePayoutModal = () => {
        setPayoutModal(false)
    };

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const columns: Column<ITransactions>[] = [
        {
            key: 'amount',
            label: 'Amount',
            render: (txn: ITransactions) => (
                <span className={txn.type === "CREDIT" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    ₹{txn.amount.toFixed(2)}
                </span>
            )
        },
        { key: 'type', label: 'Type' },
        { key: 'description', label: 'Description' },
        { key: 'createdAt', label: 'Date', render: (u) => formatDate(u.createdAt) },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
                    <div className="relative bg-white rounded-lg shadow p-6">
                        <div className="absolute top-4 right-4 p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-4xl font-bold text-green-700 mb-1">₹{totalCommission.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total Commission</p>
                    </div>

                    <div className="relative bg-white rounded-lg shadow p-6">
                        <div className="absolute top-4 right-4 p-2 bg-purple-100 rounded-lg">
                            <IndianRupee className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-4xl font-bold text-green-700 mb-1">₹{totalPlatformFees.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Platform Fees</p>
                    </div>

                    <div className="relative bg-white rounded-lg shadow p-6">
                        <div className="absolute top-4 right-4 p-2 bg-orange-100 rounded-lg">
                            <IndianRupee className="w-6 h-6 text-orange-600" />
                        </div>
                        <p className="text-4xl font-bold text-green-700 mb-1">₹{totalSubscriptionFees.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Subscription Fees</p>
                    </div>
                </div>

                <div className=" relative bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-4 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <p className="text-4xl font-bold flex items-center gap-2">
                                <CreditCard className="w-8 h-8 text-white" />
                                <h2 className="text-xl font-semibold mb-2">Available for Payout</h2>
                            </p>
                            <p className="text-4xl font-bold">₹{balance.toLocaleString()}</p>
                            <p className="text-blue-200 text-sm mt-2">Minimum payout amount: ₹100</p>
                        </div>
                        <button
                            onClick={handlePayoutModal}
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Payout
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <DataTable
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    data={paginatedTransactions.map(txn => ({
                        ...txn,
                        id: txn.transactionId,
                    }))}
                    columns={columns as unknown as Column<{ id: string }>[]}
                    searchKeys={['type', 'id', 'description', 'createdAt', 'amount']}
                />

            </div>
            {payoutModal && <PayoutModal balance={balance} workerID={"PLATFORM"} closeModal={closePayoutModal} />}
        </div>

    );
};

export default RevenueManagement;
