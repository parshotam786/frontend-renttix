import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CreateOrder from "@/components/order/CreateOrder";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <CreateOrder />
      </DefaultLayout>
    </div>
  );
};

export default page;
