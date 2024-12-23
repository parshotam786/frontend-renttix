import InvoiceBatch from "@/components/invoicing/InvoiceBatch";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <InvoiceBatch />
      </DefaultLayout>
    </div>
  );
};

export default page;
