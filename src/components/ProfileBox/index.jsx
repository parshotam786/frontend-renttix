"use client";
import { Toast } from "primereact/toast";
import React, { useRef } from "react";
import AvatarUpload from "./AvatarUpload";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import BrandLogo from "./BrandLogo";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateUser } from "@/store/authSlice";
import { BaseURL } from "../../../utils/baseUrl";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CanceButton from "../Buttons/CanceButton";
import { useRouter } from "next/navigation";

const ProfileBox = () => {
  const toast = useRef();
  const { user } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("company name is required"),
    legalName: Yup.string().required("Legal Name is required"),
    businessType: Yup.string().required("Business Type is required"),
    taxId: Yup.string().required("Tax id is required"),
    swiftCode: Yup.string().required("swift Code is required"),
    iban: Yup.string().required("iban is required"),
    primaryPhone: Yup.string().required("Phone Number is required"),
    email: Yup.string().required("email is required"),
    zip: Yup.string().required("Street is required"),
    state: Yup.string().required("Street is required"),
    city: Yup.string().required("Street is required"),
    country: Yup.string().required("Street is required"),
    primaryContact: Yup.string().required("Primary Contact is required"),
    bankName: Yup.string().required("Bank Name is required"),
    accountName: Yup.string().required("Account Name is required"),
    accountNumber: Yup.string().required("Account Number is required"),
    bankAddress: Yup.string().required("Bank Address is required"),
    street: Yup.string().required("Street is required"),
    // Add more validation as needed
  });

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await axios.put(
        `${BaseURL}/vender/${user?._id}`,
        values,
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: response.data?.message,
        life: 3000,
      });

      dispatch(setUpdateUser(response?.data?.data?.user));

      console.log(response.data);
    } catch (error) {
      console.log(error.response.data.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message,
        life: 3000,
      });

      console.error("Error registering vendor:", error);
      // Handle error response (e.g., show an error message)
    }
  };
  return (
    <div>
      <Toast ref={toast} position="top-right" />
      <hr className="my-4 dark:hidden" />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-10">
        <div class="col-span-2  p-4 "></div>
        <div class="col-span-8 rounded-lg bg-white p-4  dark:bg-dark md:col-span-8 lg:col-span-8 xl:col-span-5">
          <div className=" flex flex-col-reverse items-center justify-around md:flex-row ">
            <div className="group relative w-[250px] p-3  py-5 ">
              <div className="absolute bottom-8 left-20 ">
                <label className="hidden font-semibold text-[#333] group-hover:block">
                  Upload Logo
                </label>
              </div>
              <div className="group-hover:opacity-15">
                <BrandLogo />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="mb-12 flex flex-col justify-center  ">
                <div className="group relative ">
                  <div className="absolute bottom-22  left-22 ">
                    <label className="hidden font-semibold text-[#333] group-hover:block">
                      Upload
                    </label>
                  </div>
                  <div className="group-hover:opacity-15">
                    <AvatarUpload />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-8 dark:hidden" />
      <Formik
        initialValues={{
          primaryContact: user?.primaryContact || "",
          bankName: user?.bankName || "",
          bankAddress: user?.bankAddress || "",
          street: user?.street || "",
          companyName: user?.companyName || "",
          legalName: user?.legalName || "",
          businessType: user?.businessType || "",
          taxId: user?.taxId || "",
          swiftCode: user?.swiftCode || "",
          iban: user?.iban || "",
          zip: user?.zip || "",
          city: user?.city || "",
          state: user?.city || "",
          email: user?.email || "",
          primaryPhone: user?.primaryPhone || "",
          country: user?.country || "",
          accountName: user?.accountName || "",
          accountNumber: user?.accountNumber || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-10">
              <div class="col-span-2  p-4 ">
                <h3 className="font-bold">Company Information</h3>
              </div>
              <div class="col-span-8 rounded-lg bg-white p-4  dark:bg-dark md:col-span-8 lg:col-span-8 xl:col-span-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="">
                    <label className="mb-1 block font-medium text-black dark:text-white">
                      Company Name <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.companyName}
                      name="companyName"
                      placeholder="Company Name"
                    />
                    <ErrorMessage
                      name="companyName"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div className="">
                    <label className="mb-1 block font-medium text-black dark:text-white">
                      Tax Identification Number{" "}
                      <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.taxId}
                      name="taxId"
                      placeholder="Tax Identification Number"
                    />
                    <ErrorMessage
                      name="taxId"
                      component="div"
                      className=" text-red"
                    />
                  </div>
                  <div className="">
                    <label className="mb-1 block font-medium text-black dark:text-white">
                      Legal Name <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.legalName}
                      name="legalName"
                      placeholder="Legal Name"
                    />
                    <ErrorMessage
                      name="legalName"
                      component="div"
                      className="text-red"
                    />
                  </div>

                  <div className="">
                    <label className="mb-1 block font-medium text-black dark:text-white">
                      Business Type
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.businessType}
                      name="businessType"
                      placeholder="Business Type"
                    />
                    <ErrorMessage
                      name="businessType"
                      component="div"
                      className="text-red"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-8  dark:hidden " />
            <div class="grid grid-cols-1 gap-4 md:grid-cols-10">
              <div class="col-span-2  p-4 ">
                <h3 className="font-bold">Contact Information</h3>
              </div>
              <div class="col-span-8 rounded-lg bg-white p-4  dark:bg-dark md:col-span-8 lg:col-span-8 xl:col-span-5">
                <div className="grid grid-cols-1 md:grid-cols-1">
                  <label className="mb-1 block font-medium text-black dark:text-white">
                    Primary Contact Person <span className="text-red">*</span>
                  </label>
                  <Field
                    as={InputText}
                    onChange={handleChange}
                    value={values?.primaryContact}
                    name="primaryContact"
                    placeholder="Primary Contact Person"
                  />
                  <ErrorMessage
                    name="primaryContact"
                    component="div"
                    className="text-red"
                  />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-medium text-black dark:text-white">
                      Phone Number <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.primaryPhone}
                      name="primaryPhone"
                      placeholder="Phone Number"
                    />
                    <ErrorMessage
                      name="primaryPhone"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-black dark:text-white">
                      Email Address <span className="text-red">*</span>
                    </label>
                    <Field
                      disabled
                      as={InputText}
                      onChange={handleChange}
                      value={values?.email}
                      name="email"
                      placeholder="Email Address"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-8 dark:hidden" />
            <div class="grid grid-cols-1 gap-4 md:grid-cols-10">
              <div class="col-span-2  p-4 ">
                <h3 className="font-bold">Banking Information</h3>
              </div>
              <div class="col-span-8 rounded-lg bg-white p-4  dark:bg-dark  md:col-span-8 lg:col-span-8 xl:col-span-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Bank Name <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.bankName}
                      isInvalid={values?.bankName === ""}
                      errorBorderColor="crimson"
                      name="bankName"
                      placeholder="Bank Name"
                    />
                    <ErrorMessage
                      name="bankName"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Bank Address <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      isInvalid={values?.bankAddress === ""}
                      errorBorderColor="crimson"
                      onChange={handleChange}
                      value={values?.bankAddress}
                      name="bankAddress"
                      placeholder="Bank Address"
                    />
                    <ErrorMessage
                      name="bankAddress"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Account Name <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      isInvalid={values?.accountName === ""}
                      errorBorderColor="crimson"
                      onChange={handleChange}
                      value={values?.accountName}
                      name="accountName"
                      placeholder="Account Name"
                    />
                    <ErrorMessage
                      name="accountName"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Account Number <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      isInvalid={values?.accountNumber === ""}
                      errorBorderColor="crimson"
                      onChange={handleChange}
                      value={values?.accountNumber}
                      name="accountNumber"
                      placeholder="Account Number"
                    />
                    <ErrorMessage
                      name="accountNumber"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      SWIFT/BIC Code <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      isInvalid={values?.swiftCode === ""}
                      errorBorderColor="crimson"
                      onChange={handleChange}
                      value={values?.swiftCode}
                      name="swiftCode"
                      placeholder="SWIFT/BIC Code"
                    />
                    <ErrorMessage
                      name="swiftCode"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      IBAN <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      isInvalid={values?.iban === ""}
                      errorBorderColor="crimson"
                      onChange={handleChange}
                      value={values?.iban}
                      name="iban"
                      placeholder="IBAN"
                    />
                    <ErrorMessage
                      name="iban"
                      component="div"
                      className="text-red"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4 dark:hidden" />
            <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-10">
              <div class="col-span-2  p-4 ">
                <h3 className="font-bold">Business Address</h3>
              </div>
              <div class="col-span-8 rounded-lg bg-white p-4  dark:bg-dark md:col-span-8 lg:col-span-8 xl:col-span-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Street <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.street}
                      name="street"
                      placeholder="Street"
                    />
                    <ErrorMessage
                      name="street"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div className=""></div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      City <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.city}
                      name="city"
                      placeholder="City"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      State/Province <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.state}
                      name="state"
                      placeholder="State/Province"
                    />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Zip/Postal Code <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.zip}
                      name="zip"
                      placeholder="Zip/Postal Code"
                    />
                    <ErrorMessage
                      name="zip"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Country <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values?.country}
                      name="country"
                      placeholder="Country"
                    />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-red"
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-8 dark:hidden" />
            <div class="grid grid-cols-1 gap-4 md:grid-cols-10">
              <div class="col-span-2   "></div>
              <div class="col-span-8   md:col-span-8 lg:col-span-8 xl:col-span-5">
                <div className="flex justify-end gap-4 p-3">
                  <CanceButton onClick={() => router.back()} />
                  <div className="">
                    <Button label=" Update" type="submit" />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default ProfileBox;
