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

const jobTypes = [
  { id: "one-time", label: "One Time" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
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
  const [isLoding, setIsLoding] = useState(false)
  const [service, setService] = useState<IServiceOption[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const categories = worker?.categories;
      const servicesByCategory = await getServiceByCategory(categories as string[]);
      const formattedServices = servicesByCategory.data.data.map((srv: any) => ({
        id: srv._id,
        name: srv.name,
        price: srv.wage,
      }));

      setService(formattedServices);
    }
    fetchData();
  }, [])

  const formik = useFormik({
    initialValues: {
      profileImage: null as File | null,
      age: "",
      gender: "",
      govId: [] as File[],
      bio: "",
      workingHours: [] as string[],
      jobTypes: [] as string[],
      minHours: "1",
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
      if (values.jobTypes.length === 0)
        errors.jobTypes = "Select at least one job type";
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
          minHours: Number(values.minHours),
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
    if (e.currentTarget.files) {
      const newFiles = Array.from(e.currentTarget.files);
      const updatedFiles = [...formik.values.govId, ...newFiles];

      if (updatedFiles.length > 2) {
        formik.setFieldError("govId", "Only 2 government IDs allowed");
      } else {
        formik.setFieldValue("govId", updatedFiles);
      }
    }
  };

  const handleRemoveGovId = (index: number) => {
    const updated = [...formik.values.govId];
    updated.splice(index, 1);
    formik.setFieldValue("govId", updated);
  };

  return (
    <div className="max-w-5xl mx-auto h-[560px] overflow-y-auto m-3 p-6 bg-gray-50 rounded-3xl border-2 border-green-600">
      <h1 className="text-2xl font-bold mb-8">Build Your Profile</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column */}
        <div className="space-y-6 pr-6 border-r border-gray-300">
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : Profile}
              alt="Profile"
              className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center"
            />
            <label htmlFor="profile-upload" className="edit-icon cursor-pointer">
              <FaCamera />
            </label>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Age</label>
              <input
                type="number"
                name="age"
                min="18"
                onBlur={formik.handleBlur}
                value={formik.values.age}
                onChange={formik.handleChange}
                className="w-full p-3 border rounded-lg"
              />
              {formik.errors.age && formik.touched.age ? (
                <div className="text-red-500 text-sm">{formik.errors.age}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-sm mb-2">Gender</label>
              <select
                name="gender"
                value={formik.values.gender}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.errors.gender && formik.touched.gender ? (
                <div className="text-red-500 text-sm">{formik.errors.gender}</div>
              ) : null}
            </div>
          </div>

          {/* Government IDs */}
          <div>
            <label className="block text-sm mb-2">Upload Government ID (Front and Back Images Required)</label>
            <div className="relative flex items-center">
              <input
                type="file"
                name="govId"
                multiple
                onBlur={formik.handleBlur}
                onChange={handleGovIdChange}
                className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                className="absolute right-3 text-green-600 hover:text-green-800"
                onClick={() => document.querySelector<HTMLInputElement>('input[name="govId"]')?.click()}
              >
                +
              </button>
            </div>

            {/* Show error */}
            {typeof formik.errors.govId === "string" && formik.touched.govId ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.govId}</div>
            ) : null}

            {/* Selected Files Styled as Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {formik.values.govId.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full shadow"
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
          <div>
            <label className="block text-lg mb-3">Bio</label>
            <textarea
              name="bio"
              rows={3}
              onBlur={formik.handleBlur}
              value={formik.values.bio}
              onChange={formik.handleChange}
              className="w-full p-3 border-b-2 border-gray-300 focus:border-green-500"
            />
            {formik.errors.bio && formik.touched.bio ? (
              <div className="text-red-500 text-sm">{formik.errors.bio}</div>
            ) : null}
          </div>

          {/* Availability Calendar */}
          <div
            onBlur={() => formik.setFieldTouched("availableDates", true)} // 👈 Handles blur
            tabIndex={0} // Needed to make div focusable
          >
            <h3 className="text-lg font-semibold mb-3">Availability</h3>
            <Calendar
              onClickDay={(date) => {
                handleDateClick(date);
                formik.setFieldTouched("availableDates", true); // 👈 Mark touched on date click
              }}
              value={null}
              tileDisabled={({ date, view }) => {
                if (view === "month") {
                  const today = new Date();
                  const todayMidnight = new Date(today.setHours(0, 0, 0, 0));

                  if (date.getTime() < todayMidnight.getTime()) {
                    return true;
                  }

                  if (
                    date.getMonth() !== today.getMonth() ||
                    date.getFullYear() !== today.getFullYear()
                  ) {
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
              className="custom-calendar"
            />
            {formik.errors.availableDates && formik.touched.availableDates && (
              <div className="text-red-500 text-sm">
                {formik.errors.availableDates}
              </div>
            )}
          </div>


        </div>

        {/* Right Column */}
        <div className="space-y-6 pl-6">
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
            <div className="space-y-2">
              {service.map((service: IServiceOption) => (
                <label
                  key={service.id}
                  className="flex items-center gap-3 relative group"
                >
                  <input
                    type="checkbox"
                    checked={formik.values.selectedServices.includes(service.id)}
                    onChange={() => handleCheckbox("selectedServices", service.id)}
                    onBlur={formik.handleBlur}
                    className="w-4 h-4"
                  />
                  <span>{service.name}</span>
                  <span className="absolute left-40 bg-green-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                    ₹{service.price}
                  </span>
                </label>
              ))}

            </div>
            {formik.errors.selectedServices && formik.touched.selectedServices ? (
              <div className="text-red-500 text-sm">
                {formik.errors.selectedServices}
              </div>
            ):null}
          </div>

          {/* Minimum Work Hours */}
          <div>
            <label className="block text-sm mb-2">Minimum Work Hours</label>
            <select
              name="minHours"
              value={formik.values.minHours}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className="w-24 p-2 border rounded focus:ring-2 focus:ring-green-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((hr) => (
                <option key={hr} value={hr}>
                  {hr} hr
                </option>
              ))}
            </select>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Working Hours</h3>
            {workingHours.map((hour) => (
              <label key={hour.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formik.values.workingHours.includes(hour.id)}
                  onChange={() => handleCheckbox("workingHours", hour.id)}
                  onBlur={formik.handleBlur}
                  className="w-4 h-4"
                />
                <span>{hour.label}</span>
              </label>
            ))}
            {formik.errors.workingHours && formik.touched.workingHours ? (
              <div className="text-red-500 text-sm">
                {formik.errors.workingHours}
              </div>
            ):null}
          </div>

          {/* Job Types */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Job Types</h3>
            {jobTypes.map((type) => (
              <label key={type.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formik.values.jobTypes.includes(type.id)}
                  onChange={() => handleCheckbox("jobTypes", type.id)}
                  onBlur={formik.handleBlur}
                  className="w-4 h-4"
                />
                <span>{type.label}</span>
              </label>
            ))}
            {formik.errors.jobTypes && formik.touched.jobTypes ? (
              <div className="text-red-500 text-sm">{formik.errors.jobTypes}</div>
            ):null}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              {isLoding ? `Submiting....` : `Submit`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
