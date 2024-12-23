import ViewBatchInvoice from "@/components/invoicing/ViewBatchInvoice";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <ViewBatchInvoice />
      </DefaultLayout>
    </div>
  );
};

export default page;
