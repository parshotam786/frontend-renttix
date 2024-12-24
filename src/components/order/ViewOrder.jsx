"use client";

import React, { act, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { TbFileInvoice } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useDebounce from "@/hooks/useDebounce";
import { IoMdArrowRoundBack } from "react-icons/io";

import moment from "moment";
import _ from "lodash";
import { BaseURL } from "../../../utils/baseUrl";
import Loader from "../common/Loader";

const CustomComboBox = ({
  options,
  placeholder,
  onChange,
  formData,
  setFormData,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setFilteredOptions(
      options?.filter((option) =>
        option?.productName?.toLowerCase().includes(value.toLowerCase()),
      ),
    );
    setShowOptions(true);
    onChange(event); // Pass the event directly to the parent
  };

  const handleOptionClick = (option) => {
    setInputValue(option?.productName);
    setShowOptions(false);
    onChange({ target: { name: "productName", value: option.productName } }); // Mimic the event structure
    setFormData({
      ...formData,
      productName: option.productName,
      quantity: 1,
      rate:
        option.rentPrice === null
          ? "sale-price"
          : option?.rateDefinition?.minimumRentalPeriod + " " + "days",
      price: option.rentPrice === null ? option.salePrice : option.rentPrice,
      product: option.id,
      status: option.status,
      taxRate: option.taxClass.taxRate,
      Day1: option?.rateDefinition?.dayRates[0]?.rate || 0,
      Day2: option?.rateDefinition?.dayRates[1]?.rate || 0,
      Day3: option?.rateDefinition?.dayRates[2]?.rate || 0,
      Day4: option?.rateDefinition?.dayRates[3]?.rate || 0,
      Day5: option?.rateDefinition?.dayRates[4]?.rate || 0,
      Day6: option?.rateDefinition?.dayRates[5]?.rate || 0,
      Day7: option?.rateDefinition?.dayRates[6]?.rate || 0,
      rentalDaysPerWeek: option?.rateDefinition?.rentalDaysPerWeek,
      minimumRentalPeriod: option?.rateDefinition?.minimumRentalPeriod,
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <InputGroup>
        <InputLeftAddon>
          <FaSearch className="text-[#c6caca]" />
        </InputLeftAddon>
        <Input
          name="productName"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
        />
      </InputGroup>
      {showOptions && (
        <ul
          style={{
            position: "absolute",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "100%",
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 1,
          }}
        >
          {filteredOptions.map((option) => (
            <li
              key={option._id}
              onClick={() =>
                option.quantity == 0 ? "" : handleOptionClick(option)
              }
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div
                className={`item-center flex justify-center gap-3 ${
                  option.quantity == 0 && "cursor-not-allowed"
                }`}
              >
                <img
                  className="h-10 w-10 rounded-md"
                  src={`${imageBaseURL}${option.thumbnail}`}
                  alt=""
                />
                <div className="flex w-96 items-center justify-between">
                  <div className="w-[50%]">
                    <Text className="text-[0.9em]"> {option.productName}</Text>
                  </div>
                  <div className="flex w-[25%] justify-start ">
                    <Text className="bg-orangecolor rounded-2xl p-1 px-3 text-[0.7em] text-white">
                      {option.status}
                    </Text>
                  </div>
                  {option?.rateDefinition?.minimumRentalPeriod == undefined ? (
                    ""
                  ) : (
                    <div className="flex w-[25%] justify-start ">
                      <Text className="bg-orangecolor rounded-2xl p-1 px-3 text-[0.7em] text-white">
                        {option?.rateDefinition?.minimumRentalPeriod}{" "}
                        {option?.rateDefinition?.minimumRentalPeriod === 1
                          ? "Day"
                          : "Days"}
                      </Text>
                    </div>
                  )}
                  <div className="flex w-[25%] justify-end ">
                    <div className=" rounded-2xl bg-green-500 p-1 px-3 text-[0.7em] text-white">
                      <Text>
                        {" "}
                        {option.quantity == 0 ? "0 Stock" : option.quantity}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ViewOrder = () => {
  const [data, setData] = useState([]);
  const [orderData, setorderData] = useState([]);
  const [loading, setloading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useSelector((state) => state?.authReducer);
  const [error, seterror] = useState("");
  const { token } = useSelector((state) => state?.authReducer);
  const [action, setaction] = useState("");
  const [ref, setref] = useState("");
  const [bookdate, setbookdate] = useState("");
  const [charging, setcharging] = useState(0);

  const [modelLoading, setmodelLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const toast = useRef();

  // const { isOpen, onOpen, onClose } = useDisclosure();

  const [formValues, setFormValues] = useState({
    productName: "",
    quantity: 0,
    rate: "",
    price: 0,
    product: "",
    orderId: params.id,
    status: "",
    rateEngine: "",
    taxRate: "",
    Day1: "",
    Day2: "",
    Day3: "",
    Day4: "",
    Day5: "",
    Day6: "",
    Day7: "",
    rentalDaysPerWeek: "",
    minimumRentalPeriod: "",
  });
  const debouncedSearch = useDebounce(formValues.productName, 500); // Add debounce with a 500ms delay

  useEffect(() => {
    const fetchdata = async () => {
      setloading(true);
      try {
        const res = await axios.get(`${BaseURL}/order/${params.id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (res.data.data) {
          setorderData(res.data.data);
          setloading(false);
        }
      } catch (error) {
        setloading(false);
        seterror("Server Error");
      }
    };
    fetchdata();
  }, []);

  const handleClic = async () => {
    setIsAdding(true);
    try {
      const body = {
        // productName: ,
        quantity: formValues?.quantity,
        rate: formValues?.rate,
        price: formValues?.price,
        orderId: params.id,
        product: formValues?.product,
        taxRate: formValues.taxRate,
        Day1: formValues.Day1,
        Day2: formValues.Day2,
        Day3: formValues.Day3,
        Day4: formValues.Day4,
        Day5: formValues.Day5,
        Day6: formValues.Day6,
        Day7: formValues.Day7,
        rentalDaysPerWeek: formValues.rentalDaysPerWeek,
        minimumRentalPeriod: formValues.minimumRentalPeriod,
      };
      if (body?.quantity == 0) {
        return;
      }
      // for (let key in body) {
      //   if (!body[key]) {
      //     return;
      //   }
      // }

      const res = await axios.patch(`${BaseURL}/order/update-products/`, body, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      setIsAdding(false);
      toast({
        title: res.data?.message,
        status: "success",
        position: " top-right",
        duration: 2000,
        isClosable: true,
      });

      if (res.data.data) {
        setorderData(res.data.data);
        setFormValues((prev) => ({
          ...prev,
          productName: "",
          quantity: 0,
          rate: "",
          price: 0,
          product: "",
        }));
      }
    } catch (error) {
      console.log(error);
      setIsAdding(false);
      toast({
        title: error.response.data?.message,
        status: "error",
        position: " top-right",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const filteredData =
    action === ""
      ? orderData?.products
      : orderData?.products?.filter((item) => item.status === action);
  const finalOutput = [];
  const AllocatedData = filteredData?.map((item) => finalOutput.push(item._id));
  console.log(
    orderData?.invoiceRunCode?.code,
    orderData?.paymentTerm?.days,
    "dw",
  );
  const allocationData = {
    orderId: orderData._id,
    productIds: finalOutput,
    reference: ref,
    bookDate: bookdate,
    charging: charging,
    invoiceRunCode: orderData?.invoiceRunCode?.code,
    paymentTerms: orderData?.paymentTerm?.days,
  };

  // if (action == "allocated") {
  //   allocationData.deliveryCharge = charging;
  // } else {
  //   allocationData.returnCharge = charging;
  // }

  // post api for allocated invoice
  const handleSubmit = async (event) => {
    event.preventDefault();
    setmodelLoading(true);

    try {
      const response = await axios.post(
        `${BaseURL}/order/${action === "allocated" ? "bookout" : "bookin"}`,
        allocationData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );
      setmodelLoading(true);

      if (response.data.success) {
        setmodelLoading(false);
        onClose();
        toast({
          title: response.data?.message,
          status: "success",
          position: " top-right",
          duration: 2000,
          isClosable: true,
        });

        router.push(
          `/order/rentalorders/invoice/${
            response.data.data.noteId
          }-${encodeURIComponent(response?.data?.data.deliveryType)}`,
        );
      } else {
        // Handle error response
        toast({
          title: response.data?.message,
          status: "success",
          position: " top-right",
          duration: 2000,
          isClosable: true,
        });
        setmodelLoading(false);
      }
    } catch (error) {
      toast({
        title: error.response.data?.message,
        status: "error",
        position: " top-right",
        duration: 2000,
        isClosable: true,
      });
      // Handle network error
      setmodelLoading(false);
      console.error("Error submitting order:", error);
    }
  };

  useEffect(() => {
    const fetchListViewData = async () => {
      try {
        const res = await axios.get(
          `${BaseURL}/order/product/list?vendorId=${user._id}&search=${debouncedSearch}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        toast({
          title: error.response.data?.message,
          status: "error",
          position: " top-right",
          duration: 2000,
          isClosable: true,
        });
      }
    };
    fetchListViewData();
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-[100%]">
        <div className="">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div height="100vh">
        <p>{error}</p>
      </div>
    );
  }
  const rateTitleHandle = (item) => {
    if (item === "daily") {
      return "Daily";
    }
    if (item === "monthly") {
      return "Monthly";
    }
    if (item === "sale-price") {
      return "Sale";
    }

    if (
      item === "weekly-5" ||
      item === "weekly-7" ||
      item === "weekly-minimum"
    ) {
      return "Weekly";
    }
  };

  const checkStatusFlag = (item) => {
    if (item === "allocated") {
      return "Items (Book Out)";
    }
    if (item === "onrent") {
      return "Items (Book In)";
    } else {
      return "Quick Pick";
    }
  };

  const handleStock = () => {
    let orgProduct = _.find(data, { id: formValues.product });
    if (orgProduct == undefined) {
      return undefined;
    }
    if (formValues.quantity <= orgProduct?.quantity) {
      return true;
    }
    return false;
  };

  function isCurrentDateGreaterThanChargingDate(chargingDate) {
    const currentDate = new Date();
    const chargingDateObj = new Date(chargingDate);

    if (currentDate == chargingDateObj) {
      return true;
    } else if (currentDate <= chargingDateObj) {
      return true;
    } else {
      return false;
    }
  }

  function checkChargingDate(chargingStartDate) {
    const currentDate = new Date();
    const chargingStart = new Date(chargingStartDate);

    // Check if the chargingStartDate is today (ignoring the time part)
    if (
      currentDate.getFullYear() === chargingStart.getFullYear() &&
      currentDate.getMonth() === chargingStart.getMonth() &&
      currentDate.getDate() === chargingStart.getDate()
    ) {
      return true;
    }

    // Check if current date is before the charging start date
    if (currentDate < chargingStart) {
      return true;
    }

    return false;
  }

  const dateAvailable = checkChargingDate(orderData.chargingStartDate);
  const hasAllocatedStatus = orderData?.products?.some(
    (item) => item.status === "allocated",
  );
  const hasOnrentdStatus = orderData?.products?.some(
    (item) => item.status === "onrent",
  );

  return <div>ViewOrder</div>;
};

export default ViewOrder;
