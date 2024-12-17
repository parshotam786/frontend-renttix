import { useEffect } from "react";

const useFormValidation = (values, setformValidation) => {
  useEffect(() => {
    setformValidation(values);
  }, [values, setformValidation]);
};

export default useFormValidation;
