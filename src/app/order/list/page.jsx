import DefaultLayout from "@/components/Layouts/DefaultLaout";
import OrderList from "@/components/order/OrderList";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <OrderList />
      </DefaultLayout>
    </div>
  );
};

export default page;
