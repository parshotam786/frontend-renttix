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
import SingleInvoiceTable from "./SingleInvoiceTable";

const ViewBatchInvoice = () => {
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(false);
  const { token } = useSelector((state) => state?.authReducer);
  const [loader, setloader] = useState(false);

  const [refreshFlag, setRefreshFlag] = useState(false);

  const params = useParams();
  console.log(params);

  useEffect(() => {
    const fetchData = async () => {
      let payload = {
        id: params.id,
        invoiceId: params.invoiceId,
      };
      setloading(true);
      const response = await axios.post(
        `${BaseURL}/invoice/invoice-view`,
        payload,
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

  const allocationData = {
    id: params.id,
    invoiceId: params.invoiceId,
  };

  const handleDownloadInvoice = async () => {
    setloader(true);
    try {
      // Make API call to generate the invoice PDF
      const response = await axios.post(
        `${BaseURL}/invoice/invoice-print/`,
        allocationData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.url) {
        setloader(false);
        // Open the URL in a new tab to trigger the download
        window.open(response.data.url, "_blank");
      } else {
        console.error("Failed to generate invoice.");
        setloader(false);
      }
    } catch (error) {
      setloader(false);
      console.error("Error generating invoice:", error);
    } finally {
    }
  };

  //   if (loading) {
  //     return (
  //       <Center height="100vh">
  //         <Spinner size="xl" />
  //       </Center>
  //     );
  //   }
  return (
    <div>
      <Breadcrumb pageName="Detail Invoice Batch" />
      {/* <div className="grid grid-cols-3"> */}
      <div class="mt-5 grid grid-cols-8 gap-4">
        <div className="col-span-2  p-4">
          <div className="flex flex-col items-center justify-center ">
            <FaCodepen className="p-4 text-[250px] text-[#555]" />

            <label
              htmlFor=""
              className="text-center text-[20px] font-semibold text-dark-2 dark:text-white"
            >
              Invoice : {data?.invocie}
            </label>
          </div>
        </div>
        <div className="col-span-3  p-4 ">
          <label
            className="text-[20px] font-semibold text-dark-2 dark:text-white "
            htmlFor="Action"
          >
            Customer Information
          </label>
          <div className="flex flex-col ">
            <div className="flex  justify-between">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Name
              </label>
              <div className="text-start">
                <label className="font-light">{data.customerName}</label>
              </div>
            </div>
            <div className="flex  justify-between">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Address
              </label>
              <div className="text-start">
                <label className="font-light">
                  {" "}
                  {` ${data.customerAddress} ${data.customerCity} ${data.customerCountry}`}
                </label>
              </div>
            </div>
            <div className="flex  justify-between">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Email
              </label>
              <label className="font-light">{data.customerEmail}</label>
            </div>
            <div className="flex justify-between ">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Delivery Address
              </label>
              <label className="font-light">
                {` ${data.deliveryAddress} ${data.deliveryPlaceName}`}
              </label>
            </div>
            <div className="flex justify-between ">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Order Number
              </label>
              <label className="font-light"> {data.orderId}</label>
            </div>
            <div className="flex justify-between ">
              <label
                htmlFor=""
                className="font-semibold text-dark-2 dark:text-white "
              >
                Invoice Date
              </label>
              <label className="font-light">
                {" "}
                {moment(data.invoiceDate).format("lll")}
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
                {data?.status === "Draft" && (
                  <div className="flex items-center gap-2">
                    <IoIosCheckmarkCircleOutline />

                    <InvoiceBatchModel
                      title="Confirm Invoice"
                      subTitle={"Confirm Invoice"}
                      fetchOldData={handleRefresh}
                      invoiceId={params.invoiceId}
                      batchId={params.id}
                      description={`Are you sure you want to confirm the Invoice?`}
                    />
                  </div>
                )}
                {/* {isDraft && (
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
                )} */}
                {(data?.status === "Confirmed" || data?.status === "Draft") && (
                  <div className="flex items-center gap-2">
                    <IoIosCheckmarkCircle />
                    <InvoiceBatchModel
                      fetchOldData={handleRefresh}
                      title="Post invoice"
                      subTitle={"Post invoice"}
                      batchId={params.id}
                      invoiceId={params.invoiceId}
                      data={data}
                      code={data.invocie}
                      description={`Are you sure you want to Post the Invoice`}
                    />
                  </div>
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
              <label className="font-light">${data?.goods}</label>
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
              <label className="font-light"> ${data.total}</label>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="my-auto flex min-h-[50vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <SingleInvoiceTable columnData={data} />
      )}
    </div>
  );
};

export default ViewBatchInvoice;
