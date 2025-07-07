import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { resetPasswordUserThunk } from "../../slice/userSlice";
import { useNavigate } from "react-router-dom";

const ResetPassword = ()=>{
   const[password,setPassword] = useState<string>("")
   const[confirmPass,setConfirmPass] = useState<string>("")
   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();
    
    if(!password || password == " "){
        toast.error("Please Enter Password");
        return;
    }
    if(!confirmPass || confirmPass == " "){
        toast.error("Please Enter Confirm Password");
        return;
    }

    if(password.length < 6 || confirmPass.length < 6){
        toast.error("Atleast 6 charachters required");
        return;
    }

    if(password !== confirmPass){
        toast.error("Password Not Match To The Confirm Password");
        return;
    }

    try {
        let email = localStorage.getItem('resetEmail');
        if(!email){
            throw new Error("Email Not Found");
            return;
        }
        let resetData = {email,password};
        await dispatch(resetPasswordUserThunk(resetData)).unwrap()
        toast.success("Reset SuccessFully");
        navigate('/login', { replace: true })
    } catch (error:any) {
        toast.error(error.response.data.data);
    }

   }

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
            Set a new password for your account.
          </h2>

          <div className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="confirm password"
                value={confirmPass}
                onChange={(e)=> setConfirmPass(e.target.value)}
                className="w-full px-0 py-3 text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-green-500 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <div className="pt-4">
              <button
              onClick={handleSubmit}
                className="w-full bg-green-900 hover:bg-green-600 text-white h-8 font-medium py-1 px-6 rounded-lg transition-colors duration-200"
              >Reset
              </button>
            </div>

            {/* Links */}
            
          </div>
        </div>
      </div>
    </div>
    )
}

export default ResetPassword;