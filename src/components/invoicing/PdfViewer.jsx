"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import { BaseURL } from "../../../utils/baseUrl";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

const PdfViewer = () => {
  const [loader, setloader] = useState(false);
  const params = useParams();
  const [pdfUrl, setpdfUrl] = useState("");
  const { token } = useSelector((state) => state?.authReducer);

  useEffect(() => {
    const handleDownloadInvoice = async () => {
      setloader(true);
      try {
        const response = await axios.post(
          `${BaseURL}/invoice/multiple-invoice-print/`,
          { id: params.id },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.url) {
          setpdfUrl(response?.data);
          setloader(false);
          // window.open(response.data.url, "_blank");
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
    handleDownloadInvoice();
  }, []);

  if (loader) {
    return (
      <div height="100vh flex item-center">
        <div className="flex flex-col items-center justify-center gap-8">
          <label className="text-[20px] font-semibold">
            Invoice Batch PDF Generating...
          </label>
          {/* <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          /> */}
          <Loader />
        </div>
      </div>
    );
  }
  return (
    <div>
      <Breadcrumb pageName="Invoice Batch" />
      {/* <GoPrevious title={`/invoice/invoice-batches/${params.id}`} /> */}
      <div className="flex p-3">
        <label className="text-[20px] font-semibold">
          Invoice Batch : {pdfUrl.name}
        </label>
      </div>
      <iframe
        src={pdfUrl.url}
        width="100%"
        height="1100px"
        style={{ border: "none" }}
        title="PDF Preview"
      ></iframe>
    </div>
  );
};

export default PdfViewer;
