/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getProfileImage } from "../../utilities/getProfile";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import { FaCamera, FaTrash } from "react-icons/fa";
import { uploadToCloud } from "../../utilities/uploadToCloud";
import { buildAccountWorkerThunk } from "../../slice/workerSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { toast } from "react-toastify";
import { getServiceByCategory } from "../../services/workerService";
import type { ISelectedService } from "../../types/IService";
import "../../App.css"

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
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedImg, setSelectedImg] = useState<File | null>(null);
  const Profile = getProfileImage(worker?.name, selectedImg);
  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState<IServiceOption[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = worker?.categories;
        const servicesByCategory = await getServiceByCategory(
          (categories as string[]) || []
        );
        const formattedServices =
          typeof servicesByCategory !== "string" && servicesByCategory?.data
            ? servicesByCategory.data.data.map((srv: any) => ({
              id: srv._id,
              name: srv.name,
              price: srv.wage,
            }))
            : [];
        setService(formattedServices);
      } catch (err) {
        console.error("Error fetching services", err);
        setService([]);
      }
    };
    fetchData();
  }, [worker?.categories]);

  const formik = useFormik({
    initialValues: {
      profileImage: null as File | null,
      age: "",
      gender: "",
      govId: [] as File[],
      bio: "",
      workingHours: [] as string[],
      radius: "5",
      selectedServices: [] as ISelectedService[],
      availableDates: [] as string[],
    },
    validate: (values) => {
      const errors: Record<string, any> = {};

      if (!values.age) {
        errors.age = "Age is required";
      } else if (Number(values.age) < 18) {
        errors.age = "Must be at least 18 years old";
      }

      if (!values.gender) errors.gender = "Gender is required";

      if (!values.bio) errors.bio = "Bio is required";

      if (!values.workingHours || values.workingHours.length === 0) {
        errors.workingHours = "Select at least one slot";
      }

      if (!values.radius || Number(values.radius) < 1) {
        errors.radius = "Select distance (in km) you're willing to travel for work";
      }

      if (!values.selectedServices || values.selectedServices.length === 0) {
        errors.selectedServices = "Select at least one service";
      } else {
        values.selectedServices.forEach((item) => {
          const key = `service_price_${item.serviceId}`;
          if (item.price === undefined || item.price === null || Number(item.price) <= 0) {
            errors[key] = "Enter a valid price for this service";
          }
        });
      }

      if (selectedDates.length === 0) {
        errors.availableDates = "Select at least one available date";
      }

      if (!values.govId || values.govId.length < 2) {
        errors.govId = "Upload 2 government IDs";
      } else if (values.govId.length > 2) {
        errors.govId = "Only 2 government IDs allowed";
      }

      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);
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
            date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
              date.getDate()
            ).padStart(2, "0")}`,
            bookedSlots: [],
          })),
        };

        const servicesPayload = values.selectedServices.map((s) => ({
          serviceId: s.serviceId,
          name: s.name,
          price: Number(s.price),
          unit: s.unit || "hour",
        }));

        const payload = {
          _id: worker?._id,
          profileImage: profileUrl ? profileUrl : Profile,
          bio: values.bio,
          age: Number(values.age),
          services: servicesPayload,
          radius: Number(values.radius),
          preferredSchedule: values.workingHours,
          govId: govUrls.length === 1 ? govUrls[0] : govUrls,
          availability,
        };

        await dispatch(buildAccountWorkerThunk(payload)).unwrap();
        toast.success("Build Account Successfully");
        setIsLoading(false);
      } catch (error) {
        const err = error instanceof Error ? error.message : String(error);
        toast.error(`Error: ${err}`);
        setIsLoading(false);
      }
    },
  });

  const handleServiceCheckbox = (serviceId: string, serviceName: string) => {
    const current: ISelectedService[] = formik.values.selectedServices || [];
    const existingIndex = current.findIndex((s) => s.serviceId === serviceId);

    if (existingIndex !== -1) {
      const updated = current.filter((s) => s.serviceId !== serviceId);
      formik.setFieldValue("selectedServices", updated);
    } else {
      const newService: ISelectedService = {
        serviceId,
        name: serviceName,
        price: 0,
        unit: "hour",
      };
      formik.setFieldValue("selectedServices", [...current, newService]);
    }
  };

  const handlePriceChange = (serviceId: string, price: string) => {
    if (price && !/^\d*\.?\d*$/.test(price)) return;

    const current: ISelectedService[] = formik.values.selectedServices || [];
    const updated = current.map((s) =>
      s.serviceId === serviceId ? { ...s, price: price === "" ? 0 : Number(price) } : s
    );
    formik.setFieldValue("selectedServices", updated);
  };

  const handleCheckbox = (field: "workingHours", value: string) => {
    const current = formik.values[field] as string[];
    const updated = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    formik.setFieldValue(field, updated);
  };

  const handleDateClick = (date: Date) => {
    const exists = selectedDates.find((d) => d.toDateString() === date.toDateString());
    if (exists) {
      setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
    formik.setFieldTouched("availableDates", true, true);
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
      formik.setFieldError("govId", "");
    }
  };

  const handleRemoveGovId = (index: number) => {
    const updated = [...formik.values.govId];
    updated.splice(index, 1);
    formik.setFieldValue("govId", updated);
  };

  const getServicePrice = (serviceId: string): string => {
    const s = (formik.values.selectedServices || []).find((x) => x.serviceId === serviceId);
    if (!s) return "";
    return s.price && Number(s.price) > 0 ? String(s.price) : "";
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
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="flex flex-col space-y-6 animate-fadeInUp">
            {/* Profile Image */}
            <div className="flex flex-col items-start gap-4 animate-zoomIn">
              <div className="relative">
                <img src={selectedImg ? URL.createObjectURL(selectedImg) : Profile} alt="Profile"
                  className="w-32 h-32 rounded-full bg-gray-300 object-cover animate-scaleIn" />
                <label htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
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
                <input type="number" name="age" min="18" onBlur={formik.handleBlur} value={formik.values.age}
                  onChange={formik.handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" />
                {formik.errors.age && formik.touched.age && <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select name="gender" value={formik.values.gender} onBlur={formik.handleBlur} onChange={formik.handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formik.errors.gender && formik.touched.gender && <div className="text-red-500 text-sm mt-1">{formik.errors.gender}</div>}
              </div>
            </div>

            {/* Government ID Upload */}
            <div className="animate-fadeInUp">
              <label className="block text-sm font-medium mb-2">Upload Government ID (Front and Back Images Required)</label>
              <div className="relative flex items-center">
                <input type="file" name="govId" multiple onBlur={formik.handleBlur} onChange={handleGovIdChange}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg" accept="image/jpeg,image/jpg,image/png" />
                <button type="button"
                  className="absolute right-3 text-green-600 hover:text-green-800 font-bold text-xl animate-zoomIn"
                  onClick={() => document.querySelector<HTMLInputElement>('input[name="govId"]')?.click()}>
                  +
                </button>
              </div>
              {typeof formik.errors.govId === "string" && formik.touched.govId && <div className="text-red-500 text-sm mt-1">{formik.errors.govId}</div>}
              <div className="flex flex-wrap gap-2 mt-3 animate-fadeInUp">
                {formik.values.govId.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full shadow animate-zoomIn">
                    <span className="text-sm font-medium">{file.name}</span>
                    <button type="button" onClick={() => handleRemoveGovId(index)} className="text-red-500 hover:text-red-700 text-xs">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="animate-fadeInUp">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea name="bio" rows={4} onBlur={formik.handleBlur} value={formik.values.bio} onChange={formik.handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                placeholder="Tell us about yourself..." />
              {formik.errors.bio && formik.touched.bio && <div className="text-red-500 text-sm mt-1">{formik.errors.bio}</div>}
            </div>

            {/* Availability */}
            <div onBlur={() => formik.setFieldTouched("availableDates", true)} tabIndex={0} className="animate-fadeInUp">
              <h3 className="text-sm font-medium mb-3">Availability</h3>
              <Calendar
                onClickDay={(date) => {
                  handleDateClick(date);
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
                  const isSelected = selectedDates.some((d) => d.toDateString() === date.toDateString());
                  return isSelected ? "selected-date" : "";
                }}
                className="custom-calendar w-full"
              />
              {formik.errors.availableDates && formik.touched.availableDates && <div className="text-red-500 text-sm mt-2">{formik.errors.availableDates}</div>}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 animate-fadeInUp">
            {/* Services Offered with Dynamic Price Fields */}
            <div>
              <h3 className="text-sm font-medium mb-3">Services Offered</h3>
              <div className="space-y-4">
                {service.map((srv) => {
                  const isSelected = (formik.values.selectedServices || []).some((s) => s.serviceId === srv.id);

                  return (
                    <div key={srv.id} className="space-y-2">
                      {/* Service Checkbox */}
                      <label className="flex items-center gap-3 relative group  cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleServiceCheckbox(srv.id, srv.name)}
                          onBlur={formik.handleBlur}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded "
                        />
                        <span className="text-sm hover:text-green-800">{srv.name}</span>
                      </label>

                      {/* Price Input - Only shown when service is selected */}
                      {isSelected && (
                        <div className="ml-7 animate-slideDown">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Price (in INR)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={getServicePrice(srv.id)}
                              onChange={(e) => handlePriceChange(srv.id, e.target.value)}
                              onBlur={() => {
                                formik.setFieldTouched(`service_price_${srv.id}`, true);
                                formik.validateField(`service_price_${srv.id}`);
                              }}
                              placeholder="Enter your price"
                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                            />
                            <span className="text-sm text-gray-500 whitespace-nowrap">/ hour</span>
                          </div>
                          {(formik.touched as any)[`service_price_${srv.id}`] ||
                            (formik.errors as any)[`service_price_${srv.id}`] && (
                              <div className="text-red-500 text-xs mt-1">
                                {(formik.errors as any)[`service_price_${srv.id}`]}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {typeof formik.errors.selectedServices === "string" && formik.touched.selectedServices && (
                <div className="text-red-500 text-sm mt-2">{formik.errors.selectedServices}</div>
              )}
            </div>

            {/* Travel Radius */}
            <div className="animate-fadeInUp">
              <label className="block text-sm font-medium mb-2">Maximum Travel Distance (km)</label>
              <input type="number" name="radius" min="1" max="100" placeholder="e.g., 15"
                value={formik.values.radius} onBlur={formik.handleBlur} onChange={formik.handleChange}
                className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" />
              <p className="text-xs text-gray-500 mt-2">You will only receive work within this distance from your location.</p>
              {formik.errors.radius && formik.touched.radius && <div className="text-red-500 text-sm mt-1">{formik.errors.radius}</div>}
            </div>

            {/* Working Hours */}
            <div className="animate-fadeInUp">
              <h3 className="text-sm font-medium mb-3">Working Hours</h3>
              <div className="space-y-3">
                {workingHours.map((hour) => (
                  <label key={hour.id} className="flex items-center gap-3 cursor-pointer animate-zoomIn">
                    <input type="checkbox" checked={formik.values.workingHours.includes(hour.id)}
                      onChange={() => handleCheckbox("workingHours", hour.id)} onBlur={formik.handleBlur}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-600" />
                    <span className="text-sm">{hour.label}</span>
                  </label>
                ))}
              </div>
              {formik.errors.workingHours && formik.touched.workingHours && <div className="text-red-500 text-sm mt-2">{formik.errors.workingHours}</div>}
            </div>

            {/* Submit Button */}
            <div className="pt-4 animate-fadeInUp">
              <button type="submit" disabled={isLoading}
                className="w-full bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium animate-zoomIn">
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

