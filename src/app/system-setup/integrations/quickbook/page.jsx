import DefaultLayout from "@/components/Layouts/DefaultLaout";
import IntegrationAccount from "@/components/system-setup/integrations/integration-account/IntegrationAccount";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <IntegrationAccount />
      </DefaultLayout>
    </div>
  );
};

export default page;
