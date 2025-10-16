import React, { useState } from "react";
import { useFormik } from "formik";
import { X, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import { accountNumberRegex, ifcsCodeRegex } from "../../constant/regexs";

interface Props {
    closeModal: () => void;
    workerID: string | null;
    balance: number;
}

interface PayoutFormValues {
    accountNumber: string;
    accountName: string;
    ifscCode: string;
    amount: string;
    workerId: string | null;
}

const PayoutModal = ({ closeModal, workerID, balance }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);

    const formik = useFormik<PayoutFormValues>({
        initialValues: {
            accountNumber: "",
            accountName: "",
            ifscCode: "",
            amount: "",
            workerId: workerID,
        },
        validate: (values) => {
            const errors: Partial<PayoutFormValues> = {};

            if (currentPage === 1) {
                // Page 1 validations
                if (!values.accountNumber.trim()) {
                    errors.accountNumber = "Account number is required";
                } else if (!accountNumberRegex.test(values.accountNumber)) {
                    errors.accountNumber = "Account number must contain only digits";
                } else if (values.accountNumber.length < 9) {
                    errors.accountNumber = "Account number must be at least 9 digits";
                } else if (values.accountNumber.length > 18) {
                    errors.accountNumber = "Account number must not exceed 18 digits";
                }

                if (!values.accountName.trim()) {
                    errors.accountName = "Account name is required";
                } else if (values.accountName.length < 2) {
                    errors.accountName = "Account name must be at least 2 characters";
                } else if (values.accountName.length > 100) {
                    errors.accountName = "Account name must not exceed 100 characters";
                }

                if (!values.ifscCode.trim()) {
                    errors.ifscCode = "IFSC code is required";
                } else if (!ifcsCodeRegex.test(values.ifscCode)) {
                    errors.ifscCode = "Invalid IFSC code format";
                }

            }

            if (currentPage === 2) {
                // Page 2 validations
                const amt = Number(values.amount);
                if (!values.amount) {
                    errors.amount = "Amount is required";
                } else if (isNaN(amt) || amt <= 0) {
                    errors.amount = "Amount must be positive";
                } else if (amt < 1) {
                    errors.amount = "Minimum amount is ₹1";
                } else if (amt > 1000000) {
                    errors.amount = "Maximum amount is ₹10,00,000";
                }
                if (balance < Number(values.amount)) {
                    errors.amount = `Insufficient balance. Your current balance is ₹${balance}.`;
                }
            }

            return errors;
        },
        onSubmit: async (values) => {
            await axios.post('/rzp/payout/worker', values);
            toast.success("Payout successfull");
            formik.resetForm();
            setCurrentPage(1);
            closeModal()
        },
    });

    const handleNext = async () => {
        const errors = await formik.validateForm();
        const page1Fields = ["accountNumber", "accountName", "ifscCode"];
        const page1Errors = page1Fields.filter(
            (field) => errors[field as keyof PayoutFormValues]
        );

        if (page1Errors.length === 0) {
            setCurrentPage(2);
        } else {
            page1Fields.forEach((field) => formik.setFieldTouched(field, true));
        }
    };

    const handleBack = () => {
        setCurrentPage(1);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        formik.handleSubmit();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600/90 to-blue-600/90 p-6 relative">     <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                    >
                        <X size={24} />
                    </button>
                        <h2 className="text-2xl font-bold text-white">Payout Details</h2>
                        <p className="text-white text-sm mt-1">Step {currentPage} of 2</p>
                    </div>

                    <div className="bg-gray-200 h-2">
                        <div
                            className="bg-green-700 h-2 transition-all duration-300"
                            style={{ width: `${(currentPage / 2) * 100}%` }}
                        />
                    </div>

                    <div className="p-6">
                        {currentPage === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        value={formik.values.accountNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${formik.touched.accountNumber &&
                                            formik.errors.accountNumber
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="Enter account number"
                                    />
                                    {formik.touched.accountNumber &&
                                        formik.errors.accountNumber && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {formik.errors.accountNumber}
                                            </p>
                                        )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Account Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        name="accountName"
                                        value={formik.values.accountName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${formik.touched.accountName && formik.errors.accountName
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="Enter account holder name"
                                    />
                                    {formik.touched.accountName &&
                                        formik.errors.accountName && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {formik.errors.accountName}
                                            </p>
                                        )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        IFSC Code
                                    </label>
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        value={formik.values.ifscCode}
                                        onChange={(e) =>
                                            formik.setFieldValue(
                                                "ifscCode",
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        onBlur={formik.handleBlur}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${formik.touched.ifscCode && formik.errors.ifscCode
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="e.g., SBIN0001234"
                                        maxLength={11}
                                    />
                                    {formik.touched.ifscCode && formik.errors.ifscCode && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formik.errors.ifscCode}
                                        </p>
                                    )}
                                    <p className="text-gray-500 text-xs mt-1">
                                        Format: 4 letters, 0, 6 alphanumeric
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-2 flex items-center justify-center gap-2"
                                >
                                    Next
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {currentPage === 2 && (
                            <div className="space-y-6">
                                <div className="bg-indigo-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Account Number:</span>
                                        <span className="font-semibold text-gray-800">
                                            {formik.values.accountNumber}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Account Name:</span>
                                        <span className="font-semibold text-gray-800">
                                            {formik.values.accountName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">IFSC Code:</span>
                                        <span className="font-semibold text-gray-800">
                                            {formik.values.ifscCode}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payout Amount (₹)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-lg font-semibold ${formik.touched.amount && formik.errors.amount
                                                ? "border-red-500"
                                                : "border-gray-300"
                                                }`}
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                    {formik.touched.amount && formik.errors.amount && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formik.errors.amount}
                                        </p>
                                    )}
                                    <p className="text-gray-500 text-xs mt-1">
                                        Min: ₹1 | Max: ₹10,00,000
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft size={20} />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={20} />
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayoutModal;
