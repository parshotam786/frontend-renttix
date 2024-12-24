import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ViewOrder from "@/components/order/ViewOrder";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName={"Detail"} />
        <ViewOrder />
      </DefaultLayout>
    </div>
  );
};

export default page;
