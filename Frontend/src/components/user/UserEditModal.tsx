import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { User,X } from "lucide-react";
import type { Iuser } from "../../types/IUser";
import type { RootState } from "../../Store";

export default function EditUserModal({ onClose }: { onClose: () => void }) {
  const user = useSelector((state: RootState) => state.user.user); 

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    //   profileImage: user.profileImage || "",
      location: user?.location?.address || "",
    },
    validate: (values) => {
      const errors: Iuser = {
          id: "",
          name: "",
          email: "",
          password: "",
          phone: "",
          location: {
              address: "",
              pincode: "",
              lat: null,
              lng: null
          },
          isActive: false
      };
      if (!values.name.trim()) errors.name = "Full Name is required";
      if (!values.phone.trim()) {
        errors.phone = "Phone is required";
      } else if (!/^[0-9]{10}$/.test(values.phone)) {
        errors.phone = "Enter a valid 10-digit phone number";
      }
      
      if (!values.location.trim()) errors.location.address = "Location is required";
      return errors;
    },
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh] border border-gray-200">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Basic Information
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
            {/* <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
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
                      const url = URL.createObjectURL(file); // Replace with cloud upload logic
                      formik.setFieldValue("profileImage", url);
                    }
                  }}
                />
              </label>
            </div> */}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your address"
                className="w-full px-4 py-3 border rounded-lg"
              />
              {formik.touched.location && formik.errors.location && (
                <span className="text-sm text-red-500">{formik.errors.location}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
