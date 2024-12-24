import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import SystemSetup from "@/components/system-setup/SystemSetup";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName={"System Setup"} />
        <SystemSetup />
      </DefaultLayout>
    </div>
  );
};

export default page;
