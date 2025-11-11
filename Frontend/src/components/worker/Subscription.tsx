/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { ISubscription } from '../../types/ISubscription';
import { activateSubscriptionPlan, fetchSubscriptionPlans } from '../../services/workerService';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Store';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchWorkerDetails } from '../../slice/workerSlice';
import type { IWorker } from '../../types/IWorker';
import type { IWallet } from '../../types/IWallet';

interface PlanCardProps {
    title: string;
    price: number;
    commission: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
}

const PlanCard = ({
    title,
    price,
    commission,
    description,
    isSelected,
    onSelect,
}: PlanCardProps) => {
    return (
        <div
            onClick={onSelect}
            className={`bg-white border-2 ${isSelected ? 'border-green-800' : 'border-gray-300'
                } rounded-lg p-6 cursor-pointer transition-all hover:border-green-600`}
        >
            <div className="flex items-center mb-4">
                <div
                    className={`w-5 h-5 rounded-full border-2 ${isSelected
                        ? 'border-green-800 bg-white'
                        : 'border-gray-400 bg-white'
                        } flex items-center justify-center mr-2`}
                >
                    {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-green-800"></div>
                    )}
                </div>
                <span className="font-semibold text-gray-900">{title}</span>
            </div>

            <div className="mb-3">
                <span className="text-4xl font-bold text-gray-900">
                    {price == 0 ? `Freee ₹${price}` : `Just for ₹${price}`}
                </span>
            </div>

            <div className="mb-4">
                <span className="text-xl font-bold text-gray-900">
                    {` Commission ${commission}%`}
                </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
        </div>
    );
};

export const SubscriptionPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [plans, setPlan] = useState<ISubscription[]>([]);
    const [loading, setIsLoading] = useState(false);
    const [worker, setWorkerData] = useState<IWorker | null>(null);
    const [wallet, setWallet] = useState<IWallet | null>(null);
    const workerData = useSelector((state: RootState) => state.worker.worker);
    const walletData = useSelector((state: RootState) => state.worker.wallet);

    const dispatch = useAppDispatch();

    useEffect(() => {
        setWorkerData(workerData);
        setWallet(walletData);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const plans = await fetchSubscriptionPlans(1, 1000, true);
            setPlan(plans.subscription);
        }
        fetchData()
    }, [])

    const handlePayment = async (amount: number, onSuccess: () => void) => {
        try {
            const { data } = await axios.post("rzp/create-subscription-order", { amount });

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: data.amount,
                    currency: data.currency,
                    name: "WorkBee",
                    description: "Service Payment",
                    order_id: data.id,
                    handler: async function (response: {
                        razorpay_order_id: any;
                        razorpay_payment_id: any;
                        razorpay_signature: any;
                    }) {
                        try {
                            const res = await axios.post("/rzp/verify-subscription-payment", {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                workerId: worker?.id,
                                planId: selectedPlan,
                            });

                            if (res.data.success) {
                                onSuccess();
                            }

                            setIsLoading(false);
                        } catch (err) {
                            console.error("Payment verification failed:", err);
                            toast.error("Payment verification failed");
                        }
                    },
                    prefill: {
                        name: "Ansi",
                        email: "ansi@example.com",
                        contact: "7736222757",
                    },
                    theme: { color: "#399e6f" },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
                setIsLoading(false);
            };
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartReceiving = async () => {
        try {
            setIsLoading(true);
            if (!selectedPlan) {
                setIsLoading(false);
                return toast.error("Please select a plan");
            }

            const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);
            if (!selectedPlanData) throw new Error("Invalid plan");

            if (Number(selectedPlanData.amount) > 0) {
                if (wallet?.balance as number < Number(selectedPlanData.amount)) {
                    setIsLoading(false);
                    return toast.error("Insufficient wallet balance. Please add money to your wallet.");
                }
                await handlePayment(selectedPlanData.amount as number, async () => {
                    await dispatch(fetchWorkerDetails(worker?.id as string));
                    toast.success("Plan activated successfully!");
                    setIsLoading(false);
                });
            } else {
                await activateSubscriptionPlan(worker?.id as string, selectedPlan);
                await dispatch(fetchWorkerDetails(worker?.id as string));
                toast.success("Free plan activated successfully!");
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full p-8 border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Choose Your Subscription Plan
                    </h1>
                    <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                        Unlock your access to job requests and start earning. Select a plan that fits your goals — higher plans mean lower commission, more profit, and priority support.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            title={plan.planName}
                            price={plan.amount as number}
                            commission={plan.comission as string}
                            description={plan.description}
                            isSelected={selectedPlan === plan.id}
                            onSelect={() => setSelectedPlan(plan.id)}
                        />
                    ))}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleStartReceiving}
                        className="bg-green-800 hover:bg-green-900 text-white font-semibold px-12 py-3 rounded-lg transition-colors"
                    >
                        {loading ? 'Processing... ' : 'Start Receiving Jobs'}
                    </button>
                </div>
            </div>
        </div>
    );
};
