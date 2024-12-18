import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
const GoBackButton = ({ title }) => {
  const router = useRouter();
  return (
    <div>
      <Button
        style={{ background: "white", color: "black" }}
        onClick={() => router.back()}
      >
        {title}
      </Button>
    </div>
  );
};

export default GoBackButton;
