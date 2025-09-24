import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withdrawMoney } from '../../services/workerService';

interface BankFormValues {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    withdrawAmount: number | string;
}

interface BankFormProps {
    closeModal: () => void;
}

const BankForm: React.FC<BankFormProps> = ({ closeModal }) => {
    const initialValues: BankFormValues = {
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        withdrawAmount: '',
    };

    const validate = (values: BankFormValues) => {
        const errors: Partial<BankFormValues> = {};

        if (!values.accountHolderName) {
            errors.accountHolderName = 'Account Holder Name is required';
        } else if (values.accountHolderName.length < 2) {
            errors.accountHolderName = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]*$/.test(values.accountHolderName)) {
            errors.accountHolderName = 'Name can only contain letters and spaces';
        }

        if (!values.accountNumber) {
            errors.accountNumber = 'Account Number is required';
        } else if (!/^\d{9,18}$/.test(values.accountNumber)) {
            errors.accountNumber = 'Account Number must be between 9 and 18 digits';
        }

        if (!values.ifscCode) {
            errors.ifscCode = 'IFSC Code is required';
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(values.ifscCode)) {
            errors.ifscCode = 'Invalid IFSC Code format (e.g., SBIN0001234)';
        }

        const withdrawAmountStr = String(values.withdrawAmount).trim();
        const withdrawAmount = Number(withdrawAmountStr);

        if (!withdrawAmountStr) {
            errors.withdrawAmount = 'Withdraw Amount is required';
        } else if (isNaN(withdrawAmount)) {
            errors.withdrawAmount = 'Withdraw Amount must be a valid number';
        } else if (withdrawAmount < 100) {
            errors.withdrawAmount = 'Minimum withdrawal amount is 100';
        } else if (withdrawAmount > 100000) {
            errors.withdrawAmount = 'Maximum withdrawal amount is 100,000';
        }

        return errors;
    };

    const handleSubmit = async (values: BankFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        const submissionValues = {
            ...values,
            withdrawAmount: Number(values.withdrawAmount),
        };
        try {
            await withdrawMoney(submissionValues);
            setSubmitting(false);
            closeModal();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex  items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeModal}>
            <div
                className="relative max-w-md border border-dotted border-2 border-green-900 w-full mx-4 p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={closeModal}
                    aria-label="Close modal"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Bank Withdrawal Form</h2>
                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {/* Account Holder Name */}
                            <div>
                                <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                                    Account Holder Name
                                </label>
                                <Field
                                    type="text"
                                    name="accountHolderName"
                                    id="accountHolderName"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Enter account holder name"
                                />
                                <ErrorMessage
                                    name="accountHolderName"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Account Number */}
                            <div>
                                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                                    Account Number
                                </label>
                                <Field
                                    type="text"
                                    name="accountNumber"
                                    id="accountNumber"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Enter account number"
                                />
                                <ErrorMessage
                                    name="accountNumber"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* IFSC Code */}
                            <div>
                                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                                    IFSC Code
                                </label>
                                <Field
                                    type="text"
                                    name="ifscCode"
                                    id="ifscCode"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="e.g., SBIN0001234"
                                />
                                <ErrorMessage
                                    name="ifscCode"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Withdraw Amount */}
                            <div>
                                <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700">
                                    Withdraw Amount (₹)
                                </label>
                                <Field
                                    type="number"
                                    name="withdrawAmount"
                                    id="withdrawAmount"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Enter amount"
                                />
                                <ErrorMessage
                                    name="withdrawAmount"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default BankForm;