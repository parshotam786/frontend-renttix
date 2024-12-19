import React, { useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { BaseURL, imageBaseURL } from "../../../utils/baseUrl";
import { setUpdateUser } from "@/store/authSlice";
const ImgUpload = ({ onChange, src, alt = "Profile Picture" }) => (
  <label htmlFor="brand-logo" className="custom-file-upload fas">
    <div className="img-wrap img-upload group  ">
      <img
        className=" h-auto max-h-14 w-80 cursor-pointer"
        src={src}
        alt={"Brand_logo"}
      />
    </div>
    <input
      className="hidden"
      id="brand-logo"
      type="file"
      accept=".jpg, .jpeg, .png, .gif"
      onChange={onChange}
    />
  </label>
);

const BrandLogo = () => {
  const { user } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  const toast = useRef();
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    `${imageBaseURL}${user?.brandLogo}`,
  );

  const photoUpload = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0]; // Get the file from input
    const formData = new FormData();

    formData.append("brandLogo", file);

    reader.onloadend = async () => {
      setImagePreviewUrl(reader.result);

      // Upload the file to the server using PUT
      try {
        const res = await axios.put(
          `${BaseURL}/vender/brand-logo/${user._id}`,
          formData,
        );
        dispatch(setUpdateUser(res.data.data.user));
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: res?.data?.message,
          life: 3000,
        });
        // window.location.reload();
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "File upload failed",
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

export default BrandLogo;
