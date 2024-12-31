import React from "react";

const InputGroup = ({
  customClasses,
  label,
  type,
  placeholder,
  required,
  value,
  name,
  onChange,
}) => {
  return (
    <>
      <div className={customClasses}>
        <label className="text-body-md mb-2 block font-medium text-dark dark:text-white ">
          {label}
          {required && <span className="text-red">*</span>}
        </label>
        <input
          type={type}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>
    </>
  );
};

export default InputGroup;
