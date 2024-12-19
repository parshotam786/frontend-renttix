import { Button } from "primereact/button";
import React from "react";

const CanceButton = ({ onClick }) => {
  return (
    <Button
      label="Cancel"
      icon="pi pi-times"
      style={{ background: "white", color: "black" }}
      size="small"
      outlined
      onClick={onClick}
    />
  );
};

export default CanceButton;
