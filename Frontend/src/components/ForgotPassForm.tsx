import { useState } from "react";

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  role?: "user" | "admin" | "worker"; 
}

const ForgotPasswordForm = ({ onSubmit, role = "user" }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Email is required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Invalid email format");
      return;
    }

    onSubmit(email);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="absolute top-8 left-8">
          <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
        </div>
      <div className="bg-white rounded-3xl border-2 w-[500px] h-[300px] border-green-600 p-6 shadow-md relative">

        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6 pt-6">
          Enter your email to reset it.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10 py-4 px-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            className="w-full bg-green-900 py-1 mt-7 text-white font-semibold rounded-full"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
