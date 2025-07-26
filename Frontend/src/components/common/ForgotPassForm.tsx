import { useFormik } from "formik";
import { emailRegex } from "../../regexs";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="absolute top-8 left-8">
        <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
      </div>
      <div className="bg-white rounded-3xl border-2 w-[500px] h-[300px] border-green-600 p-6 shadow-md relative">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6 pt-6">
          Enter your email to reset it.
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-10 py-4 px-5">
          {formik.errors.email && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.email}</span>
          )}
          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
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
