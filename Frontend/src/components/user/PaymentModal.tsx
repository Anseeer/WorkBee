/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import axios from "../../services/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";

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

    // Calculations
    const subtotal = wagePerHour * hoursWorked;
    const totalAmount = subtotal + platformFee;

    const handlePayment = async (amount: number) => {
        try {
            const { data } = await axios.post("rzp/create-order", { amount, workId, platformFee });

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: amount,
                    currency: data.currency,
                    name: "WorkBee",
                    description: "Service Payment",
                    order_id: data.id,
                    handler: async function (response: { razorpay_order_id: any; razorpay_payment_id: any; razorpay_signature: any; }) {
                        await axios.post("/rzp/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            workId
                        })
                            .then((res) => {
                                onClose();
                                setRatingModal(true);
                                console.log(res);
                            })
                            .catch((err) => console.log(err))
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
            console.error(err);
        }
    };

    const formik = useFormik({
        initialValues: {
            amount: totalAmount
        },
        validate: (values) => {
            const errors: any = {};

            if (values.amount !== totalAmount) {
                errors.amount = `Amount should be ₹${totalAmount}`;
            }

            if (totalAmount > (wallet?.balance ?? 0)) {
                errors.amount = `Insufficient balance. Wallet balance: ₹${wallet?.balance ?? 0}`;
            }

            return errors;
        },
        onSubmit: (values) => {
            handlePayment(values.amount);
        }
    });

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white border-2 border-green-700 rounded-lg shadow-lg p-5 w-full max-w-sm relative"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-700"
                >
                    ✕
                </button>

                <h2 className="text-lg font-semibold text-center mb-1">
                    Complete Your Payment
                </h2>

                <p className="text-xs text-gray-600 text-center mb-3">
                    Review your service summary before you pay.
                </p>

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

                <button
                    type="submit"
                    className="w-full py-2 bg-green-700 text-white rounded-md font-medium hover:bg-green-600"
                >
                    Pay Now
                </button>
                {<span className="font-semibold align-center text-red-800">{formik.errors.amount}</span>}
            </form>
        </div>
    );
};

export default PaymentModal;
