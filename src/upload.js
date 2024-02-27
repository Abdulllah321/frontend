import axios from "axios";

export const uploadCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "images_presets");

  try {
    const { data } = await axios.post(
      "https://api.cloudinary.com/v1_1/dh6rm1bj6/image/upload",
      formData
    );
    return { publicId: data?.public_id, url: data?.secure_url };
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};


