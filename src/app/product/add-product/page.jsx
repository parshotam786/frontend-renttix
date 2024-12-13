import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AddProduct from "@/components/product/AddProduct";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <AddProduct />
      </DefaultLayout>
    </div>
  );
};

export default page;
