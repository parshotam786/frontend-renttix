import CustomerListing from "@/components/customer/CustomerListing";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <CustomerListing />
      </DefaultLayout>
    </div>
  );
};

export default page;
