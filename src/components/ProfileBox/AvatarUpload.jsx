import React, { useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { BaseURL, imageBaseURL } from "../../../utils/baseUrl";
import { setUpdateUser } from "@/store/authSlice";

const ImgUpload = ({ onChange, src, alt = "Profile Picture" }) => (
  <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload rounded-full border-4 border-orange-500">
      <img
        className="h-50 w-50 cursor-pointer rounded-full "
        src={src}
        alt={""}
      />
    </div>
    <input
      className="hidden"
      id="photo-upload"
      type="file"
      accept=".jpg, .jpeg, .png, .gif"
      onChange={onChange}
    />
  </label>
);

const AvatarUpload = () => {
  const { user } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  const toast = useRef();
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    `${imageBaseURL}${user?.profile_Picture}`,
  );

  const photoUpload = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0]; // Get the file from input
    const formData = new FormData();

    formData.append("profile_Picture", file);

    reader.onloadend = async () => {
      setImagePreviewUrl(reader.result);

      // Upload the file to the server using PUT
      try {
        const res = await axios.put(
          `${BaseURL}/vender/profile-picture/${user._id}`,
          formData,
        );
        dispatch(setUpdateUser(res.data.data.user));
        console.log(res.data.message);

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: res?.data?.message,
          life: 3000,
        });

        console.log("File uploaded successfully:", res.data);
        // window.location.reload();
      } catch (error) {
        console.error("File upload failed:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "File upload failed!",
          life: 3000,
        });
      }
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  };

  return (
    <div>
      <Toast ref={toast} position="top-right" />
      <ImgUpload onChange={photoUpload} src={imagePreviewUrl} />
    </div>
  );
};

export default AvatarUpload;
