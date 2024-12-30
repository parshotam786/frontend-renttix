import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CreateRateDefination from "@/components/system-setup/rate-defination/CreateRateDefination";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <CreateRateDefination />
      </DefaultLayout>
    </div>
  );
};

export default page;
