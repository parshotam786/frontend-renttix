import DefaultLayout from "@/components/Layouts/DefaultLaout";
import UpdateInvoiceRunCode from "@/components/system-setup/invoice-run-code/UpdateInvoiceRunCode";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <UpdateInvoiceRunCode />
      </DefaultLayout>
    </div>
  );
};

export default page;
