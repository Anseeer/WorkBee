import { useReducer, useState } from "react";
import type { Action } from "../../types/ActionTypes"
import { toast } from "react-toastify";
import { emailRegex, passRegex, phoneRegex } from "../../regexs";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { registerAdminThunk } from "../../slice/adminSlice";
import type { AxiosError } from "axios";


interface IState {
    name: string;
    email: string;
    phone: string;
    password: string;
}

const initialState: IState = {
    name: "",
    email: "",
    phone: "",
    password: "",
};

function reducer(state: IState, action: Action): IState {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.payload };
        case "SET_EMAIL":
            return { ...state, email: action.payload };
        case "SET_PHONE":
            return { ...state, phone: action.payload };
        case "SET_PASS":
            return { ...state, password: action.payload };
        default:
            return state;
    }
}


const AdminRegistrationPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const Dispatch = useAppDispatch();
    const [Loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!state.name?.trim() || !state.email?.trim() || !state.phone?.trim() || !state.password?.trim()) {
            toast.error("All fields are required");
            return;
        }

        if (!emailRegex.test(state.email)) {
            toast.error("Invalid email format");
            return;
        }

        if (!passRegex.test(state.password)) {
            toast.error("Password must be at least 6 characters long and include letters, numbers, and symbols like _ . @");
            return;
        }

        if (!phoneRegex.test(state.phone)) {
            toast.error("Invalid phone number");
            return;
        }

        setLoading(true);
        try {
            const res = await Dispatch(registerAdminThunk(state)).unwrap()
            toast.success("Registration successful!");
            localStorage.setItem('adminToken', res.token);
            navigate('/admins/dashboard', { replace: true })
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

    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 fixed w-full">
            <div className="absolute top-7.5 left-7.5">
                <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
            </div>

            <div className="flex items-center justify-center m-25">
                <div className="w-full max-w-xl">
                    <div className="bg-white rounded-3xl border-2 min-h-[300px] border-green-600 p-6 shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
                            Create your admin account
                        </h2>

                        <form onSubmit={HandleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input
                                    value={state.name}
                                    onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
                                    name="name"
                                    type="text"
                                    placeholder="Username"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                                <input
                                    value={state.email}
                                    onChange={(e) => dispatch({ type: "SET_EMAIL", payload: e.target.value })}
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <input
                                    value={state.phone}
                                    onChange={(e) => dispatch({ type: "SET_PHONE", payload: e.target.value })}
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                                <input
                                    value={state.password}
                                    onChange={(e) => dispatch({ type: "SET_PASS", payload: e.target.value })}
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
                                />
                            </div>


                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-green-900 h-[30px] hover:bg-green-600 text-white font-semibold py-3 pt-1 px-4 rounded-full transition-colors duration-200"
                                >
                                    {Loading ? `Signing...` : `Sign up`}
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-gray-600 text-sm">
                                    Already have an account?{" "}
                                    <span onClick={() => navigate("/admins/login")} className="text-green-600 hover:text-green-700 font-medium cursor-pointer">
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
