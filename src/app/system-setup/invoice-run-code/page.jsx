import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvoiceRunCode from "@/components/system-setup/invoice-run-code/InvoiceRunCode";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <InvoiceRunCode />
      </DefaultLayout>
    </div>
  );
};

export default page;
