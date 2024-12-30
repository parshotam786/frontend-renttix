"use client";
import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import { PiPlugFill } from "react-icons/pi";
import axios from "axios";
import { IoArrowBackOutline } from "react-icons/io5";
import { InputTextarea } from "primereact/inputtextarea";
import { BaseURL } from "../../../../../utils/baseUrl";

const IntegrationAccount = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state?.authReducer);
  const [quickBookStatus, setQuickBookStatus] = useState(false);
  const toast = React.useRef(null);

  const startQuickBooksAuth = () => {
    window.location.href = `${BaseURL}/auth?vendorId=${user._id}&redirctURL=${window.location.href}`;
  };

  const RevokeQuickbookAuth = () => {
    setLoading(true);
    axios
      .post(`${BaseURL}/disconnect-quickbook`, {
        vendorId: user._id,
      })
      .then((response) => {
        console.log(response.data);
        setQuickBookStatus(response.data.status);
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "QuickBooks",
          detail: response.data.message,
          life: 2000,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <div className="bg-white p-4">
      <Toast ref={toast} />
      <div className="w-[80%]">
        {/* <GoBackButton title={<IoArrowBackOutline className="text-lg" />} /> */}
        <h2 className="font-bold">Integration: QuickBooks</h2>
        <div className="mt-8 flex">
          <div className="flex w-[20%] items-center justify-center">
            <img
              className="w-32"
              src="/images/QuickBooks.png"
              alt="QuickBooks"
            />
          </div>
          <div className="flex w-[60%] flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <InputText id="name" value="QuickBooks" readOnly />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description">Description</label>
              <InputTextarea
                id="description"
                value="Integrate with QuickBooks accounting software to provide the ability to post your invoices into QuickBooks and keep your accounts and QuickBooks contacts in sync."
                readOnly
                rows={5}
              />
            </div>
          </div>
        </div>
        <hr className="my-9 w-[80%]" />
        <div className="mt-8 flex">
          <div className="flex w-[20%] items-center justify-center">
            <PiPlugFill className="text-[120px] text-[#DDD]" />
          </div>
          <div className="flex w-[60%] flex-col gap-4">
            <div className="flex flex-col">
              <h3
                className={`text-xl font-semibold ${
                  !quickBookStatus && user?.isQuickBook
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {!quickBookStatus && user?.isQuickBook
                  ? "QuickBooks Connected!"
                  : "QuickBooks Not Connected!"}
              </h3>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-3">
                {!quickBookStatus && user?.isQuickBook ? (
                  <Button
                    label="Revoke QuickBooks"
                    loading={loading}
                    style={{ background: "red" }}
                    icon="pi pi-times"
                    className="p-button-danger"
                    onClick={RevokeQuickbookAuth}
                  />
                ) : (
                  <Button
                    label="Connect to QuickBooks"
                    icon="pi pi-check"
                    className="p-button-primary"
                    onClick={startQuickBooksAuth}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationAccount;
