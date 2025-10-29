/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import axios from "../../services/axios";

interface Props {
    onClose: () => void;
    handleReload?: () => void;
    userId: string,
}

const AddMoneyModal = ({ onClose, userId }: Props) => {
    const handlePayment = async (amount: number) => {
        try {
            const { data } = await axios.post("rzp/create-wallet-order", { amount });

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: data.amount,
                    currency: data.currency,
                    name: "WorkBee Wallet",
                    description: "Wallet Top-Up",
                    order_id: data.id,
                    handler: async function (response: { razorpay_order_id: any; razorpay_payment_id: any; razorpay_signature: any; }) {
                        await axios.post(`/rzp/verify-wallet-payment?userId=${userId}`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount
                        })
                            .then((res) => {
                                onClose();
                                console.log("Wallet top-up success:", res);
                            })
                            .catch((err) => console.log("Verification error:", err));
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
            };
        } catch (err) {
            console.error("Payment init failed:", err);
        }
    };

    const formik = useFormik({
        initialValues: {
            amount: 100,
        },
        validate: (values) => {
            const errors: { amount?: string } = {};
            if (!values.amount) {
                errors.amount = "Amount is required";
            }
            return errors;
        },
        onSubmit: (values) => {
            handlePayment(values.amount);
        },
    });

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white border-2 border-green-700 rounded-lg shadow-lg p-4 sm:p-5 md:p-6 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] relative animate-fadeIn"
            >
                {/* Close Icon */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close add money modal"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-center">
                    Add Money to Wallet
                </h2>

                {/* Comfort Message */}
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4 text-center break-words">
                    Enter the amount you want to add to your wallet. Your transactions are secure.
                </p>

                {/* Input */}
                <input
                    type="number"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter amount"
                    className={`w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-700 mb-2 sm:mb-3 ${formik.touched.amount && formik.errors.amount
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                />

                {/* Error Message */}
                {formik.touched.amount && formik.errors.amount && (
                    <p className="text-red-500 text-xs sm:text-sm mb-2 sm:mb-3 break-words">{formik.errors.amount}</p>
                )}

                {/* Pay Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-4 sm:px-5 md:px-6 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded bg-green-700 text-white hover:bg-green-500 transition-all duration-300 w-full sm:w-auto"
                    >
                        Add Money
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMoneyModal;
