import DefaultLayout from "@/components/Layouts/DefaultLaout";
import UpdateProduct from "@/components/product/UpdateProduct";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <UpdateProduct />
      </DefaultLayout>
    </div>
  );
};

export default page;
