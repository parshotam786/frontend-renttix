import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Integrations from "@/components/system-setup/integrations/Integrations";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <Integrations />
      </DefaultLayout>
    </div>
  );
};

export default page;
