import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AddUser from "@/components/system-setup/roles/roles-listing/AddUser";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <AddUser />
      </DefaultLayout>
    </div>
  );
};

export default page;
