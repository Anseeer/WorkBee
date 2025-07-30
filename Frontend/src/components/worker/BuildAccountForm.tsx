import React, { useState } from "react";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./workerStyle.css"

const servicesFromDB = [
  { id: "car-wash", name: "Car Wash", price: 350 },
  { id: "house-cleaning", name: "House Cleaning", price: 500 },
  { id: "water-tank-wash", name: "Water Tank Wash", price: 450 },
];

const workingHours = [
  { id: "morning", label: "Morning (9am - 1pm)" },
  { id: "afternoon", label: "Afternoon (1pm - 5pm)" },
  { id: "evening", label: "Evening (5pm - 9pm)" },
  { id: "full-day", label: "Evening (9am - 5pm)" },
];

const jobTypes = [
  { id: "one-time", label: "One Time" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

export default function BuildAccount() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const formik = useFormik({
    initialValues: {
      profileImage: null,
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
      if (values.govId.length < 2)
        errors.govId = "Upload 2 government IDs";
      return errors;
    },
    onSubmit: (values) => {
      const availableDates = selectedDates.map((date) =>
        date.toISOString().split("T")[0]
      );
      console.log("Form Data", { ...values, availableDates });
      alert("Form submitted successfully!");
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

  // const handleMonthChange = () => {
  //   setSelectedDates([]);
  // };

  const handleGovIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const newFiles = Array.from(e.currentTarget.files);
      const existingFiles = formik.values.govId || [];

      const updatedFiles = [...existingFiles, ...newFiles];

      if (updatedFiles.length > 2) {
        alert("You can only upload 2 government IDs");
        return;
      }

      formik.setFieldValue("govId", updatedFiles);
    }
  };


  return (
    <div className="max-w-5xl mx-auto h-[560px] overflow-y-auto m-3 p-6 bg-gray-50 rounded-3xl border-2 border-green-600">
      <h1 className="text-2xl font-bold mb-8">Build Your Profile</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 "
      >
        {/* Left Column */}
        <div className="space-y-6 pr-6 border-r border-gray-300">
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">Photo</span>
            </div>
            <label className="bg-green-800 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  formik.setFieldValue(
                    "profileImage",
                    e.currentTarget.files?.[0]
                  )
                }
              />
            </label>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Age</label>
              <input
                type="number"
                name="age"
                min="18"
                value={formik.values.age}
                onChange={formik.handleChange}
                className="w-full p-3 border rounded-lg"
              />
              {formik.errors.age && (
                <div className="text-red-500 text-sm">{formik.errors.age}</div>
              )}
            </div>
            <div>
              <label className="block text-sm mb-2">Gender</label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.errors.gender && (
                <div className="text-red-500 text-sm">
                  {formik.errors.gender}
                </div>
              )}
            </div>
          </div>

          {/* Government IDs */}
          <div>
            <label className="block text-sm mb-2">Government IDs (Upload 2)</label>
            <input
              type="file"
              name="govId"
              multiple
              onChange={handleGovIdChange}
              className="w-full p-3 border rounded-lg"
            />
            {Array.isArray(formik.errors.govId) &&
              formik.errors.govId.map((error, index) => (
                <div key={index} className="text-red-500 text-sm">
                  {typeof error === "string" ? error : "Invalid file"}
                </div>
              ))}

          </div>

          {/* Bio */}
          <div>
            <label className="block text-lg mb-3">Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={formik.values.bio}
              onChange={formik.handleChange}
              className="w-full p-3 border-b-2 border-gray-300 focus:border-green-500"
            />
            {formik.errors.bio && (
              <div className="text-red-500 text-sm">{formik.errors.bio}</div>
            )}
          </div>

          {/* Availability Calendar */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Availability</h3>
            <Calendar
              onClickDay={handleDateClick}
              value={null}
              tileDisabled={({ date, view }) => {
                if (view === "month") {
                  const today = new Date();
                  return (
                    date.getMonth() !== today.getMonth() ||
                    date.getFullYear() !== today.getFullYear()
                  );
                }
                return false;
              }}
              tileClassName={({ date }) => {
                const isSelected = selectedDates.some(
                  (d) => d.toDateString() === date.toDateString()
                );
                return isSelected
                  ? "selected-date"
                  : "";
              }}
              className="custom-calendar"
            />



            {formik.errors.availableDates && (
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
              {servicesFromDB.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center gap-3 relative group"
                >
                  <input
                    type="checkbox"
                    checked={formik.values.selectedServices.includes(service.id)}
                    onChange={() =>
                      handleCheckbox("selectedServices", service.id)
                    }
                    className="w-4 h-4"
                  />
                  <span>{service.name}</span>
                  <span className="absolute left-40 bg-green-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                    ₹{service.price}
                  </span>
                </label>
              ))}
            </div>
            {formik.errors.selectedServices && (
              <div className="text-red-500 text-sm">
                {formik.errors.selectedServices}
              </div>
            )}
          </div>

          {/* Minimum Work Hours */}
          <div>
            <label className="block text-sm mb-2">Minimum Work Hours</label>
            <select
              name="minHours"
              value={formik.values.minHours}
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
                  className="w-4 h-4"
                />
                <span>{hour.label}</span>
              </label>
            ))}
            {formik.errors.workingHours && (
              <div className="text-red-500 text-sm">
                {formik.errors.workingHours}
              </div>
            )}
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
                  className="w-4 h-4"
                />
                <span>{type.label}</span>
              </label>
            ))}
            {formik.errors.jobTypes && (
              <div className="text-red-500 text-sm">
                {formik.errors.jobTypes}
              </div>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
