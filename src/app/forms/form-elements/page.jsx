import React from "react";
import FormElements from "@/components/FormElements";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata = {
  title: "Next.js Form Elements Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Form Elements page for NextAdmin Dashboard Kit",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <FormElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
