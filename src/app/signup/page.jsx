"use client";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import _ from "lodash";
import * as Yup from "yup";
import { Toast } from "primereact/toast";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import CheckboxOne from "@/components/FormElements/Checkboxes/CheckboxOne";
import { BaseURL } from "../../../utils/baseUrl";
import useFormValidation from "@/hooks/useFormValidation";
const StepIndicator = ({ step, currentStep, label }) => (
  <div className="flex cursor-pointer items-center gap-2 pt-10">
    {currentStep > step ? (
      <div className="bg-orangecolor rounded-full">
        <i
          className="pi pi-check-circle font-bold text-orange-500"
          style={{ fontSize: "2rem" }}
        ></i>
      </div>
    ) : (
      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-[#FF6A00] bg-white">
        {step}
      </div>
    )}
    <h3 className="font-semibold">{label}</h3>
  </div>
);

const NavigationButtons = ({
  isConfrim = true,
  onBack,
  onNext,
  nextLabel = "Continue",
  value,
}) => {
  const isDisable = Object?.values(value)?.some((item) => item === "");

  return (
    <div className="mt-6 flex gap-10 p-3">
      {onBack && (
        <Button
          type="button"
          severity="warning"
          icon="pi pi-arrow-left"
          iconPos="left"
          onClick={onBack}
          label="Go Back"
          rounded
        />
      )}
      {onNext && (
        <Button
          disabled={!isConfrim || isDisable}
          type="button"
          onClick={onNext}
          icon="pi pi-arrow-right"
          label={nextLabel}
          severity="warning"
          iconPos="right"
          rounded
        />
      )}
    </div>
  );
};

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required("Company Name is required"),
  legalName: Yup.string().required("Legal Name is required"),
  businessType: Yup.string().required("Business Type is required"),
  taxId: Yup.string().required("Tax Identification Number is required"),

  primaryContact: Yup.string().required("Primary Contact Person is required"),
  primaryPhone: Yup.string().required("Phone Number is required"),
  password: Yup.string().required("Password is required"),
  email: Yup.string().required("Email Address is required"),
  // .email("Invalid email format"),

  city: Yup.string().required("City is required"),
  state: Yup.string().required("State/Province is required"),
  zip: Yup.string().required("Zip/Postal Code is required"),
  country: Yup.string().required("Country is required"),

  // bankName: Yup.string().required("Bank Name is required"),
  // bankAddress: Yup.string().required("Bank Address is required"),
  // accountName: Yup.string().required("Account Name is required"),
  // accountNumber: Yup.string().required("Account Number is required"),
  // swiftCode: Yup.string().required("SWIFT/BIC Code is required"),
  // iban: Yup.string().required("IBAN is required"),

  declaration: Yup.string("You must agree to the declaration"),
  signature: Yup.string().required("Signature is required"),
  name: Yup.string().required("Name is required"),
});
const Page = () => {
  const [step, setStep] = useState(1);
  const [checked, setChecked] = useState(false);
  const toast = useRef(null);
  const [message, setmessage] = useState("");
  const [address, setlAddress] = useState({});
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [isExistEmail, setisExistEmail] = useState("");
  const [typeEmail, settypeEmail] = useState("");
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [isread, setisread] = useState(false);
  const router = useRouter();
  const [formValidation, setformValidation] = useState({});
  console.log(formValidation, "kk");

  console.log(address.country, "exist");
  const initialValues = {
    companyName: "",
    legalName: "",
    businessType: "",
    taxId: "",
    primaryContact: "",
    primaryPhone: "",
    email: "",
    password: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    // bankName: "",
    // bankAddress: "",
    // accountName: "",
    // accountNumber: "",
    // swiftCode: "",
    // iban: "",
    declaration: checked,
    signature: "",
    name: "",
  };

  const debouncedSearch = useDebounce(typeEmail, 1000); // Add debounce with a 500ms delay

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(`${BaseURL}/vender-verify`, {
          email: debouncedSearch,
        });
        setisExistEmail(response.data);
      } catch (err) {
        console.log(err);
        setisExistEmail(err.response.data);
      }
    };
    if (debouncedSearch != "") {
      fetchCategories();
    }
  }, [debouncedSearch]);

  console.log(isExistEmail, "isExistemail");
  console.log(initialValues, "showw");

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`${BaseURL}/vender-register`, values);
      toast.current.show({
        severity: "success",
        summary: "Info",
        detail: response.data?.message,
      });

      if (response.data?.success) {
        // window.location.href = "/";
        router.push("/auth/login");
      }

      setmessage(response.data.error);
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data.message);

      toast.current.show({
        severity: "error",
        summary: "Info",
        detail: error.response.data.message,
      });
      console.error("Error registering vendor:", error);
      // Handle error response (e.g., show an error message)
    }
  };

  const handleInputChange = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.get(
          `https://api.positionstack.com/v1/forward`,
          {
            params: {
              access_key: "1c433a0a7564f3a31e7707928cf83a88",
              query: e.target.value,
              limit: 5,
            },
          },
        );
        setLocations(response.data.data);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Info",
          detail: error.response.data.error.message,
        });
        console.error("Error fetching location data:", error);
      }
    } else {
      setLocations([]);
    }
  };

  const handleLocationSelect = (location, setFieldValue) => {
    setisread(true);
    // Update form fields with the selected location data
    setQuery(`${location.name}, ${location.region}, ${location.country}`);
    setFieldValue(
      "street",
      `${location.name}, ${location.region}, ${location.country}`,
    );
    setFieldValue("city", location.county); // Adjust based on API response
    setFieldValue("state", location.region); // Adjust based on API response
    setFieldValue("country", location.country);
    setFieldValue("declaration", checked);

    // Close the location dropdown
    setLocations([]);
  };
  const clearAddress = (setFieldValue) => {
    setisread(false);
    setFieldValue("street", "");
    setFieldValue("city", "");
    setFieldValue("state", "");
    setFieldValue("zip", "");
    setFieldValue("country", "");
    setlAddress({});
    setQuery("");
  };

  function isAnyFieldFilled(detail) {
    // Use Object.values to get an array of values and check if any value is not an empty string
    return Object.values(detail).some((value) => value !== "");
  }
  return (
    <div className="flex">
      <Toast ref={toast} />
      <div className="h-screen w-[20%] bg-[url('/images/register/sidebar.svg')] bg-cover bg-center">
        <div className="my-7 flex items-center justify-center">
          <Link href="/">
            <img src="/images/logo/logo.svg" alt="" />
          </Link>
        </div>
      </div>
      <div className="h-screen w-[20%] bg-[#fef0ef] pt-20">
        <div className="ml-10 flex flex-col justify-center">
          <StepIndicator
            step={1}
            currentStep={step}
            label="Company Information"
          />
          <StepIndicator
            step={2}
            currentStep={step}
            label="Contact Information"
          />
          <StepIndicator step={3} currentStep={step} label="Business Address" />
          {/* <StepIndicator
            step={4}
            currentStep={step}
            label="Banking Information"
          /> */}
          <StepIndicator
            step={4}
            currentStep={step}
            label="Declaration & Signature"
          />
        </div>
        <div className="my-4 p-10">
          <div className="flex pt-8">
            {/* <h3 className=" font-semibold flex gap-1">
              Already have an account?{" "}
              {!isAnyFieldFilled(formValidation) ? (
                <Link href="/auth/login" className="text-orangecolor">
                  <span> Sign In</span>
                </Link>
              ) : (
                <ConfrimDialogeBox />
              )}
            </h3> */}
          </div>
        </div>
      </div>
      <div className="w-[60%] bg-white pl-8 pt-20">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => {
            // useFormValidation(values, setformValidation);
            return (
              <Form>
                {step === 1 && (
                  <div className="w-[60%]">
                    <h3 className="text-2xl font-bold">Company Information</h3>
                    <div className="p-3">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Company Name <span className="text-red">*</span>
                      </label>
                      <Field
                        as={InputText}
                        onChange={handleChange}
                        className="w-full"
                        value={values.companyName}
                        name="companyName"
                        placeholder="Company Name"
                      />
                      <ErrorMessage
                        name="companyName"
                        component="div"
                        className="text-red"
                      />
                    </div>
                    <div className="flex gap-4 p-3">
                      <div className="w-[60%]">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Legal Name <span className="text-red">*</span>
                        </label>
                        <Field
                          as={InputText}
                          className="w-full"
                          onChange={handleChange}
                          value={values.legalName}
                          name="legalName"
                          placeholder="Legal Name"
                        />
                        <ErrorMessage
                          name="legalName"
                          component="div"
                          className="text-red"
                        />
                      </div>
                      <div className="w-[40%]">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Business Type
                        </label>
                        <Field
                          as={InputText}
                          onChange={handleChange}
                          value={values.businessType}
                          className="w-full"
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
                    <div className="p-3">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Tax Identification Number{" "}
                        <span className="text-red">*</span>
                      </label>
                      <Field
                        as={InputText}
                        onChange={handleChange}
                        value={values.taxId}
                        className="w-full"
                        name="taxId"
                        placeholder="Tax Identification Number"
                      />
                      <ErrorMessage
                        name="taxId"
                        component="div"
                        className=" text-red"
                      />
                    </div>
                    <NavigationButtons
                      value={_.pick(values, [
                        "companyName",
                        "legalName",
                        "businessType",
                        "taxId",
                      ])}
                      onNext={() => setStep(2)}
                    />
                  </div>
                )}
                {step === 2 && (
                  <div className="w-[60%]">
                    <h3 className="text-2xl font-bold">Contact Information</h3>
                    <div className="py-3">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Primary Contact Person{" "}
                        <span className="text-red">*</span>
                      </label>
                      <Field
                        as={InputText}
                        onChange={handleChange}
                        value={values.primaryContact}
                        className="w-full"
                        name="primaryContact"
                        placeholder="Primary Contact Person"
                      />

                      <ErrorMessage
                        name="primaryContact"
                        component="div"
                        className="text-red"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                      <div className="">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Phone Number <span className="text-red">*</span>
                        </label>
                        <Field
                          as={InputText}
                          onChange={handleChange}
                          value={values.primaryPhone}
                          name="primaryPhone"
                          placeholder="Phone Number"
                          className="w-full"
                        />
                        <ErrorMessage
                          name="primaryPhone"
                          component="div"
                          className="text-red"
                        />
                      </div>
                      <div className="w-[100%] ">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Email Address <span className="text-red">*</span>
                        </label>
                        <Field name="email">
                          {({ field, form }) => (
                            <IconField>
                              <InputIcon
                                className={
                                  isExistEmail.success ? "pi pi-check" : ""
                                }
                              >
                                {" "}
                              </InputIcon>
                              <InputText
                                {...field}
                                className="w-full"
                                placeholder="Email Address"
                                onChange={(e) => {
                                  field.onChange(e); // Keep Formik's onChange handler
                                  settypeEmail(e.target.value);
                                }}
                              />
                            </IconField>
                          )}
                        </Field>

                        {typeEmail !== "" && (
                          <h3
                            className={`text-[16px]  ${
                              isExistEmail.success
                                ? "text-green-700"
                                : "text-red"
                            }`}
                          >
                            {isExistEmail.message}
                          </h3>
                        )}

                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red"
                        />
                      </div>

                      <div className="">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Password <span className="text-red">*</span>
                        </label>
                        <IconField>
                          {show ? (
                            <InputIcon
                              onClick={handleClick}
                              className="pi pi-eye"
                            ></InputIcon>
                          ) : (
                            <InputIcon
                              onClick={handleClick}
                              className="pi pi-eye-slash"
                            ></InputIcon>
                          )}
                          <Field
                            as={InputText}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            pr="4.5rem"
                            className="w-full"
                            type={show ? "text" : "password"}
                            placeholder="Enter password"
                          />
                        </IconField>

                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red"
                        />
                      </div>
                      <div className=" ">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Confrim Password <span className="text-red">*</span>
                        </label>
                        <IconField>
                          {show ? (
                            <InputIcon
                              onClick={handleClick}
                              className="pi pi-eye"
                            ></InputIcon>
                          ) : (
                            <InputIcon
                              onClick={handleClick}
                              className="pi pi-eye-slash"
                            ></InputIcon>
                          )}
                          <Field
                            as={InputText}
                            onChange={handleChange}
                            value={values.confrimPassword}
                            className="w-full"
                            name="confrimPassword"
                            placeholder="Confrim Password"
                            pr="4.5rem"
                            type={show ? "text" : "password"}
                          />
                        </IconField>

                        {values.password !== "" && (
                          <h3
                            className={
                              values.password != values.confrimPassword
                                ? "text-[16px] text-red"
                                : "text-[16px] font-semibold text-green-600"
                            }
                          >
                            {values.confrimPassword !== ""
                              ? values.password != values.confrimPassword
                                ? "Passwords Do Not Match!"
                                : "Passwords Match!"
                              : ""}
                          </h3>
                        )}
                      </div>
                    </div>

                    <NavigationButtons
                      isConfrim={values.password === values.confrimPassword}
                      value={_.pick(values, [
                        "primaryContact",
                        "primaryPhone",
                        "password",
                        "confrimPassword",
                        "email",
                      ])}
                      onBack={() => setStep(1)}
                      onNext={() => setStep(3)}
                    />
                  </div>
                )}
                {step === 3 && (
                  <div className="w-[60%]">
                    <h3 className="text-2xl font-bold">Business Address</h3>
                    <div className="relative p-3">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Street <span className="text-red">*</span>
                      </label>
                      <IconField>
                        {query.length != "" ? (
                          <InputIcon
                            className="pi pi-times cursor-pointer text-2xl"
                            onClick={() => clearAddress(setFieldValue)}
                            color="orange.500"
                          ></InputIcon>
                        ) : (
                          <InputIcon className="pi pi-search"> </InputIcon>
                        )}

                        <Field
                          as={InputText}
                          isReadOnly={isread}
                          // onChange={handleChange}
                          // value={values.street}
                          value={query}
                          className=" w-full truncate"
                          onChange={handleInputChange}
                          name="street"
                          placeholder="Street"
                        />
                      </IconField>
                      {/* <InputGroup>
                        <Field
                          as={InputText}
                          isReadOnly={isread}
                          // onChange={handleChange}
                          // value={values.street}
                          value={query}
                          className=" truncate"
                          onChange={handleInputChange}
                          name="street"
                          placeholder="Street"
                        />
                        <InputRightElement>
                          {query.length != "" ? (
                            <SmallCloseIcon
                              className=" cursor-pointer text-2xl"
                              onClick={() => clearAddress(setFieldValue)}
                              color="orange.500"
                            />
                          ) : (
                            <Search2Icon color="orange.500" />
                          )}
                        </InputRightElement>
                      </InputGroup> */}

                      {locations.length !== 0 && (
                        <div
                          className={`absolute z-999999 h-auto w-auto overflow-x-auto rounded-xl border bg-gray  px-3 py-1 `}
                        >
                          <ol className="text-[16px]">
                            {locations.map((location, index) => (
                              <li
                                className={`${
                                  index == locations.length - 1
                                    ? ""
                                    : "border-b-2 "
                                } cursor-pointer py-1`}
                                key={index}
                                onClick={() =>
                                  handleLocationSelect(location, setFieldValue)
                                } // Update values on selection
                              >
                                {location.name}, {location.region},
                                {location.contry},{location.country}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      <ErrorMessage
                        name="street"
                        component="div"
                        className="text-red"
                      />
                    </div>

                    <div className="flex gap-4 p-3">
                      <div className="w-[50%]">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          City <span className="text-red">*</span>
                        </label>
                        <Field
                          as={InputText}
                          onChange={handleChange}
                          value={values.city}
                          className="w-full"
                          name="city"
                          placeholder="City"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red"
                        />
                      </div>
                      <div className="w-[50%]">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          State/Province <span className="text-red">*</span>
                        </label>
                        <Field
                          as={InputText}
                          onChange={handleChange}
                          value={values.state}
                          className="w-full"
                          name="state"
                          placeholder="State/Province"
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 p-3">
                      <div className="w-[50%]">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Zip/Postal Code <span className="text-red">*</span>
                        </label>
                        <Field
                          as={InputText}
                          onChange={handleChange}
                          className="w-full"
                          value={values.zip}
                          name="zip"
                          placeholder="Zip/Postal Code"
                        />
                        <ErrorMessage
                          name="zip"
                          component="div"
                          className="text-red"
                        />
                      </div>
                      <div className="w-[50%]">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Country <span className="text-red">*</span>
                        </label>
                        <Field
                          as={InputText}
                          onChange={handleChange}
                          className="w-full"
                          value={values.country}
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
                    <NavigationButtons
                      value={_.pick(values, [
                        "street",
                        "city",
                        "state",
                        "zip",
                        "country",
                      ])}
                      onBack={() => setStep(2)}
                      onNext={() => setStep(4)}
                    />
                  </div>
                )}
                {/* {step === 4 && (
                <div className="w-[60%]">
                  <h3 className="font-bold text-2xl">
                    Banking Information
                  </h3>
                  <div className="p-3">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Bank Name <span className="text-red">*</span>
                    </label>
                    <Field
                      onChange={handleChange}
                      value={values.bankName}
                      as={InputText}
                      name="bankName"
                      placeholder="Bank Name"
                    />
                    <ErrorMessage
                      name="bankName"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div className="p-3">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Bank Address <span className="text-red">*</span>
                    </label>
                    <Field
                      as={InputText}
                      onChange={handleChange}
                      value={values.bankAddress}
                      name="bankAddress"
                      placeholder="Bank Address"
                    />
                    <ErrorMessage
                      name="bankAddress"
                      component="div"
                      className="text-red"
                    />
                  </div>
                  <div className="flex p-3 gap-4">
                    <div className="w-[60%]">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Account Name <span className="text-red">*</span>
                      </label>
                      <Field
                        as={InputText}
                        onChange={handleChange}
                        value={values.accountName}
                        name="accountName"
                        placeholder="Account Name"
                      />
                      <ErrorMessage
                        name="accountName"
                        component="div"
                        className="text-red"
                      />
                    </div>
                    <div className="w-[40%]">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Account Number <span className="text-red">*</span>
                      </label>
                      <Field
                        as={InputText}
                        onChange={handleChange}
                        value={values.accountNumber}
                        name="accountNumber"
                        placeholder="Account Number"
                      />
                      <ErrorMessage
                        name="accountNumber"
                        component="div"
                        className="text-red"
                      />
                    </div>
                  </div>
                  <div className="flex p-3 gap-4">
                    <div className="w-[60%]">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        SWIFT/BIC Code <span className="text-red">*</span>
                      </label>
                      <Field
                        as={InputText}
                        onChange={handleChange}
                        value={values.swiftCode}
                        name="swiftCode"
                        placeholder="SWIFT/BIC Code"
                      />
                      <ErrorMessage
                        name="swiftCode"
                        component="div"
                        className="text-red"
                      />
                    </div>
                    <div className="w-[40%]">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        IBAN <span className="text-red">*</span>
                      </label>
                      <Field
                        as={InputText}
                        onChange={handleChange}
                        value={values.iban}
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
                  <NavigationButtons
                    value={_.pick(values, [
                      "bankName",
                      "bankAddress",
                      "accountName",
                      "accountNumber",
                      "swiftCode",
                      "iban",
                    ])}
                    onBack={() => setStep(3)}
                    onNext={() => setStep(5)}
                  />
                </div>
              )} */}
                {step === 4 && (
                  <div className="flex w-[60%] flex-col gap-4">
                    <label className="text-2xl font-bold">
                      Declarations and Signature
                    </label>
                    <div className="pl-3">
                      {/* <Field
                        as={Checkbox}
                        onChange={handleChange}
                        value={values.declaration}
                        name="declaration"
                      >
                        I agree to comply with the company’s vendor policies and
                        procedures.
                      </Field> */}
                      <div className="align-items-center flex">
                        <Field
                          as={CheckboxOne}
                          invalid={!checked}
                          onChange={(e) => setChecked(e.checked)}
                          checked={checked}
                        />
                        <label className="ml-2">
                          {" "}
                          I agree to comply with the company’s vendor policies
                          and procedures.
                        </label>
                      </div>
                      <ErrorMessage
                        name="declaration"
                        component="div"
                        className="text-red"
                      />
                    </div>

                    <div className="flex flex-col gap-1 p-3">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Signature <span className="text-red">*</span>
                      </label>
                      <div className="w-[70%]">
                        <Field
                          name="signature"
                          placeholder="Signature..."
                          className="w-full"
                          as={InputTextarea}
                          sx={{ borderColor: "gray.200 !important" }}
                        />
                        <ErrorMessage
                          name="signature"
                          component="div"
                          className="text-red"
                        />
                      </div>
                      <div className="w-[70%]">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Name <span className="text-red">*</span>
                        </label>
                        <Field
                          as={InputText}
                          onChange={handleChange}
                          value={values.name}
                          className="w-full"
                          name="name"
                          placeholder="Enter your name"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red"
                        />
                      </div>
                    </div>
                    <NavigationButtons
                      value={_.pick(values, [
                        "name",
                        "signature",
                        "declaration",
                      ])}
                      onBack={() => setStep(3)}
                      nextLabel="Submit"
                      onNext={handleSubmit}
                    />
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Page;
