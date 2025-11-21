/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X, Eye, EyeOff, Lock } from "lucide-react";
import { useFormik } from "formik";

interface ChangePasswordModalProps {
    onClose: () => void;
    onSave: (data: { currentPassword: string; newPassword: string }) => void;
}

const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@_.!#$%^&*?])[A-Za-z\d@_.!#$%^&*?]{6,}$/;

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    onClose,
    onSave,
}) => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validate: (values) => {
            const errors: any = {};

            if (!values.currentPassword.trim()) {
                errors.currentPassword = "Current password is required";
            }

            if (!values.newPassword.trim()) {
                errors.newPassword = "New password is required";
            } else if (!passRegex.test(values.newPassword)) {
                errors.newPassword = "Password must be at least 6 characters with a letter, number, and special character (@_.!#$%^&*?)";
            }

            if (!values.confirmPassword.trim()) {
                errors.confirmPassword = "Please confirm your password";
            } else if (values.newPassword !== values.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }

            if (values.currentPassword && values.newPassword && values.currentPassword === values.newPassword) {
                errors.newPassword = "New password must be different from current password";
            }

            return errors;
        },
        onSubmit: (values) => {
            onSave({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
        },
    });

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-3 rounded-t-xl flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Change Password
                    </h2>
                    <button
                        className="p-1.5 hover:bg-green-800 rounded-full transition-colors"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                name="currentPassword"
                                value={formik.values.currentPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter current password"
                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm ${formik.touched.currentPassword && formik.errors.currentPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {formik.touched.currentPassword && formik.errors.currentPassword && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter new password"
                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm ${formik.touched.newPassword && formik.errors.newPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {formik.touched.newPassword && formik.errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</p>
                        )}

                        {/* Password Requirements - Compact */}
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium mb-1">Requirements:</p>
                            <ul className="text-xs text-gray-600 space-y-0.5">
                                <li>• Min 6 characters</li>
                                <li>• At least one letter & number</li>
                                <li>• Special character (@_.!#$%^&*?)</li>
                            </ul>
                        </div>

                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Confirm new password"
                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm ${formik.touched.confirmPassword && formik.errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                        )}
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-1">
                        Forgot password? Log out and reset it from the login page.
                    </p>
                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                            <Lock className="w-4 h-4" />
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;