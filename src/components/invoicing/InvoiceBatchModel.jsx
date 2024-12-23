import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useParams, useRouter } from "next/navigation";

import { useSelector } from "react-redux";
import CanceButton from "../Buttons/CanceButton";
import { Toast } from "primereact/toast";
import { BaseURL } from "../../../utils/baseUrl";
import axios from "axios";

const InvoiceBatchModel = ({
  title,
  batchId,
  description,
  subTitle,
  invoiceId,
  code,
  fetchOldData,
}) => {
  //   const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setloading] = useState(false);
  const toast = useRef();
  const { token } = useSelector((state) => state?.authReducer);
  const { user } = useSelector((state) => state?.authReducer);

  const router = useRouter();
  const params = useParams();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState("center");

  const show = (position) => {
    setPosition(position);
    setVisible(true);
  };

  const payload = {
    id: batchId,
    status: "Confirmed",
  };

  const allocationData = {
    id: batchId,
    invoiceId: invoiceId,
  };

  const handleSubmit = async () => {
    setloading(true);

    try {
      const config = {
        headers: { authorization: `Bearer ${token}` },
      };

      const res =
        title === "Confirm Batch"
          ? await axios.put(
              `${BaseURL}/invoice/invoice-status`,
              payload,
              config,
            )
          : title === "Post invoice"
            ? await axios.post(
                `${BaseURL}/invoice/invoice-post/`,
                allocationData,
                config,
              )
            : title === "Post Batch"
              ? await axios.post(
                  `${BaseURL}/invoice/invoice-post-all/`,
                  { id: params.id },
                  config,
                )
              : title === "Confirm Invoice"
                ? await axios.post(
                    `${BaseURL}/invoice/invoice-confirmed`,
                    allocationData,

                    config,
                  )
                : await axios.delete(`${BaseURL}/invoice/${batchId}`, config);

      if (user.isQuickBook && res?.data?.message == "AUTHENTICATION") {
        window.location.href = `${BaseURL}/auth?vendorId=${user._id}&redirctURL=${window.location.href}`;
      }

      if (res.data.success) {
        setloading(false);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: res.data.message,
          life: 3000,
        });

        if (title === "Delete Invoice Batch") {
          router.push("/invoice/invoice-batches");
        } else {
          fetchOldData();
        }
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "An error occurred",
        life: 3000,
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="justify-content-center mb-2 flex flex-wrap gap-2">
        <Button
          label={title}
          unstyled
          onClick={() => show("top")}
          className="cursor-pointer text-[#3182ce]"
        />
      </div>

      <Dialog
        header={title}
        visible={visible}
        position={position}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={() => {
          return (
            <div>
              <CanceButton onClick={() => setVisible(false)} />
              {/* <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setVisible(false)}
                className="p-button-text"
              /> */}
              <Button
                label="Yes"
                loading={loading}
                icon="pi pi-check"
                onClick={handleSubmit}
                autoFocus
              />
            </div>
          );
        }}
        draggable={false}
        resizable={false}
      >
        {subTitle == "Post invoice" && (
          <div className="mb-5 flex flex-col gap-3">
            <div>
              <label className="font-semibold text-red">
                This action is irreversible!
              </label>
            </div>
            <div className="">
              <label>
                IMPORTANT! Please check your Invoice prior to posting. Posting
                invoices/credits is irreversible, and you will no longer be able
                to void and regenerate them. Any changes will require a manual
                invoice/credit.
              </label>
            </div>
          </div>
        )}
        {subTitle == "Post Batch" && (
          <div className="mb-5 flex flex-col gap-3">
            <div>
              <label className="font-semibold text-red">
                This action is irreversible!
              </label>
            </div>
            <div className="">
              <label>
                IMPORTANT! Please check your invoices and credits prior to
                posting. Posting invoices/credits is irreversible, and you will
                no longer be able to void and regenerate them. Any changes will
                require a manual invoice/credit.
              </label>
            </div>
          </div>
        )}
        <label
          className={`flex ${
            (title === "Delete Invoice Batch" || title === "Post Batch") &&
            "flex-col"
          }`}
        >
          {description} <span className="ml-1 font-semibold">{code}</span>{" "}
          {subTitle == "Post invoice" && <label>?</label>}
        </label>
      </Dialog>
    </div>
  );
};

export default InvoiceBatchModel;
