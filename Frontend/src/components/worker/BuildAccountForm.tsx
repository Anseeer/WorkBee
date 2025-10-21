/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./workerStyle.css";
import { getProfileImage } from "../../utilities/getProfile";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import { FaCamera, FaTrash } from "react-icons/fa";
import { uploadToCloud } from "../../utilities/uploadToCloud";
import { buildAccountWorkerThunk } from "../../slice/workerSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { toast } from "react-toastify";
import { getServiceByCategory } from "../../services/workerService";


const workingHours = [
  { id: "morning", label: "Morning (9am - 1pm)" },
  { id: "afternoon", label: "Afternoon (1pm - 5pm)" },
  { id: "evening", label: "Evening (5pm - 9pm)" },
  { id: "full-day", label: "Full Day (9am - 5pm)" },
];

interface IServiceOption {
  id: string;
  name: string;
  price: string;
}

export default function BuildAccount() {
  const worker = useSelector((state: RootState) => state?.worker.worker);
  console.log("Worker from the useSelector:", worker)
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedImg, setSelectedImg] = useState<File | null>(null);
  const Profile = getProfileImage(worker?.name, selectedImg);
  const [isLoading, setIsLoding] = useState(false)
  const [service, setService] = useState<IServiceOption[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const categories = worker?.categories;
      const servicesByCategory = await getServiceByCategory(categories as string[]);
      const formattedServices =
        typeof servicesByCategory !== "string"
          ? servicesByCategory.data?.data.map((srv: any) => ({
            id: srv._id,
            name: srv.name,
            price: srv.wage,
          }))
          : [];

      setService(formattedServices);
    }
    fetchData();
  }, [worker?.categories])

  const formik = useFormik({
    initialValues: {
      profileImage: null as File | null,
      age: "",
      gender: "",
      govId: [] as File[],
      bio: "",
      workingHours: [] as string[],
      jobTypes: [] as string[],
      radius: "1",
      selectedServices: [] as string[],
      availableDates: [] as string[],
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.age) errors.age = "Age is required";
      else if (Number(values.age) < 18)
        errors.age = "Must be at least 18 years old";
      if (!values.gender) errors.gender = "Gender is required";
      if (!values.bio) errors.bio = "Bio is required";
      if (values.workingHours.length === 0)
        errors.workingHours = "Select at least one slot";
      if (values.radius.length === 0)
        errors.radius = "Select at least five km radius";
      if (values.radius.length < 5)
        errors.radius = "Select distance (in km) you’re willing to travel for work";
      if (values.selectedServices.length === 0)
        errors.selectedServices = "Select at least one service";
      if (selectedDates.length === 0)
        errors.availableDates = "Select at least one available date";
      if (values.govId.length < 2) {
        errors.govId = "Upload 2 government IDs";
      } else if (values.govId.length > 2) {
        errors.govId = "Only 2 government IDs allowed";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoding(true);
      try {
        const profileUrl = values.profileImage
          ? await uploadToCloud(values.profileImage)
          : "";

        const govUrls = await Promise.all(
          values.govId.map(async (file) => await uploadToCloud(file))
        );

        const availability = {
          workerId: worker?._id,
          availableDates: selectedDates.map((date) => ({
            date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
            bookedSlots: [],
          })),
        };


        const payload = {
          _id: worker?._id,
          profileImage: profileUrl ? profileUrl : Profile,
          bio: values.bio,
          age: Number(values.age),
          services: values.selectedServices,
          workType: values.jobTypes,
          radius: Number(values.radius),
          preferredSchedule: values.workingHours,
          govId: govUrls.length === 1 ? govUrls[0] : govUrls,
          availability,
        };

        console.log("Final Payload", payload);


        await dispatch(buildAccountWorkerThunk(payload)).unwrap()
        toast.success("Build Account Successfully");
        setIsLoding(false)
      } catch (error) {
        const err = error instanceof Error ? error.message : String(error);
        console.error("Upload failed", err);
        toast.error(`Error: ${err}`);
      }

    },
  });

  const handleCheckbox = (field: keyof typeof formik.values, value: string) => {
    const current = formik.values[field] as string[];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    formik.setFieldValue(field, updated);
  };

  const handleDateClick = (date: Date) => {
    const exists = selectedDates.find(
      (d) => d.toDateString() === date.toDateString()
    );
    if (exists) {
      setSelectedDates(
        selectedDates.filter((d) => d.toDateString() !== date.toDateString())
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleGovIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const newFiles = Array.from(e.currentTarget.files);

    const validFiles = newFiles.filter((file) => validTypes.includes(file.type));
    const invalidFiles = newFiles.filter((file) => !validTypes.includes(file.type));

    const updatedFiles = [...formik.values.govId, ...validFiles];
    e.currentTarget.value = "";

    formik.setFieldValue("govId", updatedFiles);

    if (invalidFiles.length > 0) {
      formik.setFieldError("govId", "Only PNG or JPG images are allowed");
    } else if (updatedFiles.length < 2) {
      formik.setFieldError("govId", "Upload 2 government IDs");
    } else if (updatedFiles.length > 2) {
      formik.setFieldError("govId", "Only 2 government IDs allowed");
    } else {
      // Clear error if valid
      formik.setFieldError("govId", "");
    }
  };

  const handleRemoveGovId = (index: number) => {
    const updated = [...formik.values.govId];
    updated.splice(index, 1);
    formik.setFieldValue("govId", updated);
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start relative bg-gray-50 p-6 animate-fadeInUp">
      {/* Logo in top-left corner */}
      <div className="absolute top-6 left-6 animate-fadeInDown">
        <h1 className="merienda-text text-3xl text-green-900">WorkBee</h1>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-6xl bg-white rounded-3xl border-2 border-green-600 shadow-md p-8 mt-20 animate-fadeInScale">
        <h1 className="text-2xl font-bold mb-8 text-start animate-fadeInDown">Build Your Profile</h1>
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left Column */}
          <div className="flex flex-col space-y-6 animate-fadeInUp">
            {/* Profile Image */}
            <div className="flex flex-col items-start gap-4 animate-zoomIn">
              <div className="relative">
                <img
                  src={selectedImg ? URL.createObjectURL(selectedImg) : Profile}
                  alt="Profile"
                  className="w-32 h-32 rounded-full bg-gray-300 object-cover animate-scaleIn"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors"
                >
                  <FaCamera className="text-white text-sm animate-zoomIn" />
                </label>
              </div>
              <input
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedImg(file);
                    formik.setFieldValue("profileImage", file);
                  }
                }}
                type="file"
                id="profile-upload"
                accept="image/*"
                hidden
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4 animate-fadeInUp">
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  min="18"
                  onBlur={formik.handleBlur}
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {formik.errors.age && formik.touched.age && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formik.values.gender}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formik.errors.gender && formik.touched.gender && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.gender}</div>
                )}
              </div>
            </div>

            {/* Government ID Upload */}
            <div className="animate-fadeInUp">
              <label className="block text-sm font-medium mb-2">
                Upload Government ID (Front and Back Images Required)
              </label>
              <div className="relative flex items-center">
                <input
                  type="file"
                  name="govId"
                  multiple
                  onBlur={formik.handleBlur}
                  onChange={handleGovIdChange}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  className="absolute right-3 text-green-600 hover:text-green-800 font-bold text-xl animate-zoomIn"
                  onClick={() =>
                    document
                      .querySelector<HTMLInputElement>('input[name="govId"]')
                      ?.click()
                  }
                >
                  +
                </button>
              </div>
              {typeof formik.errors.govId === "string" && formik.touched.govId && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.govId}</div>
              )}
              <div className="flex flex-wrap gap-2 mt-3 animate-fadeInUp">
                {formik.values.govId.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full shadow animate-zoomIn"
                  >
                    <span className="text-sm font-medium">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGovId(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="animate-fadeInUp">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                rows={4}
                onBlur={formik.handleBlur}
                value={formik.values.bio}
                onChange={formik.handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                placeholder="Tell us about yourself..."
              />
              {formik.errors.bio && formik.touched.bio && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.bio}</div>
              )}
            </div>

            {/* Availability */}
            <div
              onBlur={() => formik.setFieldTouched("availableDates", true)}
              tabIndex={0}
              className="animate-fadeInUp"
            >
              <h3 className="text-sm font-medium mb-3">Availability</h3>
              <Calendar
                onClickDay={(date) => {
                  handleDateClick(date);
                  formik.setFieldTouched("availableDates", true);
                }}
                value={null}
                tileDisabled={({ date, view }) => {
                  if (view === "month") {
                    const today = new Date();
                    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
                    if (date.getTime() < todayMidnight.getTime()) {
                      return true;
                    }
                  }
                  return false;
                }}
                tileClassName={({ date }) => {
                  const isSelected = selectedDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  );
                  return isSelected ? "selected-date" : "";
                }}
                className="custom-calendar w-full"
              />
              {formik.errors.availableDates && formik.touched.availableDates && (
                <div className="text-red-500 text-sm mt-2">{formik.errors.availableDates}</div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 animate-fadeInUp">
            {/* Services Offered */}
            <div className="animate-fadeInUp">
              <h3 className="text-sm font-medium mb-3">Services Offered</h3>
              <div className="space-y-3">
                {service.map((service: IServiceOption) => (
                  <label
                    key={service.id}
                    className="flex items-center gap-3 relative group cursor-pointer animate-zoomIn"
                  >
                    <input
                      type="checkbox"
                      checked={formik.values.selectedServices.includes(service.id)}
                      onChange={() => handleCheckbox("selectedServices", service.id)}
                      onBlur={formik.handleBlur}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded"
                    />
                    <span className="text-sm">{service.name}</span>
                    <span className="absolute left-full ml-2 bg-green-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                      ₹{service.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Travel Radius */}
            <div className="animate-fadeInUp">
              <label className="block text-sm font-medium mb-2">
                Maximum Travel Distance (km)
              </label>
              <input
                type="number"
                name="radius"
                min="1"
                max="100"
                placeholder="e.g., 15"
                value={formik.values.radius}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="w-32 p-3 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-2">
                You will only receive work within this distance from your location.
              </p>
              {formik.errors.radius && formik.touched.radius && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.radius}</div>
              )}
            </div>

            {/* Working Hours */}
            <div className="animate-fadeInUp">
              <h3 className="text-sm font-medium mb-3">Working Hours</h3>
              <div className="space-y-3">
                {workingHours.map((hour) => (
                  <label key={hour.id} className="flex items-center gap-3 cursor-pointer animate-zoomIn">
                    <input
                      type="checkbox"
                      checked={formik.values.workingHours.includes(hour.id)}
                      onChange={() => handleCheckbox("workingHours", hour.id)}
                      onBlur={formik.handleBlur}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded"
                    />
                    <span className="text-sm">{hour.label}</span>
                  </label>
                ))}
              </div>
              {formik.errors.workingHours && formik.touched.workingHours && (
                <div className="text-red-500 text-sm mt-2">{formik.errors.workingHours}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 animate-fadeInUp">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium animate-zoomIn"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

}
