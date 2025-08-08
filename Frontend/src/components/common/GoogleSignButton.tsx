// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { GoogleLogin } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";
// import axios from "../../services/axios";
// import { toast } from "react-toastify";

// export default function GoogleLoginButton() {
//   const navigate = useNavigate();

//   const handleSuccess = async (credentialResponse: any) => {
//     try {
//       const res = await axios.post("/users/google-login", {
//         token: credentialResponse.credential,
//       });

//       console.log(res)

//       if (res.data.data.result) {
//         const token = res.data.data.result.token;
//         const user = res.data.data.result.user;

//         // dispatch(login({ 
//         //   token: res.data.token, 
//         //   user: res.data.user 
//         // }));

//         // ✅ Store in localStorage for persistence
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));

//         toast.success("Login successful");
//         navigate("/home");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Google Sign-In failed");
//     }
//   };

//   return (
//     <GoogleLogin 
//       onSuccess={handleSuccess} 
//       onError={() => toast.error("Google Login Failed")} 
//     />
//   );
// }
