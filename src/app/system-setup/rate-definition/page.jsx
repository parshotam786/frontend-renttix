import DefaultLayout from "@/components/Layouts/DefaultLaout";
import RateDefination from "@/components/system-setup/rate-defination/RateDefination";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <RateDefination />
      </DefaultLayout>
    </div>
  );
};

export default page;
