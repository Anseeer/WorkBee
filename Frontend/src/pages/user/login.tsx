import { useState } from "react";
import {toast} from "react-toastify"
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { loginUserThunk } from "../../slice/userSlice";
import { useNavigate } from "react-router-dom";


const LoginPage = ()=>{
    const Dispatch = useAppDispatch();
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [loading,setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
      if (!email||!password) {
        toast.error("name and password are required");
        return;
      }
    
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error("Invalid email format");
        return;
      }
    
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    
    
      setLoading(true);
      const credentials = {email,password}
      try {
        let res = await Dispatch(loginUserThunk(credentials)).unwrap()
        toast.success("Registration successful!");
        localStorage.setItem('userToken',res.token);
        navigate('/dashboard', { replace: true })
      } catch (error: any) {
        console.log("Error response :",error)
        toast.error(error|| "Registration failed");
      } finally {
        setLoading(false);
      }
        
      };


    return(
         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-7.5 left-7.5">
        <h1 className="merienda-text text-3xl text-green-900">
          WorkBee
        </h1>
      </div>

        <div className="bg-white rounded-3xl border-2 border-green-600 p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Glad to see you again!
          </h2>

          <div className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                placeholder="email"
                className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <div>
              <input
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                type="password"
                placeholder="password"
                className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <div className="pt-4">
              <button
                className="w-full bg-green-900 hover:bg-green-600 text-white h-8 font-medium py-1 px-6 rounded-lg transition-colors duration-200"
                onClick={onSubmit}
              >
                {loading?`Loging...`:`Log in`}
              </button>
            </div>

            {/* Links */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center text-sm">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-600">Forgot </span>
                <span onClick={()=> navigate('/forgot-password', { replace: true })} className="text-green-600 hover:text-green-700 underline ml-1 cursor-pointer">
                  Password ?
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                <span className="text-gray-600">Don't have an account ? </span>
                <span onClick={()=> navigate('/register', { replace: true })}  className="text-green-600 hover:text-green-700 underline ml-1 cursor-pointer">
                  Sign up
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default LoginPage;