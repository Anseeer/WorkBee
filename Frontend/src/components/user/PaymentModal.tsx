/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import axios from "../../services/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import { toast } from "react-toastify";

interface Props {
    onClose: () => void;
    setRatingModal: (arg: boolean) => void;
    wagePerHour: number;
    hoursWorked: number;
    platformFee: number;
    workId: string;
}

const PaymentModal = ({
    onClose,
    wagePerHour,
    hoursWorked,
    platformFee,
    workId,
    setRatingModal
}: Props) => {

    const wallet = useSelector((state: RootState) => state.user.wallet);
    const subtotal = wagePerHour * hoursWorked;
    const totalAmount = subtotal + platformFee;

    const handleRazorpayPayment = async (amount: number, paymentMethod: string) => {
        try {
            const { data } = await axios.post("rzp/create-order", {
                amount,
                workId,
                platformFee,
                paymentMethod
            });

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount,
                    currency: data.currency,
                    name: "WorkBee",
                    description: "Service Payment",
                    order_id: data.id,
                    handler: async function (response: { razorpay_order_id: any; razorpay_payment_id: any; razorpay_signature: any; }) {
                        try {
                            await axios.post("/rzp/verify-payment", {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                workId
                            });

                            onClose();
                            setRatingModal(true);
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        } catch (err) {
                            toast.error("Payment verification failed!");
                        }
                    },
                    modal: {
                        ondismiss: async () => {
                            try {
                                await axios.delete(`/rzp/cancel-payment?workId=${workId}`);
                                toast.success("Cancelled !")
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            } catch (err) {
                                console.error("Cancel update failed");
                            }
                        }
                    },
                    prefill: {
                        name: "Ansi",
                        email: "ansi@example.com",
                        contact: "7736222757",
                    },
                    theme: { color: "#399e6f" },
                };

                new (window as any).Razorpay(options).open();
            };

        } catch (err: any) {
            console.error("Payment Error:", err);

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Payment failed. Please try again.";

            toast.error(message);
        }
    };

    const handleWalletPayment = async (amount: number) => {
        try {
            await axios.post("rzp/pay-with-wallet", {
                amount,
                workId,
                platformFee
            });
            toast.success("Wallet payment successfull")
            onClose()
            setRatingModal(true);
        } catch (err: any) {
            console.error(err);

            const message = err?.response?.data?.message || "Wallet payment failed!";
            toast.error(message);
        }
    };

    const formik = useFormik({
        initialValues: {
            amount: totalAmount,
            paymentMethod: "",
        },
        validate: (values) => {
            const errors: any = {};

            if (values.amount !== totalAmount) {
                errors.amount = `Amount should be ₹${totalAmount}`;
            }

            if (!values.paymentMethod) {
                errors.paymentMethod = `Select paymentMethod`;
            }

            if (totalAmount > (wallet?.balance ?? 0) && values.paymentMethod == "wallet") {
                errors.amount = `Insufficient balance. Wallet balance: ₹${wallet?.balance ?? 0}`;
            }

            return errors;
        },
        onSubmit: (values) => {
            if (values.paymentMethod == "wallet") {
                handleWalletPayment(values.amount)
            } else {
                handleRazorpayPayment(values.amount, values.paymentMethod);
            }
        }
    });

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white border-2 border-green-700 rounded-lg shadow-lg p-5 w-full max-w-sm relative"
            >
                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-700"
                >
                    ✕
                </button>

                {/* Header */}
                <h2 className="text-lg font-semibold text-center mb-1">
                    Complete Your Payment
                </h2>

                <p className="text-xs text-gray-600 text-center mb-3">
                    Review your service summary before you pay.
                </p>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg border p-4 mb-4 text-sm space-y-2">
                    <div className="flex justify-between">
                        <span>Wage Per Hour</span>
                        <span className="font-semibold">₹{wagePerHour}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Hours Worked</span>
                        <span className="font-semibold">{hoursWorked} hrs</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold">₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Platform Fee</span>
                        <span className="font-semibold text-blue-700">+ ₹{platformFee}</span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-base">
                        <span className="font-semibold">Total Amount</span>
                        <span className="font-bold text-green-700">₹{totalAmount}</span>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2">Choose Payment Method</h3>

                    <div className="space-y-3">

                        {/* Razorpay Option */}
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-green-600 transition">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="razorpay"
                                onChange={formik.handleChange}
                                className="w-4 h-4 accent-green-700"
                            />
                            <div className="flex items-center justify-between w-full">
                                <span className="font-medium">Pay with Razorpay</span>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
                                    alt="Razorpay"
                                    className="h-4"
                                />
                            </div>
                        </label>

                        {/* Wallet Option */}
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-green-600 transition">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="wallet"
                                onChange={formik.handleChange}
                                className="w-4 h-4 accent-green-700"
                            />
                            <div className="flex items-center justify-between w-full">
                                <span className="font-medium">Pay using Wallet</span>
                                <span className="text-xs text-gray-500">(Instant Payment)</span>
                            </div>
                        </label>

                    </div>

                    {formik.errors.paymentMethod && (
                        <p className="text-xs text-red-600 mt-1">{formik.errors.paymentMethod}</p>
                    )}
                </div>

                {/* Pay Button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-green-700 text-white rounded-md font-medium hover:bg-green-600 transition"
                >
                    Pay Now
                </button>

                {/* Error */}
                {formik.errors.amount && (
                    <span className="font-semibold text-red-800 block mt-1 text-center">
                        {formik.errors.amount}
                    </span>
                )}
            </form>
        </div>
    );

};

export default PaymentModal;
