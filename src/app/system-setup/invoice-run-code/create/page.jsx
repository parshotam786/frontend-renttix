import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CreateInvoiceRunCode from "@/components/system-setup/invoice-run-code/CreateInvoiceRunCode";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <CreateInvoiceRunCode />
      </DefaultLayout>
    </div>
  );
};

export default page;
