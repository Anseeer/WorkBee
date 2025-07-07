import { useReducer, useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { registerUserThunk } from "../../slice/userSlice";
import { useNavigate } from "react-router-dom";


interface IState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  location:{
    address: string;
    pincode: string;
    lat: number | null;
    lng: number | null;
  },
}

const initialState: IState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  location: {
    address: "",
    pincode: "",
    lat: null,
    lng: null,
  }
};

function reducer(state: IState, action: { type: string; payload: any }): IState {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PHONE":
      return { ...state, phone: action.payload };
    case "SET_LOCATION":
      return { 
        ...state, 
       location:{
        address:action.payload.address,
        pincode:action.payload.pincode,
        lat:action.payload.lat,
        lng:action.payload.lng,
       }
      };
    case "SET_PASS":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASS":
      return { ...state, confirmPassword: action.payload };
    default:
      return state;
  }
}

const RegistrationPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [loading,setLoading] = useState<boolean>(false);
  const Dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'IN' }, 
        fields: ['formatted_address', 'geometry', 'address_components', 'name']
      }
    );

 
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (!place || !place.geometry) {
        console.log('No place data available');
        return;
      }

      
      const addressComponents = place.address_components || [];
      let pincode = '';
      
      
      for (const component of addressComponents) {
        if (component.types.includes('postal_code')) {
          pincode = component.long_name;
          break;
        }
      }

      
      const lat = place.geometry.location?.lat();
      const lng = place.geometry.location?.lng();

      
      dispatch({
        type: "SET_LOCATION",
        payload: {
          lat: lat || null,
          lng: lng || null,
          pincode: pincode,
          address: place.formatted_address || ''
        }
      });
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  if (!state.name || !state.email || !state.phone || !state.password || !state.confirmPassword) {
    toast.error("All fields are required");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(state.email)) {
    toast.error("Invalid email format");
    return;
  }

  if (state.password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  if (state.password !== state.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  if (!state.location || !state.location.address || !state.location.pincode) {
    toast.error("Location is required");
    return;
  }

  if(state.phone.length < 10){
    toast.error('Invalid phone');
    return;
  }
  console.log("State :",state)

  setLoading(true);
  try {
    let res = await Dispatch(registerUserThunk(state)).unwrap()
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
  return (
    <div className="min-h-screen bg-gray-50 p-4 fixed w-full">
     
      <div className="absolute top-7.5 left-7.5">
        <h1 className="merienda-text text-3xl text-green-900">
          WorkBee
        </h1>
      </div>

     
      <div className="flex items-center justify-center m-25">
    <div className="w-full max-w-xl   ">
    <div className="bg-white rounded-3xl border-2 min-h-[400px] border-green-600 p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
        Let's get you started
      </h2>

      <div className="space-y-4">
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            value={state.name}
            onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
            type="text"
            placeholder="username"
            className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
          />
          <input
            value={state.location.address}
            onChange={(e) => dispatch({ type: "SET_LOCATION", payload: e.target.value })}
            type="text"
            ref={inputRef}
            placeholder="location"
            className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
          />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={state.email}
            onChange={(e) => dispatch({ type: "SET_EMAIL", payload: e.target.value })}
            type="email"
            placeholder="email"
            className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
          />
          <input
            value={state.phone}
            onChange={(e) => dispatch({ type: "SET_PHONE", payload: e.target.value })}
            type="tel"
            placeholder="phone"
            className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
          />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={state.password}
            onChange={(e) => dispatch({ type: "SET_PASS", payload: e.target.value })}
            type="password"
            placeholder="password"
            className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
          />
          <input
            value={state.confirmPassword}
            onChange={(e) => dispatch({ type: "SET_CONFIRM_PASS", payload: e.target.value })}
            type="password"
            placeholder="confirm password"
            className="w-full px-0 py-2 text-gray-600 placeholder-gray-400 border-0 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none bg-transparent"
          />
        </div>

       
        <div className="pt-4">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full bg-green-900 h-[30px] hover:bg-green-600 text-white  font-semibold py-3 pt-1 px-4 rounded-full transition-colors duration-200"
          >
              {loading ? "Signing..." : "Sign up"}
          </button>
        </div>

       
        <div className="text-center pt-2">
          <p className="text-gray-600 text-sm">
            Already have account?{" "}
            <span onClick={()=> navigate('/login', { replace: true })} className="text-green-600 hover:text-green-700 font-medium cursor-pointer">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default RegistrationPage;
