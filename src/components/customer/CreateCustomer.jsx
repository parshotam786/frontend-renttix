"use client";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BaseURL } from "../../../utils/baseUrl";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import Link from "next/link";
import { Button } from "primereact/button";
import CanceButton from "../Buttons/CanceButton";
import { Tag } from "primereact/tag";

const CreateCustomer = () => {
  const toast = useRef();
  const [loading, setloading] = useState(false);
  const { user } = useSelector((state) => state?.authReducer);
  const router = useRouter();
  const [data, setdata] = useState([]);
  const [invoiceRunData, setinvoiceRunData] = useState([]);

  // dropdown state
  const [statusValue, setstatusValue] = useState("");
  const [invoiceRunCodeValue, setinvoiceRunCodeValue] = useState({
    name: "",
  });
  const [paymentTermsValue, setpaymentTermsValue] = useState("");
  const [customerTypeValue, setcustomerTypeValue] = useState("");
  const [taxClassValue, settaxClassValue] = useState("");
  const [industryValue, setindustryValue] = useState("");
  console.log(invoiceRunCodeValue);
  const [formValues, setFormValues] = useState({
    name: "",
    number: "",
    owner: "",
    stop: false,
    active: false,
    cashCustomer: false,
    canTakePayments: false,
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    postCode: "",
    email: "",
    telephone: "",
    fax: "",
    website: "",
    type: "Customer",
    industry: "",
    status: "Active",
    taxClass: "",
    parentAccount: "",
    invoiceRunCode: "",
    paymentTerm: "",
    vendorId: user._id,
  });

  const [image, setImage] = useState(null);
  const [taxClass, settaxClass] = useState([]);
  const { token } = useSelector((state) => state?.authReducer);

  const [imagePreview, setImagePreview] = useState(
    "/images/customers/default-image.png",
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      //   setloading(true);
      const response = await axios.get(`${BaseURL}/payment-terms`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setdata(response.data.data);
      } else {
        console.log(response?.data?.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      //   setloading(true);
      const response = await axios.get(`${BaseURL}/invoice-run-code`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setinvoiceRunData(response.data.data);
      } else {
        console.log(response?.data?.message);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setloading(true);
    try {
      const formData = new FormData();

      // Update formValues with dropdown state values
      const updatedFormValues = {
        ...formValues,
        type: customerTypeValue.name,
        industry: industryValue.name,
        status: statusValue.name,
        taxClass: taxClassValue.name,
        invoiceRunCode: invoiceRunCodeValue._id,
        paymentTerm: paymentTermsValue._id,
      };

      // Add fields to FormData
      formData.append("thumbnail", image);
      Object.keys(updatedFormValues).forEach((key) => {
        formData.append(key, updatedFormValues[key]);
      });

      const response = await axios.post(
        `${BaseURL}/customer/customer/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        router.push(`/customer/listing`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data?.message,
          life: 3000,
        });

        setloading(false);
      }
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      if (error.response.data.error?.Fault?.type === "ValidationFault") {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail:
            error?.response?.data?.error?.Fault?.Error[0]?.Message ||
            "server error",
          life: 3000,
        });
      } else {
        if (user.isQuickBook) {
          window.location.href = `${BaseURL}/auth?vendorId=${user._id}&redirctURL=${window.location.href}`;
        }
      }
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message,
        life: 3000,
      });

      console.error(
        "Error submitting form:",
        error?.response?.data?.error?.Fault?.type || "server error",
      );
      setloading(false);
    }
  };

  useEffect(() => {
    const fetchTaxClass = async () => {
      try {
        const response = await axios.get(`${BaseURL}/tax-classes/account`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        settaxClass(response?.data?.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTaxClass();
  }, []);

  const isPaymentTermID = data?.filter(
    (item) => item._id === formValues.paymentTerm,
  );

  const invoiceRun = invoiceRunData?.filter(
    (item) => item._id === formValues.invoiceRunCode,
  );

  console.log(isPaymentTermID);
  return (
    <div>
      <Toast ref={toast} position="top-right" />

      <div class="mt-5 grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          {/* <h3 className="font-bold">Upload Product Photos </h3> */}
        </div>
        <div class="col-span-5  p-4">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex  flex-col items-start gap-2">
              <div className="">
                <img
                  src={imagePreview}
                  alt="default-image"
                  className="min-h-50 w-50 min-w-50"
                />
              </div>
              <div className="mt-2 flex items-center justify-center">
                <InputText
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="upload-image"
                />
              </div>
            </div>
            <div
              onClick={() => document.getElementById("upload-image").click()}
              className="flex cursor-pointer items-center justify-center border-[2px] border-dashed border-dark-6 "
            >
              <label htmlFor="" className="opacity-50">
                {" "}
                Upload Image
              </label>
            </div>
          </div>
        </div>
      </div>
      <hr className="hr my-6" />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-10">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Information</h3>
        </div>
        <div class="col-span-8 rounded-lg bg-white p-4  dark:bg-dark md:col-span-8 lg:col-span-8 xl:col-span-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label>Name</label>
              <InputText
                placeholder="Required"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </div>
            <div className=""></div>
            <div>
              <label>Number</label>
              <InputText
                placeholder=""
                name="number"
                value={formValues.number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Owner</label>
              <InputText
                placeholder="Required"
                name="owner"
                value={formValues.owner}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-1">
            <div className=" flex justify-between">
              <div className="flex flex-col items-center justify-center gap-2">
                <label>On Stop</label>
                <InputSwitch
                  colorScheme="orange"
                  size="lg"
                  name="onStop"
                  checked={formValues.onStop}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <label>Active</label>
                <InputSwitch
                  colorScheme="orange"
                  size="lg"
                  name="active"
                  checked={formValues.active}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <label>Cash Customer</label>
                <InputSwitch
                  colorScheme="orange"
                  size="lg"
                  name="cashCustomer"
                  checked={formValues.cashCustomer}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <label>Can Take Payments</label>
                <InputSwitch
                  colorScheme="orange"
                  size="lg"
                  name="canTakePayments"
                  checked={formValues.canTakePayments}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <hr className="hr my-6" />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-10">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Address</h3>
        </div>
        <div class="col-span-8 rounded-lg bg-white p-4  dark:bg-dark md:col-span-8 lg:col-span-8 xl:col-span-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
            <div className="flex">
              <div className="w-full">
                <label>Address Line 1</label>
                <div className="flex flex-col gap-4">
                  <InputText
                    placeholder="Address Line 1"
                    name="addressLine1"
                    value={formValues.addressLine1}
                    onChange={handleInputChange}
                  />
                  <InputText
                    placeholder="Address Line 2"
                    name="addressLine2"
                    value={formValues.addressLine2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="">
                <InputText
                  placeholder="City"
                  name="city"
                  value={formValues.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <InputText
                  placeholder="Country"
                  name="country"
                  value={formValues.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <InputText
                  placeholder="Postcode"
                  name="postCode"
                  value={formValues.postCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex">
                <div className="w-full">
                  <label>Email</label>
                  <div className="flex flex-col gap-2">
                    <InputText
                      placeholder=""
                      name="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="">
                <label>Telephone</label>
                <InputText
                  placeholder=""
                  name="telephone"
                  value={formValues.telephone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="">
                <label>Fax</label>
                <InputText
                  placeholder=""
                  name="fax"
                  value={formValues.fax}
                  onChange={handleInputChange}
                />
              </div>

              <div className="">
                <label>Website</label>
                <InputText
                  placeholder=""
                  name="website"
                  value={formValues.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Detail */}
      <hr className="hr my-6" />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-10">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Detail</h3>
        </div>
        <div class="col-span-8 rounded-lg bg-white p-4  dark:bg-dark md:col-span-8 lg:col-span-8 xl:col-span-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex">
              <div className="w-full">
                <label>Type</label>
                <div className="flex flex-col gap-2">
                  <Dropdown
                    className="w-full"
                    placeholder="Select option"
                    name="customerTypeValue"
                    value={customerTypeValue}
                    onChange={(e) => setcustomerTypeValue(e.value)}
                    options={[
                      { name: "Customer", _id: "1" },
                      { name: "Partner", _id: "2" },
                      { name: "Reseller", _id: "3" },
                      { name: "Supplier", _id: "4" },
                      { name: "Sub-Contractor", _id: "4" },
                    ]}
                    optionLabel="name"
                    checkmark={true}
                    highlightOnSelect={false}
                  />
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="w-full">
                <label>Status</label>
                <div className="flex flex-col gap-2">
                  <Dropdown
                    className="w-full"
                    placeholder="Select option"
                    name="statusValue"
                    value={statusValue}
                    onChange={(e) => setstatusValue(e.value)}
                    options={[
                      { name: "Active", _id: "1" },
                      { name: "Inactive", _id: "2" },
                    ]}
                    optionLabel="name"
                    checkmark={true}
                    highlightOnSelect={false}
                  />
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="w-full">
                <label>Industry</label>
                <div className="flex flex-col gap-2">
                  <Dropdown
                    className="w-full"
                    placeholder="Select option"
                    name="industryValue"
                    value={industryValue}
                    onChange={(e) => setindustryValue(e.value)}
                    options={[
                      { name: "Agriculture", _id: "1" },
                      { name: "Plant and Tools", _id: "2" },
                      { name: "Automotive", _id: "3" },
                      { name: "Others", _id: "4" },
                    ]}
                    optionLabel="name"
                    checkmark={true}
                    highlightOnSelect={false}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-start gap-4">
              <div className="w-full">
                <Link
                  href={"/system-setup/tax-classes"}
                  className=" block text-[0.9em] text-blue-500"
                >
                  Tax Class
                </Link>
                <Dropdown
                  className="w-full"
                  placeholder="Select option"
                  name="taxClassValue"
                  value={taxClassValue}
                  onChange={(e) => settaxClassValue(e.value)}
                  options={taxClass}
                  optionLabel="name"
                  checkmark={true}
                  highlightOnSelect={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Additional Info */}
      <hr className="hr my-6" />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-10">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Additional Info</h3>
        </div>
        <div class="col-span-8 rounded-lg bg-white p-4  dark:bg-dark md:col-span-8 lg:col-span-8 xl:col-span-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex">
              <div className="w-full">
                <label>Parent Account</label>
                <div className="flex flex-col gap-2">
                  <InputText
                    name="parentAccount"
                    value={formValues.parentAccount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="w-full">
                <Link
                  className="text-[#337ab7]"
                  href={"/system-setup/invoice-run-code"}
                >
                  <label>Invoice Run Code</label>
                </Link>
                <div className="flex flex-col gap-2">
                  <Dropdown
                    className="w-full"
                    placeholder="Select option"
                    name="invoiceRunCodeValue"
                    value={invoiceRunCodeValue}
                    onChange={(e) => setinvoiceRunCodeValue(e.value)}
                    options={invoiceRunData}
                    optionLabel="name"
                    checkmark={true}
                    highlightOnSelect={false}
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <Link
                className="text-[#337ab7]"
                href={"/system-setup/payment-terms"}
              >
                <label>Payment Term</label>
              </Link>
              <div className="flex flex-col gap-2">
                <Dropdown
                  className="w-full"
                  placeholder="(No Payment Term)"
                  name="paymentTermsValue"
                  value={paymentTermsValue}
                  onChange={(e) => setpaymentTermsValue(e.value)}
                  options={data}
                  optionLabel="name"
                  checkmark={true}
                  highlightOnSelect={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="hr my-6" />
      <div class="mt-5 grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          {/* <h3 className="font-bold">Upload Product Photos </h3> */}
        </div>
        <div class="col-span-5  p-4">
          <div className="flex justify-end gap-7 ">
            <div className="">
              <CanceButton onClick={() => router.back()} />
            </div>
            <div className="">
              <Button
                loading={loading}
                disabled={
                  // invoiceRunCodeValue?.name == "" ||
                  // paymentTermsValue.name == ""
                  //   ? true
                  //   : false
                  formValues.name === "" || formValues.email === ""
                }
                label="Save"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomer;
