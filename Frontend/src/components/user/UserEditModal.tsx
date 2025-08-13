import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { Camera, Image, User, X } from "lucide-react";
import type { RootState } from "../../Store";
import { useEffect, useRef, useState } from "react";
import { uploadToCloud } from "../../utilities/uploadToCloud";
import { update } from "../../services/userService";
import { toast } from "react-toastify";

interface props {
  onClose: () => void;
  setEdit: (arg: boolean) => void;
}

export default function EditUserModal({ onClose, setEdit }: props) {
  const user = useSelector((state: RootState) => state.user.user);

  const locationRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    console.log(showDropdown);
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };
    loadGoogleMapsAPI();

    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showDropdown]);

  const initializeAutocomplete = () => {
    if (!locationRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(locationRef.current, {
      types: ["address"],
      componentRestrictions: { country: "IN" },
      fields: ["formatted_address", "geometry", "address_components", "name"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place || !place.geometry) return;

      const addressComponents = place.address_components || [];
      let pincode = "";

      for (const component of addressComponents) {
        if (component.types.includes("postal_code")) {
          pincode = component.long_name;
          break;
        }
      }

      const lat = place.geometry.location?.lat() || 0;
      const lng = place.geometry.location?.lng() || 0;

      formik.setFieldValue("location", {
        address: place.formatted_address || "",
        pincode,
        lat,
        lng,
      });
    });
  };

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      profileImage: user?.profileImage || "",
      location: {
        address: user?.location?.address || "",
        pincode: user?.location?.pincode || "",
        lat: user?.location?.lat ?? null,
        lng: user?.location?.lng ?? null
      }
    },
    validate: (values) => {
      const errors: {
        name?: string;
        phone?: string;
        location?: { address?: string };
        profileImage?: string;
      } = {};

      if (!values.name.trim()) {
        errors.name = "Full Name is required";
      }

      if (!values.phone.trim()) {
        errors.phone = "Phone is required";
      } else if (!/^[0-9]{10}$/.test(values.phone)) {
        errors.phone = "Enter a valid 10-digit phone number";
      }

      if (!values.location.address.trim()) {
        errors.location = { address: "Location is required" };
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        console.log(values);
        await update(values, user?.id as string);
        toast.success("Updated successfull")
        setEdit(true)
        onClose();
      } catch (error) {
        toast.error("Updated faild")
        console.log("Form Submitted error :", error);
      }
    }
  });

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh] border border-gray-200">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-1 bg-red-300 hover:bg-red-500 rounded-full"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> {user?.name}`s Information
            </h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg"
              />
              {formik.touched.name && formik.errors.name && (
                <span className="text-sm text-red-500">{formik.errors.name}</span>
              )}
            </div>

            {/* Phone + Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Phone"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <span className="text-sm text-red-500">{formik.errors.phone}</span>
                )}
              </div>
            </div>

            {/* Profile Image */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Image className="w-5 h-5 text-purple-600" /> Profile Image
              </h3>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer">
                {formik.values.profileImage ? (
                  <img
                    src={formik.values.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover mb-2"
                  />
                ) : (
                  <Camera className="w-8 h-8 mb-2 text-purple-500" />
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      const url = await uploadToCloud(file);
                      formik.setFieldValue("profileImage", url);
                    }
                  }}
                />
              </label>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                name="location"
                ref={locationRef}
                value={formik.values.location.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your address"
                className="w-full px-4 py-3 border rounded-lg"
              />
              {formik.touched.location?.address && formik.errors.location?.address && (
                <span className="text-sm text-red-500">{formik.errors.location.address}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-500 w-full transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
