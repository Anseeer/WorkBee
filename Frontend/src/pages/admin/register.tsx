import { useState } from "react";
import { toast } from "react-toastify";
import { emailRegex, passRegex, phoneRegex } from "../../regexs";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { registerAdminThunk } from "../../slice/adminSlice";
import type { AxiosError } from "axios";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";

const AdminRegistrationPage = () => {
    const Dispatch = useAppDispatch();
    const [Loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const res = await Dispatch(registerAdminThunk(values)).unwrap();
                toast.success("Registration successful!");
                localStorage.setItem("adminToken", res.token);
                navigate("/admins/dashboard", { replace: true });
            } catch (error: unknown) {
                const err = error as AxiosError<{ data: string }>;
                if (err.response?.data?.data) {
                    toast.error(err.response.data.data);
                } else {
                    toast.error("Registration failed");
                }
            } finally {
                setLoading(false);
            }
        },
        validate: (values) => {
            const errors: { name?: string; email?: string; phone?: string; password?: string } = {};

            if (!values.name) errors.name = "Name is required";
            if (!values.email) {
                errors.email = "Email is required";
            } else if (!emailRegex.test(values.email)) {
                errors.email = "Invalid email format";
            }
            if (!values.phone) {
                errors.phone = "Phone number is required";
            } else if (!phoneRegex.test(values.phone)) {
                errors.phone = "Invalid phone number";
            }
            if (!values.password) {
                errors.password = "Password is required";
            } else if (!passRegex.test(values.password)) {
                errors.password = "Invalid password format";
            }

            return errors;
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 w-full">
            <div className="absolute top-8 left-8">
                <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
            </div>

            <div className="flex items-center justify-center mt-16">
                <div className="w-full max-w-xl">
                    <div className="bg-white rounded-3xl border-2 border-green-600 p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
                            Create your admin account
                        </h2>

                        <input type="text" name="fakeuser" autoComplete="username" className="hidden" />
                        <input type="password" name="fakepass" autoComplete="new-password" className="hidden" />

                        <form onSubmit={formik.handleSubmit} autoComplete="off" className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <div className="h-5">
                                        {formik.touched.name && formik.errors.name && (
                                            <span className="text-sm text-red-500">{formik.errors.name}</span>
                                        )}
                                    </div>
                                    <input
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        name="name"
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Username"
                                        className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                    />
                                </div>

                                <div>
                                    <div className="h-5">
                                        {formik.touched.email && formik.errors.email && (
                                            <span className="text-sm text-red-500">{formik.errors.email}</span>
                                        )}
                                    </div>
                                    <input
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        name="email"
                                        type="email"
                                        autoComplete="new-email"
                                        placeholder="Email"
                                        className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <div className="h-5">
                                        {formik.touched.phone && formik.errors.phone && (
                                            <span className="text-sm text-red-500">{formik.errors.phone}</span>
                                        )}
                                    </div>
                                    <input
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        name="phone"
                                        type="tel"
                                        autoComplete="off"
                                        placeholder="Phone"
                                        className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="h-5">
                                        {formik.touched.password && formik.errors.password && (
                                            <span className="text-sm text-red-500">{formik.errors.password}</span>
                                        )}
                                    </div>
                                    <input
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Password"
                                        className="w-full pr-10 px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 bottom-2 text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {formik.touched.password && (
                                            showPassword ? <EyeOff size={20} /> : <Eye size={20} />
                                        )}

                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={Loading}
                                    className="w-full bg-green-900 h-10 hover:bg-green-600 text-white font-semibold rounded-full transition-colors duration-200"
                                >
                                    {Loading ? `Signing...` : `Sign up`}
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{" "}
                                    <span
                                        onClick={() => navigate("/admins/login")}
                                        className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                                    >
                                        Sign in
                                    </span>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistrationPage;
