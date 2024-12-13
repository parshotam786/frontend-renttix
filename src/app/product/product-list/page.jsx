import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ProductList from "@/components/product/ProductList";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <ProductList />
      </DefaultLayout>
    </div>
  );
};

export default page;
