import BasicChart from "@/components/Charts/BasicChart";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata = {
  title: "Next.js Basic Chart Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Basic Chart page for NextAdmin Dashboard Kit",
  // other metadata
};

const BasicChartPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Basic Chart" />

      <BasicChart />
    </DefaultLayout>
  );
};

export default BasicChartPage;
