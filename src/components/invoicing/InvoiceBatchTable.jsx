import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { BaseURL } from "../../../utils/baseUrl";
import axios from "axios";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FaRegCircle } from "react-icons/fa";
import {
  IoIosCheckmarkCircle,
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import { Tag } from "primereact/tag";
import moment from "moment";

const InvoiceBatchTable = ({ columnData }) => {
  const toast = useRef();
  const params = useParams();
  const [filterData, setfilterData] = useState(columnData);
  const { token } = useSelector((state) => state?.authReducer);
  const [loader, setloader] = useState(false);
  const router = useRouter();
  const handleDelte = (id) => {
    const output = filterData.filter((item) => item._id !== id);
    setfilterData(output);
  };
  useEffect(() => {
    setfilterData(columnData);
  }, [columnData]);
  const handleDelete = async (id) => {
    try {
      const response = await axios.put(
        `${BaseURL}/order/product`,
        {
          orderId: orderCompleteId,
          productId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        handleDelte(response.data.data.productId);
      }
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: response.data.message,
        life: 3000,
      });
    } catch (error) {
      // Handle error (e.g., show an error message)
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Prodcut not deleted",
        life: 3000,
      });

      onClose();
      setDeleteStatus("error");
    }
  };
  const colorButton = (item) => {
    if (item === "allocated") {
      return "green";
    }
    if (item === "reserved") {
      return "gray";
    }
    if (item === "onrent") {
      return "orange";
    }
    if (item === "offrent") {
      return "red";
    }
  };

  const percetageCalculate = (taxRate, price) => {
    let percentage = (taxRate / 100) * price;
    return percentage + price;
  };

  const DynamicIcon = (item) => {
    if (item === "Draft") {
      return <FaRegCircle className="text-[20px] font-bold" />;
    }
    if (item === "Confirmed") {
      return <IoIosCheckmarkCircleOutline className="text-[20px] font-bold" />;
    }
    if (item === "Posted") {
      return <IoIosCheckmarkCircle className="text-[20px] font-bold" />;
    }
  };

  const DynamicButtonColor = (item) => {
    if (item === "Draft") {
      return "";
    }
    if (item === "Confirmed") {
      return "warning";
    }
    if (item === "Posted") {
      return "success";
    }
  };

  //print invoice
  const handleDownloadInvoice = async (invoiceId) => {
    setloader(true);
    try {
      const response = await axios.post(
        `${BaseURL}/invoice/invoice-print/`,
        {
          id: params.id,
          invoiceId: invoiceId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.url) {
        setloader(false);
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

  return (
    <div className="rounded-lg bg-white p-8">
      <Toast ref={toast}></Toast>
      <div className="card ">
        <DataTable
          value={filterData?.invoices}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="name"
            header="Name"
            body={(item) => {
              return (
                <>
                  <div className="item-center flex items-center gap-3">
                    <label>{DynamicIcon(item.status)}</label>
                    <div className="flex flex-col gap-1">
                      {/* {item.invocie != "Draft" && ( */}
                      <Link
                        className="text-[#3379b7]"
                        href={`/invoicing/invoice-batch/${filterData._id}/invoice/${item._id}`}
                      >
                        {item.invocie}
                      </Link>
                      {/* )} */}
                      <Link
                        className="text-[#3379b7]"
                        href={`/order/rentalorders/${item.id}`}
                      >
                        {item.billingPlaceName}
                      </Link>
                    </div>
                  </div>
                </>
              );
            }}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={(item) => {
              return (
                <>
                  <Tag
                    severity={DynamicButtonColor(item.status)}
                    value={item.status}
                  />
                </>
              );
            }}
          ></Column>
          <Column
            field="type"
            header="Type"
            body={(item) => (
              <>
                <Tag value={"Invoice"} size={"sm"} />
              </>
            )}
          ></Column>
          <Column
            field="quantity"
            header="Invoice Date	"
            body={() => (
              <label htmlFor={moment(filterData.batchDate).format("LLLL")}>
                {moment(filterData.batchDate).format("LLLL")}
              </label>
            )}
          ></Column>
          <Column
            field="goods"
            header="Goods"
            body={(item) => {
              return <>${Number(item?.goods)?.toFixed(2)}</>;
            }}
          ></Column>
          <Column
            field="tax"
            header="Tax"
            body={(item) => {
              return <>${Number(item?.tax)?.toFixed(2)}</>;
            }}
          ></Column>
          <Column
            field="total"
            header="Total (Inc. TAX)"
            body={(item) => {
              return <>${Number(item?.total)?.toFixed(2)}</>;
            }}
          ></Column>
          <Column
            field="action"
            header="Action"
            body={(item) => {
              return (
                <>
                  <div className="flex gap-6">
                    <i
                      onClick={() => handleDownloadInvoice(item.id)}
                      className="pi pi-print cursor-pointer"
                    ></i>
                    <i
                      onClick={() =>
                        router.push(
                          `/invoice/invoice-batches/${filterData._id}/invoice/${item.id}`,
                        )
                      }
                      className="pi pi-external-link cursor-pointer"
                    ></i>
                  </div>
                </>
              );
            }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default InvoiceBatchTable;
