"use client";

import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { BaseURL } from "../../../utils/baseUrl";
import GoBackButton from "../Buttons/GoBackButton";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
const todayDate = new Date();
const formattedDate = todayDate.toISOString().split("T")[0];
const InvoiceRun = () => {
  const [invoiceRunData, setInvoiceRunData] = useState([]);
  const [loading, setloading] = useState(false);

  const [invoiceRunCodeCValue, setinvoiceRunCodeCValue] = useState({});
  const toast = useRef();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Invoice Run -" + moment().format("L") + " " + moment().format("LT"),
    invoiceStartDate: formattedDate,
    invoiceUptoDate: formattedDate,
    description: "",
    invoiceRunCode: "",
  });

  const { token } = useSelector((state) => state?.authReducer);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BaseURL}/invoice-run-code`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setInvoiceRunData(response.data.data);
        } else {
          console.log(response?.data?.message);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [token]);

  const handleInvoiceRunCodeChange = (e) => {
    setinvoiceRunCodeCValue(e.value); // Update selected value
    setFormData({ ...formData, invoiceRunCode: e.value?.name || "" }); // Update formData
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setloading(true);

    try {
      const response = await axios.post(
        `${BaseURL}/invoice/invoice-run`,
        { ...formData },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setloading(false);
        router.push("/invoicing/invoice-batch");
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data?.message,
          life: 3000,
        });
      } else {
        setloading(false);
        console.log(response?.data?.message);
      }
    } catch (error) {
      setloading(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data?.message,
        life: 3000,
      });

      console.log("Error submitting invoice run:", error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Invoice Run" />
      <Toast ref={toast} position="top-right" />
      <div class="grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Name and Description</h3>
        </div>
        <div class="col-span-8 bg-white p-4 md:col-span-8 lg:col-span-8 xl:col-span-5">
          <div>
            <div className=" rounded-lg bg-white p-6">
              <div className="mt-8 flex flex-col gap-2">
                <label>Name</label>
                <InputText
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="my-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label>Invoice Date</label>
                  <InputText
                    name="invoiceStartDate"
                    type="date"
                    value={formData.invoiceStartDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Invoice up to Date</label>
                  <InputText
                    name="invoiceUptoDate"
                    type="date"
                    value={formData.invoiceUptoDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Description</label>
                <InputTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="my-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label>Invoice Run Code</label>
                  <Dropdown
                    placeholder="Select option"
                    name="invoiceRunCodeCValue"
                    value={invoiceRunCodeCValue}
                    onChange={handleInvoiceRunCodeChange}
                    showClear
                    options={invoiceRunData}
                    optionLabel="name"
                    className="md:w-14rem w-full"
                  />
                </div>
              </div>
              <div className="flex items-end justify-end">
                <div className="flex gap-4">
                  <GoBackButton title="Cancel" />
                  <Button
                    label="Invoice Run"
                    loading={loading}
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceRun;
