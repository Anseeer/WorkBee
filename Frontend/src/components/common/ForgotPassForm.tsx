import { useFormik } from "formik";
import { emailRegex } from "../../constant/regexs";

interface ForgotPasswordFormProps {
  Submit: (email: string) => void;
}

const ForgotPasswordForm = ({ Submit }: ForgotPasswordFormProps) => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: () => {
      Submit(formik.values.email);
    },
    validate: (values) => {
      const errors: { email?: string } = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(values.email)) {
        errors.email = "Invalid email";
      }
      return errors;
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8">
        <h1 className="merienda-text text-2xl sm:text-3xl text-green-900">WorkBee</h1>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border-2 border-green-600 shadow-md w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 md:p-8 relative">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center mb-6 pt-4 sm:pt-6">
          Enter your email to reset it.
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6 sm:space-y-8 py-2 sm:py-4 px-2 sm:px-5">
          {formik.errors.email && (
            <span className="text-red-500 text-sm sm:text-base mt-1 block">{formik.errors.email}</span>
          )}

          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Email"
            className="w-full px-2 py-2 sm:px-3 sm:py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent text-sm sm:text-base"
          />

          <button
            type="submit"
            className="w-full bg-green-900 py-2 sm:py-3 mt-4 sm:mt-6 text-white font-semibold rounded-full text-sm sm:text-base"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );

};

export default ForgotPasswordForm;
