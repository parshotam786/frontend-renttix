import DefaultLayout from "@/components/Layouts/DefaultLaout";
import RolesListing from "@/components/system-setup/roles/roles-listing/RolesListing";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <RolesListing />
      </DefaultLayout>
    </div>
  );
};

export default page;
