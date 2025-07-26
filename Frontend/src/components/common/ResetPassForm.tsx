import { useFormik } from "formik";
import { passRegex } from "../../regexs";

interface ResetPasswordFormProps {
  handleSubmit: (passwordData: { email: string; password: string }) => void;
  role?: "user" | "admin" | "worker";
}

const ResetPasswordForm = ({ handleSubmit, role = "user" }: ResetPasswordFormProps) => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPass: ""
    },
    onSubmit: () => {
      const email = localStorage.getItem("resetEmail");
      if (!email) return;
      const passwordData = { email, password: formik.values.password };
      handleSubmit(passwordData);
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {};

      if (!values.password) {
        errors.password = "Password is required";
      } else if (!passRegex.test(values.password)) {
        errors.password = "Invalid password";
      }

      if (!values.confirmPass) {
        errors.confirmPass = "Confirm password is required";
      } else if (values.confirmPass !== values.password) {
        errors.confirmPass = "Passwords do not match";
      }

      return errors;
    },
  });

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

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              {formik.touched.password && formik.errors.password && (
                <span className="text-sm text-red-500 ">{formik.errors.password}</span>
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              {formik.touched.confirmPass && formik.errors.confirmPass && (
                <span className="text-sm text-red-500">{formik.errors.confirmPass}</span>
              )}
              <input
                type="password"
                name="confirmPass"
                placeholder="Confirm Password"
                value={formik.values.confirmPass}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none"
              />
            </div>

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
