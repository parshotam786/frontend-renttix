import InvioceBatchList from "@/components/invoicing/InvioceBatchList";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <InvioceBatchList />
      </DefaultLayout>
    </div>
  );
};

export default page;
