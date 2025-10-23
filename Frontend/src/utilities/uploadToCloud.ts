import axios from "axios";

export const uploadToCloud = async (file: File): Promise<string> => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "WorkBee");

  const res = await axios.post(import.meta.env.VITE_CLOUDNARY_URL,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.secure_url;
};