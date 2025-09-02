/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import axios from "../../services/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import { toast } from "react-toastify";

interface Props {
    onClose: () => void;
    Amount: number;
    workId: string;
}

const PaymentModal = ({ onClose, Amount, workId }: Props) => {

    const wallet = useSelector((state: RootState) => state.user.wallet);

    const handlePayment = async (amount: number) => {
        try {
            const { data } = await axios.post("rzp/create-order", { amount, workId });

            if (data?.error) {
                alert(data.error);
                return;
            }

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
                        razorpay_order_id: string;
                        razorpay_payment_id: string;
                        razorpay_signature: string;
                    }) {
                        try {
                            const res = await axios.post("/rzp/verify-payment", {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                workId,
                            });

                            if (res.data.success) {
                                toast.success("Payment successful!");
                                onClose();
                            } else {
                                toast.error(" Payment failed: " + res.data.message);
                            }
                        } catch (err: any) {
                            console.error("Payment verification failed:", err);
                            toast.error(" Payment failed: Already paid or invalid transaction");
                        }
                    },

                    prefill: {
                        name: "Ansi",
                        email: "ansi@example.com",
                        contact: "7736222757",
                    },
                    theme: { color: "#399e6f" },

                    modal: {
                        ondismiss: function () {
                            toast("Payment popup closed without completing.");
                        },
                    },
                };

                const rzp = new (window as any).Razorpay(options);

                rzp.on("payment.failed", function (response: any) {
                    toast.error("Payment failed: " + response.error.description);
                });

                rzp.open();
            };
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error("Something went wrong. Please try again later.");
            }
        }
    };


    const formik = useFormik({
        initialValues: {
            amount: Amount,
        },
        validate: (values) => {
            const errors: { amount?: string } = {};
            if (!values.amount) {
                errors.amount = "Amount is required";
            } else if (values.amount < Amount) {
                errors.amount = `Amount should be greater than or equal to ₹${Amount}`;
            } else if (Amount > (wallet?.balance ?? 0)) {
                errors.amount = `Insufficient balance. Your wallet balance is ₹${wallet?.balance ?? 0}`;
            }

            return errors;
        },
        onSubmit: (values) => {
            handlePayment(values.amount);
        },
    });

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white border-2 border-green-700 rounded-lg shadow-lg p-6 w-96 relative animate-fadeIn"
            >
                {/* Close Icon */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    ✖
                </button>

                {/* Title */}
                <h2 className="text-lg font-semibold mb-2 text-center">Complete Your Payment</h2>

                {/* Comfort Message */}
                <p className="text-sm text-gray-600 mb-4 text-center">
                    Please enter the amount based on the service.
                    We ensure your payment is safe & secure.
                </p>

                {/* Input */}
                <input
                    type="number"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter amount"
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700 mb-2 ${formik.touched.amount && formik.errors.amount
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                />

                {/* Error Message */}
                {formik.touched.amount && formik.errors.amount && (
                    <p className="text-red-500 text-sm mb-4">{formik.errors.amount}</p>
                )}

                {/* Pay Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-6 py-2 rounded bg-green-700 text-white hover:bg-green-500 transition-all duration-300"
                    >
                        Pay Now
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentModal;
