// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";


// interface LoginFormProps {


//   onSubmit: (credentials: { email: string; password: string }) => void;
//   loading?: boolean;
//   role?: "user" | "admin" | "worker";
// }

// const LoginForm = ({ onSubmit, loading = false, role }: LoginFormProps) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate()

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Email and password are required");
//       return;
//     }

//     if (!/^\S+@\S+\.\S+$/.test(email)) {
//       toast.error("Invalid email format");
//       return;
//     }

//     if (password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     const credentials = { email, password };
//     onSubmit(credentials);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="absolute top-7.5 left-7.5">
//           <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
//         </div>

//         <div className="bg-white rounded-3xl border-2 border-green-600 p-8 shadow-md">
//           <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
//             Glad to see you again!
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="email"
//               className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none"
//             />

//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="password"
//               className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none"
//             />

//             <button
//               type="submit"
//               className="w-full bg-green-900 hover:bg-green-600 text-white h-8 font-medium py-1 px-6 rounded-lg transition-colors duration-200"
//             >
//               {loading ? "Logging in..." : "Log in"}
//             </button>
//           </form>

//           {/* Links */}
//           <div className="pt-6 space-y-2">
//             <div className="flex items-center text-sm">
//               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
//               <span className="text-gray-600">Forgot</span>
//               <span
//                 onClick={() => role == "user" ? navigate("/forgot-password") : role == "worker" ? navigate("/workers/forgot-password") : role == "admin" ? navigate("/admins/forgot-password") : null}
//                 className="text-green-600 hover:text-green-700 underline ml-1 cursor-pointer"
//               >
//                 Password?
//               </span>
//             </div>
//             <div className="flex items-center text-sm">
//               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
//               <span className="text-gray-600">Don't have an account?</span>
//               <span
//                 onClick={() => role == "user" ? navigate("/register") : role == "worker" ? navigate("/workers/register") : role == "admin" ? navigate("/admins/register") : null}
//                 className="text-green-600 hover:text-green-700 underline ml-1 cursor-pointer"
//               >
//                 Sign up
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { emailRegex, passRegex } from "../regexs";

interface LoginFormProps {
  Submit: (credentials: { email: string; password: string }) => void;
  loading?: boolean;
  role?: "user" | "admin" | "worker";
}

const LoginForm = ({ Submit, loading = false, role }: LoginFormProps) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values)
      Submit(values);
    },
    validate: (values) => {
      const errors: { email?: string; password?: string } = {};

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(values.email)) {
        errors.email = "Invalid email format";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (!passRegex.test(values.password)) {
        errors.password = "Invalid password format";
      }

      return errors;
    },
  });

  const handleForgotPassword = () => {
    if (role === "user") navigate("/forgot-password");
    else if (role === "worker") navigate("/workers/forgot-password");
    else if (role === "admin") navigate("/admins/forgot-password");
  };

  const handleRegister = () => {
    if (role === "user") navigate("/register");
    else if (role === "worker") navigate("/workers/register");
    else if (role === "admin") navigate("/admins/register");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-8 left-8">
          <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
        </div>

        <div className="bg-white rounded-3xl border-2 border-green-600 p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Glad to see you again!
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              {formik.touched.email && formik.errors.email && (
                <span className="text-sm text-red-500 mt-1">{formik.errors.email}</span>
              )}
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              {formik.touched.password && formik.errors.password && (
                <span className="text-sm text-red-500 mt-1">{formik.errors.password}</span>
              )}
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900 hover:bg-green-600 text-white h-10 font-medium py-1 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Links */}
          <div className="pt-6 space-y-2">
            <div className="flex items-center text-sm">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
              <span className="text-gray-600">Forgot</span>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-green-600 hover:text-green-700 underline ml-1 cursor-pointer bg-transparent border-none"
              >
                Password?
              </button>
            </div>

            <div className="flex items-center text-sm">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
              <span className="text-gray-600">Don't have an account?</span>
              <button
                type="button"
                onClick={handleRegister}
                className="text-green-600 hover:text-green-700 underline ml-1 cursor-pointer bg-transparent border-none"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
