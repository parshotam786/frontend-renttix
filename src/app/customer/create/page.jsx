import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CreateCustomer from "@/components/customer/CreateCustomer";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName="Create Customer" />
        <CreateCustomer />
      </DefaultLayout>
    </div>
  );
};

export default page;
