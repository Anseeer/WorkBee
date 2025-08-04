// import React, { useState, useEffect } from 'react';
// import { Camera, Upload, X, Check, MapPin, Clock, User, Phone, FileText, Image, CreditCard } from 'lucide-react';

// const WorkerEditForm = ({ workerData, onClose, onSave }) => {
//   // Initialize form data with worker data or defaults
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     age: '',
//     bio: '',
//     profileImg: '',
//     minHour: '2',
//     workType: 'part-time',
//     preferredSchedule: [],
//     location: '',
//     govIdFront: '',
//     govIdBack: '',
//     services: [],
//     categories: []
//   });

//   // Update form data when workerData changes
//   useEffect(() => {
//     if (workerData?.worker) {
//       const worker = workerData.worker;
//       setFormData({
//         name: worker.name || '',
//         phone: worker.phone || '',
//         age: worker.age?.toString() || '',
//         bio: worker.bio || '',
//         profileImg: worker.profileImg || worker.profileImage || '',
//         minHour: worker.minHour?.toString() || '2',
//         workType: worker.workType || 'part-time',
//         preferredSchedule: worker.preferredSchedule || worker.preferredSchedule || [],
//         location: worker.location || '',
//         govIdFront: worker.govIdFront || worker.governmentId?.front || '',
//         govIdBack: worker.govIdBack || worker.governmentId?.back || '',
//         services: worker.services || [],
//         categories: worker.categories || []
//       });
//     }
//   }, [workerData]);

//   // Sample data for dropdowns and checkboxes
//   const minHourOptions = ['1', '2', '3', '4', '5', '6', '8'];
//   const workTypeOptions = ['full-time', 'part-time', 'contract', 'freelance'];
//   const scheduleOptions = ['morning', 'afternoon', 'evening', 'night', 'weekend'];
//   const allServices = ['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'gardening', 'moving', 'assembly'];
//   const allCategories = ['home-repair', 'maintenance', 'renovation', 'installation', 'cleaning', 'outdoor', 'emergency'];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleArrayToggle = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: prev[field].includes(value)
//         ? prev[field].filter(item => item !== value)
//         : [...prev[field], value]
//     }));
//   };

//   const handleImageUpload = async (field, file) => {
//     // Placeholder for your cloud upload utility
//     // const imageUrl = await uploadToCloud(file);
//     // handleInputChange(field, imageUrl);
//     console.log(`Uploading ${file.name} for field: ${field}`);
//     // For demo, we'll just use a placeholder URL
//     const fakeUrl = `https://placeholder.com/400x300?text=${field}`;
//     handleInputChange(field, fakeUrl);
//   };

//   const handleSubmit = () => {
//     console.log('Updated worker data:', formData);
//     // Call the onSave callback with updated data
//     if (onSave) {
//       onSave(formData);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <User className="w-6 h-6 text-blue-600" />
//               Edit Worker Profile
//             </h2>
//             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={onClose}>
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
//             {/* Basic Information */}
//             <div className="space-y-6">
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <User className="w-5 h-5 text-blue-600" />
//                   Basic Information
//                 </h3>
                
//                 {/* Name */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange('name', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="Enter full name"
//                   />
//                 </div>

//                 {/* Phone and Age */}
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <Phone className="w-4 h-4 inline mr-1" />
//                       Phone
//                     </label>
//                     <input
//                       type="tel"
//                       value={formData.phone}
//                       onChange={(e) => handleInputChange('phone', e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                       placeholder="Phone number"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
//                     <input
//                       type="number"
//                       value={formData.age}
//                       onChange={(e) => handleInputChange('age', e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                       placeholder="Age"
//                       min="18"
//                       max="70"
//                     />
//                   </div>
//                 </div>

//                 {/* Bio */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <FileText className="w-4 h-4 inline mr-1" />
//                     Bio
//                   </label>
//                   <textarea
//                     value={formData.bio}
//                     onChange={(e) => handleInputChange('bio', e.target.value)}
//                     rows="3"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
//                     placeholder="Brief description about the worker..."
//                   />
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <MapPin className="w-4 h-4 inline mr-1" />
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.location}
//                     onChange={(e) => handleInputChange('location', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="City, State"
//                   />
//                 </div>
//               </div>

//               {/* Work Details */}
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <Clock className="w-5 h-5 text-green-600" />
//                   Work Details
//                 </h3>

