import InvoiceRun from "@/components/invoicing/InvoiceRun";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <InvoiceRun />
      </DefaultLayout>
    </div>
  );
};

export default page;
