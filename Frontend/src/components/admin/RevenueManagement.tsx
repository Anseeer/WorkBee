import { useEffect, useState } from 'react';
import { TrendingUp, CreditCard, Download, IndianRupee } from 'lucide-react';
import { fetchWallet } from '../../services/adminService';
import type { ITransactions } from '../../types/ITransaction';
import { DataTable, type Column } from '../common/Table';
import PayoutModal from '../common/PayoutForm';
import AnimatedNumber from '../../utilities/AnimatedNumber';

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
        <div className="min-h-screen bg-white p-6 animate-fadeIn">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
                    <div className="relative bg-white rounded-lg shadow p-6 transform hover:scale-[1.02] transition-all duration-300 animate-fadeInUp delay-75">
                        <div className="absolute top-4 right-4 p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-4xl font-bold text-green-700 mb-1">₹{<AnimatedNumber value={Number(totalCommission)} />}</p>
                        <p className="text-sm text-gray-600">Total Commission</p>
                    </div>

                    <div className="relative bg-white rounded-lg shadow p-6 transform hover:scale-[1.02] transition-all duration-300 animate-fadeInUp delay-100">
                        <div className="absolute top-4 right-4 p-2 bg-purple-100 rounded-lg">
                            <IndianRupee className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-4xl font-bold text-green-700 mb-1">₹{<AnimatedNumber value={Number(totalPlatformFees)} />}</p>
                        <p className="text-sm text-gray-600">Platform Fees</p>
                    </div>

                    <div className="relative bg-white rounded-lg shadow p-6 transform hover:scale-[1.02] transition-all duration-300 animate-fadeInUp delay-150">
                        <div className="absolute top-4 right-4 p-2 bg-orange-100 rounded-lg">
                            <IndianRupee className="w-6 h-6 text-orange-600" />
                        </div>
                        <p className="text-4xl font-bold text-green-700 mb-1">₹{<AnimatedNumber value={Number(totalSubscriptionFees)} />}</p>
                        <p className="text-sm text-gray-600">Subscription Fees</p>
                    </div>
                </div>

                {/* Available for Payout Card */}
                <div className="relative bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-6 text-white animate-fadeInUp delay-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-8 h-8 text-white" />
                                <h2 className="text-xl font-semibold">Available for Payout</h2>
                            </div>
                            <p className="text-4xl font-bold">₹{<AnimatedNumber value={Number(balance)} />}</p>
                            <p className="text-blue-200 text-sm">Minimum payout amount: ₹100</p>
                        </div>
                        <button
                            onClick={handlePayoutModal}
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.03]"
                        >
                            <Download className="w-5 h-5" />
                            Payout
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="animate-fadeInUp delay-300">
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
                        advancedFilterKeys={['amount', 'createdAt', 'type']}
                    />
                </div>
            </div>

            {/* Modal */}
            {payoutModal && (
                <div className="animate-fadeIn fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                    <PayoutModal
                        balance={balance}
                        workerID={"PLATFORM"}
                        closeModal={closePayoutModal}
                    />
                </div>
            )}
        </div>
    );

};

export default RevenueManagement;
