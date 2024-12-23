import PdfViewer from "@/components/invoicing/PdfViewer";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

const page = () => {
  return (
    <div>
      <DefaultLayout>
        <PdfViewer />
      </DefaultLayout>
    </div>
  );
};

export default page;
