"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BaseURL } from "../../../../utils/baseUrl";
import CanceButton from "@/components/Buttons/CanceButton";

const CreateRateDefination = () => {
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rentalDaysPerWeek: 1,
    minimumRentalPeriod: 1,
    rateType: "Percentage",
    isActive: false,
    dayRates: Array(7).fill({ active: false, rate: "" }),
  });

  const toast = React.useRef(null);
  const router = useRouter();
  const { token } = useSelector((state) => state?.authReducer);

  const handleChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const handleSwitchChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleDayRateChange = (index, field, value) => {
    const updatedDayRates = formData.dayRates.map((day, i) =>
      i === index ? { ...day, [field]: value } : day,
    );
    setFormData({
      ...formData,
      dayRates: updatedDayRates,
    });
  };

  const handleSubmit = async () => {
    setloading(true);
    try {
      const response = await axios.post(
        `${BaseURL}/rate-definition`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );
      router.push("/system-setup/rate-definition/");
      setloading(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: response.data?.message,
        life: 2000,
      });
    } catch (error) {
      setloading(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data?.message,
        life: 2000,
      });
    }
  };

  return (
    <div className="rounded-lg p-5">
      <Toast ref={toast} />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-12 ">
        <div class="col-span-12 p-4  lg:col-span-3 xl:col-span-2 ">
          <h3 className="font-bold">New Rate Definition</h3>
        </div>
        <div class="col-span-12 rounded-lg bg-white p-4 dark:bg-dark md:col-span-12 md:w-[100%] lg:col-span-9 lg:w-[100%]  xl:col-span-9 xl:w-[70%] 2xl:w-[70%]">
          <div className="grid gap-4">
            {/* Name */}
            <div className="field">
              <label
                className=" text-[0.9em] font-bold text-black"
                htmlFor="name"
              >
                Name
              </label>
              <InputText
                id="name"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
              />
            </div>

            {/* Description */}
            <div className="field">
              <label
                className=" text-[0.9em] font-bold text-black"
                htmlFor="description"
              >
                Description
              </label>
              <InputTextarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange(e, "description")}
                rows={3}
              />
            </div>

            {/* Rate Type and Active */}

            <div className="align-items-center flex  justify-between">
              <div className="align-items-center flex  gap-14">
                <div className="field-radiobutton flex items-center justify-center gap-4">
                  <RadioButton
                    inputId="percentage"
                    name="rateType"
                    value="Percentage"
                    onChange={(e) => handleChange(e, "rateType")}
                    checked={formData.rateType === "Percentage"}
                  />
                  <label
                    className=" text-[0.9em] font-bold text-black"
                    htmlFor="percentage"
                  >
                    Percentage
                  </label>
                </div>
                <div className="field-radiobutton flex items-center justify-center gap-4">
                  <RadioButton
                    inputId="amount"
                    name="rateType"
                    value="Amount"
                    onChange={(e) => handleChange(e, "rateType")}
                    checked={formData.rateType === "Amount"}
                  />
                  <label
                    className=" text-[0.9em] font-bold text-black"
                    htmlFor="amount"
                  >
                    Amount
                  </label>
                </div>
              </div>
              <div className="align-items-center flex items-center justify-center  gap-4">
                <label
                  className=" text-[0.9em] font-bold text-black"
                  htmlFor="isActive"
                >
                  Active
                </label>
                <InputSwitch
                  checked={formData.isActive}
                  onChange={(e) => handleSwitchChange("isActive", e.value)}
                />
              </div>
            </div>
            <hr />

            {/* Day Rates */}
            <div className="grid gap-2">
              {formData.dayRates.map((day, index) => (
                <div key={index} className="align-items-center flex gap-4">
                  <label className=" text-[0.9em] font-bold text-black">
                    Day {index + 1}
                  </label>
                  <InputSwitch
                    checked={day.active}
                    onChange={(e) =>
                      handleDayRateChange(index, "active", e.value)
                    }
                  />
                  <InputNumber
                    value={day.rate}
                    disabled={!day.active}
                    onValueChange={(e) =>
                      handleDayRateChange(index, "rate", e.value)
                    }
                    placeholder="Rate"
                    suffix={formData.rateType === "Percentage" ? "%" : ""}
                  />
                </div>
              ))}
            </div>
            <hr />
            {/* Rental Days Per Week */}
            <div className="field flex flex-col">
              <label
                className=" text-[0.9em] font-bold text-black"
                htmlFor="rentalDaysPerWeek"
              >
                Rental Days Per Week
              </label>
              <InputNumber
                id="rentalDaysPerWeek"
                value={formData.rentalDaysPerWeek}
                onValueChange={(e) => handleChange(e, "rentalDaysPerWeek")}
                min={1}
                max={7}
              />
            </div>

            {/* Minimum Rental Period */}
            <div className="field flex flex-col">
              <label
                className=" text-[0.9em] font-bold text-black"
                htmlFor="minimumRentalPeriod"
              >
                Minimum Rental Period
              </label>
              <InputNumber
                id="minimumRentalPeriod"
                value={formData.minimumRentalPeriod}
                onValueChange={(e) => handleChange(e, "minimumRentalPeriod")}
                placeholder="Days"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-5">
              <div className="">
                <CanceButton onClick={() => router.back()} />
              </div>
              <Button
                label="Add Rate Definition"
                loading={loading}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRateDefination;
