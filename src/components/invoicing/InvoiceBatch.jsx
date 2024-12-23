"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import moment from "moment";
import Link from "next/link";
import { FaCodepen } from "react-icons/fa";
import { BaseURL } from "../../../utils/baseUrl";

import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import InvoiceBatchTable from "./InvoiceBatchTable";
import Loader from "../common/Loader";
import InvoiceBatchModel from "./InvoiceBatchModel";
import { MdDelete } from "react-icons/md";
import { PiPrinterFill } from "react-icons/pi";

import {
  IoIosCheckmarkCircle,
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";

const InvoiceBatch = () => {
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(false);
  const { token } = useSelector((state) => state?.authReducer);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [pdfUrl, setpdfUrl] = useState("");

  const [products, setProducts] = useState([
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      description: "Product Description",
      image: "bamboo-watch.jpg",
      price: 65,
      category: "Accessories",
      quantity: 24,
      inventoryStatus: "INSTOCK",
      rating: 5,
    },
  ]);

  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setloading(true);
      const response = await axios.get(
        `${BaseURL}/invoice/invoice-batches/${params.id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setloading(false);
        setdata(response.data.data);
      } else {
        console.log(response?.data?.message);
      }
    };
    fetchData();
  }, [refreshFlag]);
  const handleRefresh = () => {
    setRefreshFlag((prevFlag) => !prevFlag);
  };

  function areAllStatusesPosted(data, value) {
    return data?.invoices?.every((item) => item.status === value);
  }

  const isDraft = data?.invoices?.some((item) => item.status === "Draft");
  const isConfirmed = data?.invoices?.some(
    (item) => item.status === "Draft" || item.status === "Confirmed",
  );
  return (
    <div>
      <Breadcrumb pageName="Detail Invoice Batch" />
      {/* <div className="grid grid-cols-3"> */}
      <div class="mt-5 grid grid-cols-8 gap-4">
        <div className="col-span-2  p-4 ">
          <FaCodepen className="p-4 text-[250px] text-[#555]" />
        </div>
        <div className="col-span-3  p-4 ">
          <label
            className="text-[20px] font-semibold text-dark-2 dark:text-white "
            htmlFor="Action"
          >
            Details
          </label>
          <div className="flex flex-col ">
            <div className="flex  justify-between">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Invoice Run
              </label>
              <div className="text-start">
                <label className="font-light">{data.name}</label>
              </div>
            </div>
            <div className="flex  justify-between">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Document Number
              </label>
              <div className="text-start">
                <label className="font-light">{data.batchNumber}</label>
              </div>
            </div>
            <div className="flex  justify-between">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Batch Date
              </label>
              <label className="font-light">
                {moment(data.invoiceStartDate).format("lll")}
              </label>
            </div>
            <div className="flex justify-between ">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Invoice up to Date
              </label>
              <label className="font-light">
                {" "}
                {moment(data.invoiceUptoDate).format("lll")}
              </label>
            </div>
          </div>
          <div className="mt-5 flex justify-between gap-4">
            <div className="">
              <label
                className="font-semibold text-dark-2 dark:text-white "
                htmlFor="Action"
              >
                Action
              </label>
              <div className="flex flex-col">
                {isDraft && (
                  <>
                    {data?.status === "Draft" && (
                      <div className="flex items-center gap-2">
                        <IoIosCheckmarkCircleOutline />

                        <InvoiceBatchModel
                          title="Confirm Batch"
                          subTitle={"Confirm Batch"}
                          fetchOldData={handleRefresh}
                          batchId={data._id}
                          description={`Are you sure you want to confirm all the draft invoices in the invoice batch`}
                          code={`${data.batchNumber}?`}
                        />
                      </div>
                    )}
                  </>
                )}
                {isConfirmed && (
                  <>
                    {data.status != "Posted" && (
                      <div className="flex items-center gap-2">
                        <IoIosCheckmarkCircle />
                        <InvoiceBatchModel
                          fetchOldData={handleRefresh}
                          title="Post Batch"
                          subTitle={"Post Batch"}
                          data={data}
                          code={data.batchNumber}
                          description={`Are you sure you want to post all the unposted invoices in the invoice batch`}
                        />
                      </div>
                    )}
                  </>
                )}
                <div className="flex items-center gap-2">
                  <MdDelete />

                  <InvoiceBatchModel
                    subTitle={"Confirm Delete"}
                    code={data?.name}
                    batchId={data?._id}
                    description={
                      "Are you sure you want to delete the invoice batch Invoice Run"
                    }
                    title="Delete Invoice Batch"
                  />
                </div>
              </div>
            </div>
            <div className="">
              <label
                className="font-semibold text-dark-2 dark:text-white "
                htmlFor="Action"
              >
                Document
              </label>
              <div className="flex">
                <div className="flex items-center gap-2">
                  <PiPrinterFill />
                  <Link
                    className="cursor-pointer text-[18px] text-[#3182ce]"
                    href={`/invoicing/invoice-batch/pdf/${params.id}`}
                  >
                    Invoice Batch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3  p-4">
          <label
            className="text-[20px] font-semibold text-dark-2 dark:text-white "
            htmlFor="Action"
          >
            Total Items
          </label>
          <div className="flex flex-col ">
            <div className="flex justify-between ">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Excluding Tax
              </label>
              <label className="font-light">${data?.excludingTax}</label>
            </div>
            <div className="flex justify-between ">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Tax
              </label>
              <label className="font-light">${data?.tax}</label>
            </div>
            <div className="flex justify-between ">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Including Tax
              </label>
              <label className="font-light">
                {" "}
                ${Number(data.totalPrice).toFixed(2)}
              </label>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="my-auto flex min-h-[50vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <InvoiceBatchTable columnData={data} />
      )}
    </div>
  );
};

export default InvoiceBatch;