//                 {/* Min Hour and Work Type */}
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Hours</label>
//                     <select
//                       value={formData.minHour}
//                       onChange={(e) => handleInputChange('minHour', e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
//                     >
//                       {minHourOptions.map(hour => (
//                         <option key={hour} value={hour}>{hour} hour{hour !== '1' ? 's' : ''}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Work Type</label>
//                     <select
//                       value={formData.workType}
//                       onChange={(e) => handleInputChange('workType', e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
//                     >
//                       {workTypeOptions.map(type => (
//                         <option key={type} value={type}>
//                           {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Preferred Schedule */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Schedule</label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {scheduleOptions.map(schedule => (
//                       <label key={schedule} className="flex items-center space-x-2 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={formData.preferredSchedule.includes(schedule)}
//                           onChange={() => handleArrayToggle('preferredSchedule', schedule)}
//                           className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                         />
//                         <span className="text-sm text-gray-700 capitalize">{schedule}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Images and Services */}
//             <div className="space-y-6">
              
//               {/* Profile Image */}
//               <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <Image className="w-5 h-5 text-purple-600" />
//                   Profile Image
//                 </h3>
//                 <div className="flex items-center justify-center w-full">
//                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors">
//                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                       {formData.profileImg ? (
//                         <img src={formData.profileImg} alt="Profile" className="w-16 h-16 rounded-full object-cover mb-2" />
//                       ) : (
//                         <Camera className="w-8 h-8 mb-2 text-purple-500" />
//                       )}
//                       <p className="text-sm text-purple-600">
//                         <span className="font-semibold">Click to upload</span> profile image
//                       </p>
//                     </div>
//                     <input 
//                       type="file" 
//                       className="hidden" 
//                       accept="image/*"
//                       onChange={(e) => e.target.files[0] && handleImageUpload('profileImg', e.target.files[0])}
//                     />
//                   </label>
//                 </div>
//               </div>

//               {/* Government ID */}
//               <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <CreditCard className="w-5 h-5 text-orange-600" />
//                   Government ID
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Front Side</label>
//                     <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-orange-300 border-dashed rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors">
//                       <div className="flex flex-col items-center justify-center">
//                         {formData.govIdFront ? (
//                           <img src={formData.govIdFront} alt="ID Front" className="w-12 h-8 object-cover rounded mb-1" />
//                         ) : (
//                           <Upload className="w-6 h-6 mb-1 text-orange-500" />
//                         )}
//                         <p className="text-xs text-orange-600">Upload Front</p>
//                       </div>
//                       <input 
//                         type="file" 
//                         className="hidden" 
//                         accept="image/*"
//                         onChange={(e) => e.target.files[0] && handleImageUpload('govIdFront', e.target.files[0])}
//                       />
//                     </label>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Back Side</label>
//                     <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-orange-300 border-dashed rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors">
//                       <div className="flex flex-col items-center justify-center">
//                         {formData.govIdBack ? (
//                           <img src={formData.govIdBack} alt="ID Back" className="w-12 h-8 object-cover rounded mb-1" />
//                         ) : (
//                           <Upload className="w-6 h-6 mb-1 text-orange-500" />
//                         )}
//                         <p className="text-xs text-orange-600">Upload Back</p>
//                       </div>
//                       <input 
//                         type="file" 
//                         className="hidden" 
//                         accept="image/*"
//                         onChange={(e) => e.target.files[0] && handleImageUpload('govIdBack', e.target.files[0])}
//                       />
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Services */}
//               <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
//                 <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
//                   {allServices.map(service => (
//                     <label key={service} className="flex items-center space-x-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.services.includes(service)}
//                         onChange={() => handleArrayToggle('services', service)}
//                         className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
//                       />
//                       <span className="text-sm text-gray-700 capitalize">{service}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Categories */}
//               <div className="bg-gradient-to-r from-teal-50 to-green-50 p-4 rounded-xl border border-teal-100">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
//                 <div className="grid grid-cols-2 gap-2">
//                   {allCategories.map(category => (
//                     <label key={category} className="flex items-center space-x-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.categories.includes(category)}
//                         onChange={() => handleArrayToggle('categories', category)}
//                         className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
//                       />
//                       <span className="text-sm text-gray-700 capitalize">{category.replace('-', ' ')}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center gap-2 shadow-lg"
//             >
//               <Check className="w-4 h-4" />
//               Update Worker
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkerEditForm;