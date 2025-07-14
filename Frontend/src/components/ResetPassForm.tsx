import { useState } from "react";
import { toast } from "react-toastify";

interface ResetPasswordFormProps {
  onSubmit: (passwordData: { email: string; password: string }) => void;
  role?: "user" | "admin" | "worker";
}

const ResetPasswordForm = ({ onSubmit, role = "user" }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please Enter Password");
      return;
    }

    if (!confirmPass.trim()) {
      toast.error("Please Enter Confirm Password");
      return;
    }

    if (password.length < 6 || confirmPass.length < 6) {
      toast.error("At least 6 characters required");
      return;
    }

    if (password !== confirmPass) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    const email = localStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Email not found. Please restart the process.");
      return;
    }

    const passwordData = { email, password };
    onSubmit(passwordData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-7.5 left-7.5">
          <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
        </div>

        <div className="bg-white rounded-3xl border-2 border-green-600 p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Set a new password for your account.
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full bg-green-900 hover:bg-green-600 text-white h-10 font-medium rounded-lg transition-colors duration-200"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
