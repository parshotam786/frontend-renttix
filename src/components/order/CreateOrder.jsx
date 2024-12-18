"use client";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { BaseURL, imageBaseURL } from "../../../utils/baseUrl";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import useDebounce from "@/hooks/useDebounce";
import { Toast } from "primereact/toast";

import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import GoBackButton from "../Buttons/GoBackButton";

const CreateOrder = () => {
  const [data, setData] = useState([]);
  const toast = useRef(null);
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [isSelected, setisSelected] = useState(false);
  const [error, seterror] = useState(false);
  const { user } = useSelector((state) => state?.authReducer);
  const [paymetTermData, setpaymetTermData] = useState([]);
  const [invoiceRunData, setinvoiceRunData] = useState([]);
  const { token } = useSelector((state) => state?.authReducer);
  const todayDate = new Date();
  const formattedDate = todayDate.toISOString().split("T")[0];
  const [populateDate, setpopulateDate] = useState("");
  const [code, setcode] = useState("");
  const [paymentTermsValue, setpaymentTermsValue] = useState({});
  const [invoiceRunCodeValue, setinvoiceRunCodeValue] = useState({});
  const [depotvalue, setdepotvalue] = useState({});

  console.log(depotvalue.name);

  const [selectedAccount, setselectedAccount] = useState(null);

  const countries = data;

  const [formData, setFormData] = useState({
    account: "",
    billingPlaceName: "",
    address1: "",
    address2: "",
    city: "",
    country: "",
    postcode: "",
    orderDate: formattedDate,
    deliveryPlaceName: "",
    deliveryAddress1: "",
    deliveryAddress2: "",
    deliveryCity: "",
    deliveryCountry: "",
    deliveryPostcode: "",
    deliveryDate: formattedDate,
    chargingStartDate: "",
    useExpectedReturnDate: false,
    expectedReturnDate: "",
    customerReference: "",
    siteContact: "",
    salesPerson: "",
    invoiceInBatch: 0,
    orderedBy: "",

    billingPeriod: "",
    vendorId: user?._id,
    customerId: "",
    cunstomerQuickbookId: "",
  });

  const selectedAccountTemplate = (option, props) => {
    console.log(option, "dddssds");

    if (option) {
      return (
        <div className="align-items-center flex">
          <img
            alt={option.name.name}
            src={`${imageBaseURL}${option.thumbnail}`}
            className={`flag mr-2 flag-${option.name.name.toLowerCase()}`}
            style={{ width: "18px" }}
          />
          <div>{option.name.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };
  useEffect(() => {
    if (selectedAccount == undefined) {
      setFormData({
        ...formData,
        billingPlaceName: "",
        account: "",
        address1: "",
        address2: "",
        city: "",
        country: "",
        postcode: "",
        customerId: "",
        cunstomerQuickbookId: "",
      });
      setpaymentTermsValue("");
      setinvoiceRunCodeValue("");
    } else {
      const {
        name,
        addressLine1,
        addressLine2,
        city,
        country,
        postCode,
        _id,
        customerID,
        invoiceRunCode,
        paymentTerm,
      } = selectedAccount;
      setFormData({
        ...formData,
        billingPlaceName: name?.name || "",
        account: name?.name || "",
        address1: addressLine1 || "",
        address2: addressLine2 || "",
        city: city || "",
        country: country || "",
        postcode: postCode || "",
        customerId: _id || "",
        cunstomerQuickbookId: customerID || "",
      });
      setpaymentTermsValue(paymentTerm?._id || "");
      setinvoiceRunCodeValue(invoiceRunCode?._id || "");
    }
  }, [selectedAccount]);

  const countryOptionTemplate = (option) => {
    return (
      <div className="align-items-center flex">
        <img
          alt={option.name.name}
          src={`${imageBaseURL}${option.thumbnail}`}
          className={`flag mr-2 flag-${option.name.name.toLowerCase()}`}
          style={{ width: "18px" }}
        />
        <div>{option.name.name}</div>
        <div className="ml-4">{option.type}</div>
        {/* <div className="ml-4">{option.active ? "Active" : "Disabled"}</div> */}
      </div>
    );
  };
  useEffect(() => {
    setpopulateDate(formData.deliveryDate);
  }, [formData.deliveryDate]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      chargingStartDate: populateDate,
    }));
  }, [populateDate]);

  const debouncedSearch = useDebounce(formData.account, 500); // Add debounce with a 500ms delay

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleComboBoxChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      account: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${BaseURL}/order/customer?vendorId=${user?._id}&search=${debouncedSearch}&limit=${1000}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setData(result.customers);
      } else {
        seterror(result?.message);
      }
    };
    fetchData();
  }, [debouncedSearch, user]);

  const handleSubmit = async (event) => {
    const orderPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      orderPayload.append(key, value);
    });
    orderPayload.append("invoiceRunCode", invoiceRunCodeValue._id);
    orderPayload.append("paymentTerm", paymentTermsValue._id);
    orderPayload.append("depot", depotvalue.name);
    setloading(true);
    event.preventDefault();

    try {
      const response = await axios.post(
        `${BaseURL}/order/create-order`,
        orderPayload,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        // router.push(`/order/rentalorders/${response.data.data._id}`);
        setloading(false);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data?.message,
          life: 3000,
        });
      } else {
        // Handle error response
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data?.message,
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data?.message,
        life: 3000,
      });
      // Handle network error
      setloading(false);
      console.error("Error submitting order:", error);
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
        setpaymetTermData(response.data.data);
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

  const isPaymentTermID = paymetTermData?.filter(
    (item) => item._id === formData.paymentTerm,
  );

  const invoiceRun = invoiceRunData?.filter(
    (item) => item._id === formData.invoiceRunCode,
  );

  const today = new Date().toISOString().split("T")[0];
  const isRequired = () => {
    return <span className="text-red">*</span>;
  };

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];
  return (
    <div>
      <Breadcrumb pageName="Create Order" />
      <Toast ref={toast} position="top-right" />
      <div class="grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Name and Description</h3>
        </div>
        <div class="col-span-8 bg-white p-4 md:col-span-8 lg:col-span-8 xl:col-span-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold  text-black">
                Account {isRequired()}
              </label>
              {/* <InputText
                name="productName"
                placeholder="Product Name"
                value={formData.productName}
                onChange={handleInputChange}
              /> */}
              <Dropdown
                value={selectedAccount}
                onChange={(e) => setselectedAccount(e.value)}
                options={countries}
                optionLabel="name"
                placeholder="Select a Country"
                showClear
                filter
                valueTemplate={selectedAccountTemplate}
                itemTemplate={countryOptionTemplate}
                className="md:w-14rem w-full"
              />

              {error && formData.productName == ""
                ? formData.productName == "" && (
                    <label className="text-[0.8em] text-red">
                      Product name is required.
                    </label>
                  )
                : ""}
            </div>
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                Order Date {isRequired()}
              </label>
              <InputText
                name="orderDate"
                type="date"
                min={today}
                value={formData.orderDate}
                onChange={handleInputChange}
              />

              {formData.orderDate === "" && (
                <label className="text-[0.8em] text-red">
                  Order Date is required.
                </label>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold  text-black">
                Delivery Date {isRequired()}
              </label>
              <InputText
                isDisabled={formData.orderDate === ""}
                name="deliveryDate"
                type="date"
                min={formData.orderDate}
                value={formData.deliveryDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                Charging Start Date {isRequired()}
              </label>
              <InputText
                isDisabled={formData.deliveryDate === ""}
                name="chargingStartDate"
                type="date"
                min={formData.deliveryDate}
                value={formData.chargingStartDate}
                onChange={handleInputChange}
              />
              {formData.chargingStartDate === "" && (
                <label className="text-[0.8em] text-red">
                  Charging Start Date is required.
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className="my-6" />
      <div class="mt-4 grid grid-cols-10 gap-8">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Addresses</h3>
        </div>
        <div class="col-span-8 bg-white p-4 md:col-span-8 lg:col-span-8 xl:col-span-5">
          <label htmlFor="">Billing Place </label>
          <label className="mt-2.5 block text-[0.9em] font-bold  text-black">
            Address {isRequired()}
          </label>
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <InputText
                name="address1"
                type="text"
                placeholder="Address 1"
                value={formData.address1}
                onChange={handleInputChange}
              />
            </div>
            <div className="">
              <InputText
                name="address2"
                type="text"
                placeholder="Address 2"
                value={formData.address2}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="">
              <InputText
                name="city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
              />
              {formData.city === "" && (
                <label className="text-[0.8em] text-red">
                  City is Required.
                </label>
              )}
            </div>
            <div className="">
              <InputText
                name="country"
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={handleInputChange}
              />
              {formData.country === "" && (
                <label className="text-[0.8em] text-red">
                  Country is Required.
                </label>
              )}
            </div>
            <div className="">
              <InputText
                name="postcode"
                type="number"
                placeholder="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
              />
              {formData.postcode === "" && (
                <label className="text-[0.8em] text-red">
                  Post code is Required.
                </label>
              )}
            </div>
          </div>
          <label htmlFor="">Delivery Place </label>
          <label className="mt-2.5 block text-[0.9em] font-bold  text-black">
            Address {isRequired()}
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <InputText
                name="deliveryAddress1"
                type="text"
                placeholder="Address 1"
                value={formData.deliveryAddress1}
                onChange={handleInputChange}
              />
              {formData.deliveryAddress1 === "" && (
                <label className="text-[0.8em] text-red">
                  Address is Required.
                </label>
              )}
            </div>
            <div className="">
              <InputText
                name="deliveryAddress2"
                type="text"
                placeholder="Address 2"
                value={formData.deliveryAddress2}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="">
              <InputText
                name="deliveryCity"
                type="text"
                placeholder="City"
                value={formData.deliveryCity}
                onChange={handleInputChange}
              />
              {formData.deliveryCity === "" && (
                <label className="text-[0.8em] text-red">
                  City is Required.
                </label>
              )}
            </div>
            <div className="">
              <InputText
                name="deliveryCountry"
                type="text"
                placeholder="Country"
                value={formData.deliveryCountry}
                onChange={handleInputChange}
              />
              {formData.deliveryCountry === "" && (
                <label className="text-[0.8em] text-red">
                  Country is Required.
                </label>
              )}
            </div>
            <div className="">
              <InputText
                name="deliveryPostcode"
                type="number"
                placeholder="Postcode"
                value={formData.deliveryPostcode}
                onChange={handleInputChange}
              />
              {formData.deliveryPostcode === "" && (
                <label className="text-[0.8em] text-red">
                  Post code is Required.
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className="my-5" />
      <div class="grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Details</h3>
        </div>
        <div class="col-span-8 bg-white p-4 md:col-span-8 lg:col-span-8 xl:col-span-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold  text-black">
                Customer Refrence
              </label>
              <InputText
                name="customerReference"
                type="text"
                placeholder="Reference"
                value={formData.customerReference}
                onChange={handleInputChange}
              />
            </div>
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                Order By
              </label>
              <InputText
                name="orderedBy"
                type="text"
                placeholder="Order By"
                value={formData.orderedBy}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold  text-black">
                Depot
              </label>
              <Dropdown
                name="depotvalue"
                value={depotvalue}
                onChange={(e) => setdepotvalue(e.value)}
                options={cities}
                optionLabel="name"
                placeholder="Select a City"
                className="md:w-14rem w-full"
              />
            </div>
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                Sales Person
              </label>
              <InputText
                name="salesPerson"
                placeholder="Enter Sale Person"
                type="text"
                value={formData.salesPerson}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold  text-black">
                Invoice Run Code
              </label>
              <Dropdown
                name="invoiceRunCodeValue"
                value={invoiceRunCodeValue}
                onChange={(e) => setinvoiceRunCodeValue(e.value)}
                options={invoiceRunData}
                optionLabel="name"
                placeholder="Select Code"
                className="md:w-14rem w-full"
              />
            </div>
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                Payment Terms
              </label>
              <Dropdown
                name="paymentTermsValue"
                value={paymentTermsValue}
                onChange={(e) => setpaymentTermsValue(e.value)}
                options={paymetTermData}
                optionLabel="name"
                placeholder="Select Terms"
                className="md:w-14rem w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <hr className="my-5" />
      <div class="mt-5 grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          {/* <h3 className="font-bold">Upload Product Photos </h3> */}
        </div>
        <div class="col-span-5  p-4">
          <div className="flex justify-end gap-7 ">
            <div className="">
              <GoBackButton title="Cancel" />
            </div>
            <div className="">
              <Button label="Save" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
