import React from "react";
import Link from "next/link";

const ButtonDefault = ({ label, link, customClasses, children }) => {
  return (
    <>
      <Link
        className={`inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 ${customClasses}`}
        href={link}
      >
        {children}
        {label}
      </Link>
    </>
  );
};

export default ButtonDefault;
