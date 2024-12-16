"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { InputText } from "primereact/inputtext";
import { useDropzone } from "react-dropzone";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import Link from "next/link";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

const AddProduct = () => {
  const [status, setStatus] = useState("Rental");
  const showstatus = status;
  console.log(showstatus);
  const [minHireData, setminHireData] = useState([]);

  const [categoryValue, setcategoryValue] = useState({});
  const [subCategoryValue, setSubcategoryValue] = useState({});
  const [taxClassValue, setTaxClassValue] = useState({});
  const [rateDefinitionValue, setrateDefinitionValue] = useState({});
  console.log(categoryValue, "ss");
  const [formData, setFormData] = useState({
    productName: "",
    companyProductName: "",
    productDescription: "",
    // category: categoryValue._id,
    // minHireTime: "",
    rentPrice: "",
    // rentDuration: "",
    // rateDefinition: "",
    range: "",
    vat: "",
    rate: "daily",
    salePrice: "",
    quantity: 1,
    lenghtUnit: "cm",
    weightUnit: "kg",
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [taxClass, settaxClass] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [prompt, setprompt] = useState("");
  const [openAiError, setopenAiError] = useState("");
  const [promptLoader, setpromptLoader] = useState(false);

  const router = useRouter();
  //   const toast = useToast();
  const debouncedSearch = useDebounce(prompt, 500); // Add debounce with a 500ms delay
  const { user } = useSelector((state) => state?.authReducer);
  const { token } = useSelector((state) => state?.authReducer);
  const BaseURL = process.env.NEXT_PUBLIC_API_URL;
  const toast = useRef(null);
  const id = ["Editor", "Operator"].includes(user?.role)
    ? user?.vendor
    : user?._id;
  if (status === "Sale") {
    delete formData.rateDefinition;
  }
  const onDrop = useCallback((acceptedFiles) => {
    const newPreviews = acceptedFiles.slice(0, 4).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviews(newPreviews);
    setFiles(acceptedFiles.slice(0, 4));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
    maxFiles: 4,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, taxClassRes, rateDefRes] = await Promise.all([
          axios.get(`${BaseURL}/category`),
          axios.get(`${BaseURL}/tax-classes/product`, {
            headers: { authorization: `Bearer ${token}` },
          }),
          axios.get(`${BaseURL}/rate-definition/list`, {
            headers: { authorization: `Bearer ${token}` },
          }),
        ]);

        setCategories(categoriesRes.data);
        settaxClass(taxClassRes.data?.data);
        setminHireData(rateDefRes.data?.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      const selectedCategory = categories.find(
        (item) => item._id === categoryValue._id,
      );
      if (selectedCategory) {
        try {
          const response = await axios.get(
            `${BaseURL}/sub-category?parentId=${categoryValue._id}`,
          );
          setSubCategories(response?.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    console.log(formData);
    if (categoryValue) {
      fetchSubCategories();
    }
  }, [categoryValue, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(true);
    const productData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      productData.append(key, value);
    });
    productData.append("vendorId", id);

    productData.append("status", showstatus);
    productData.append("category", categoryValue._id);
    productData.append("subCategory", subCategoryValue._id);
    productData.append("taxClass", taxClassValue._id);
    if (status != "Sale") {
      productData.append("rateDefinition", rateDefinitionValue._id);
    }

    files.forEach((file) => {
      productData.append("image", file);
    });

    if (status === "Sale") {
      delete productData.rateDefinition;
    }

    try {
      const res = await axios.post(
        `${BaseURL}/product/add-product`,
        productData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        setFormData({
          productName: "",
          companyProductName: "",
          productDescription: "",
          // category: "",
          // taxClass: "",
          // subCategory: "",
          // rateDefinition: "",
          rentPrice: "",
          rentDuration: "",
          salePrice: "",
          range: "",
          vat: "",
          rate: "daily",
          quantity: 1,
          lenghtUnit: "",
          weightUnit: "",
          weight: "",
          length: "",
          width: "",
          height: "",
        });
        setError(false);

        setPreviews([]);
        setFiles([]);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: res.data.message,
          life: 3000,
        });
        // toast({
        //   title: res.data.message,
        //   status: "success",
        //   position: "top-right",
        //   duration: 2000,
        //   isClosable: true,
        // });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message,
        life: 3000,
      });
      //   toast({
      //     title: error.response.data.message,
      //     status: "error",
      //     position: "top-right",
      //     duration: 2000,
      //     isClosable: true,
      //   });
      console.error("Error adding product", error);
    }
  };

  const isRequired = () => {
    return <span className="text-red">*</span>;
  };

  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchData = async () => {
      setpromptLoader(true);
      try {
        const response = await axios.post(
          `${BaseURL}/product/description`,
          { prompt: debouncedSearch },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          setpromptLoader(false);
          console.log(response.data.message);
          setFormData((prevFormData) => ({
            ...prevFormData,
            productDescription: response.data.message,
          }));
        } else {
          setpromptLoader(false);
          setopenAiError(response.data.error);
        }
      } catch (error) {
        setpromptLoader(false);
        setopenAiError(error.response?.data?.error || "An error occurred");
        console.error("Error fetching data", error);
      }
    };

    if (debouncedSearch) {
      fetchData();
    }
  }, [debouncedSearch]); // Only re-run the effect if debouncedSearch changes
  return (
    <div>
      <Breadcrumb pageName="Add Proudct" />
      <Toast ref={toast} position="top-right" />
      <div class="grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Name and Description</h3>
        </div>
        <div class="col-span-8 bg-white p-4 md:col-span-8 lg:col-span-8 xl:col-span-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold  text-black">
                Product Name {isRequired()}
              </label>
              <InputText
                name="productName"
                placeholder="Product Name"
                value={formData.productName}
                onChange={handleChange}
              />

              {error && formData.productName == ""
                ? formData.productName == "" && (
                    <label className="text-[0.8em] text-red">
                      Product name is required.
                    </label>
                  )
                : ""}
            </div>
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                Company Product Name {isRequired()}
              </label>
              <InputText
                name="companyProductName"
                placeholder="Company Product Name"
                value={formData.companyProductName}
                onChange={handleChange}
              />
              {error && formData.companyProductName == ""
                ? formData.companyProductName == "" && (
                    <label className="text-[0.8em] text-red">
                      Company Product name is required.
                    </label>
                  )
                : ""}
            </div>
          </div>
          <div className="">
            <div className="mt-4 flex justify-between">
              <label className="mt-2.5 block text-[0.9em] font-bold text-black ">
                Product Description {isRequired()}
              </label>

              <div
                className={`flex items-center gap-4  ${
                  formData.productName == "" ? "hidden" : "block"
                } `}
              >
                <label className="text-[0.9em]">Write with AI?</label>

                <>
                  {promptLoader ? (
                    <ProgressSpinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="md"
                    />
                  ) : (
                    <i
                      onClick={() =>
                        setprompt(
                          `write a concise product descripton about ${formData.productName}? `,
                        )
                      }
                      className="pi pi-refresh mb-1 cursor-pointer text-[30px] text-[#1a7f64]"
                    />
                  )}
                </>
              </div>
            </div>
            <InputTextarea
              rows={6}
              name="productDescription"
              placeholder="Product Description"
              value={formData.productDescription}
              onChange={handleChange}
            />
            {openAiError !== "" && (
              <label className="text-[0.8em] text-red">{openAiError}</label>
            )}
            {error && formData.productDescription == ""
              ? formData.productDescription == "" && (
                  <label className="text-[0.8em] text-red">
                    Product Description is required.
                  </label>
                )
              : ""}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <div className="">
                <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                  Category Type {isRequired()}
                </label>
                <Dropdown
                  value={categoryValue}
                  onChange={(e) => setcategoryValue(e.value)}
                  options={categories}
                  optionLabel="name"
                  placeholder="Category Type"
                  name="category"
                  className="md:w-14rem w-full text-[0.9em]"
                  checkmark={true}
                  highlightOnSelect={false}
                />

                {error && formData.category == ""
                  ? formData.category == "" && (
                      <lable className="text-[0.8em] text-red">
                        Category Type is required.
                      </lable>
                    )
                  : ""}
              </div>
            </div>
            <div className="">
              <div className="">
                <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                  Sub Category Type {isRequired()}
                </label>

                <Dropdown
                  value={subCategoryValue}
                  onChange={(e) => setSubcategoryValue(e.value)}
                  options={subCategories}
                  optionLabel="name"
                  placeholder="Sub Category Type"
                  name="subCategory"
                  className="md:w-14rem w-full text-[0.9em]"
                  checkmark={true}
                  highlightOnSelect={false}
                />

                {error && formData.subCategory == ""
                  ? formData.subCategory == "" && (
                      <label className="text-[0.8em] text-red">
                        Sub Category Type is required.
                      </label>
                    )
                  : ""}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 py-6">
            <div className="flex items-center">
              <RadioButton
                inputId="rental"
                name="status"
                value="Rental"
                onChange={(e) => setStatus(e.value)}
                checked={status === "Rental"}
              />
              <label htmlFor="rental" className="ml-2 font-bold text-black">
                Rental product
              </label>
            </div>

            <div className="flex items-center">
              <RadioButton
                inputId="sale"
                name="status"
                value="Sale"
                onChange={(e) => setStatus(e.value)}
                checked={status === "Sale"}
              />
              <label htmlFor="sale" className="ml-2  font-bold text-black">
                Sale item
              </label>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-6" />
      <div class="grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Rate Definition</h3>
        </div>
        <div class="col-span-5 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            {status === "Rental" && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
                  <div className="">
                    <div className="w-full">
                      <Link href={"/system-setup/rate-definition"}>
                        <label className="mt-2.5 block cursor-pointer text-[0.9em]  font-bold text-blue-500">
                          Rate Definition
                        </label>
                      </Link>

                      <Dropdown
                        value={rateDefinitionValue}
                        onChange={(e) => setrateDefinitionValue(e.value)}
                        options={minHireData}
                        optionLabel="name"
                        // placeholder="Select Rate Definiton"
                        name="rateDefinitionValue"
                        className="md:w-14rem w-full text-[0.9em]"
                        checkmark={true}
                        highlightOnSelect={false}
                      />
                      {/* <Select
                    className="text-[0.9em]"
                    name="rateDefinition"
                    placeholder="Select Rate Definiton"
                    value={formData.rateDefinition}
                    onChange={handleChange}
                  >
                    {minHireData?.map((item, index) => (
                      <option key={index} value={item?._id}>
                        {item.name}
                      </option>
                    ))}
                  </Select> */}
                    </div>
                  </div>
                  <div className=""></div>
                </div>
              </>
            )}
          </div>
          <div className="">
            {status === "Rental" && (
              <>
                <label className="mt-2.5 mt-3 block text-[0.9em] font-bold text-black">
                  Flat fee
                </label>
                <label className="m-0 text-[14px]">
                  Flat rate per period (for example: $50 per day)
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="">
                    <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                      Price
                    </label>
                    <InputText
                      name="rentPrice"
                      type="number"
                      placeholder="50"
                      value={formData.rentPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="">
                    <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                      Per
                    </label>
                    <InputText
                      isReadOnly
                      className="text-[0.9em]"
                      name="rate"
                      value={formData.rate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}
            {status === "Sale" && (
              <>
                <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                  Fixed Price
                </label>
                <label className="m-0 text-[14px]">
                  Fixed price per order (for example: $50 each)
                </label>
                <div className="w-[40%]">
                  <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                    Price
                  </label>
                  <InputText
                    name="salePrice"
                    type="number"
                    placeholder="50"
                    value={formData.salePrice}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="">
              <label className="mt-2.5 block text-[0.9em] font-bold text-black">
                Quantity
              </label>

              <InputText
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Link
                href={"/system-setup/tax-classes"}
                className="mt-2.5 block text-[0.9em] font-bold text-blue-500"
              >
                Tax Class
              </Link>
              <Dropdown
                value={taxClassValue}
                onChange={(e) => setTaxClassValue(e.value)}
                options={taxClass}
                optionLabel="name"
                placeholder="Select Tax Class"
                name="taxClass"
                className="md:w-14rem w-full text-[0.9em]"
                checkmark={true}
                highlightOnSelect={false}
              />
            </div>
          </div>
        </div>
      </div>
      <hr className="my-6" />
      <div class="grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Additional Info</h3>
        </div>
        <div class="col-span-5 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col">
              <label className="text-[0.9em]">Length Unit</label>
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  {formData.lenghtUnit}
                </span>
                <Dropdown
                  value={formData.lenghtUnit}
                  onChange={handleChange}
                  options={[
                    { name: "Centimetre", value: "cm" },
                    { name: "Feet", value: "ft" },
                    { name: "Inch", value: "in" },
                    { name: "Metre", value: "m" },
                    { name: "Millimetre", value: "mm" },
                    { name: "Yard", value: "yd" },
                  ]}
                  optionLabel="name"
                  name="lenghtUnit"
                  className="md:w-14rem w-full text-[0.9em]"
                  checkmark={true}
                  highlightOnSelect={false}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[0.9em]">Weight Unit</label>
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  {formData.weightUnit}
                </span>
                <Dropdown
                  value={formData.weightUnit}
                  onChange={handleChange}
                  options={[
                    { name: "Kilogrammes", value: "kg" },
                    { name: "Pounds", value: "lb" },
                  ]}
                  optionLabel="name"
                  name="weightUnit"
                  className="md:w-14rem w-full text-[0.9em]"
                  checkmark={true}
                  highlightOnSelect={false}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[0.9em]">Weight</label>
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  {formData.weightUnit}
                </span>
                <InputText
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  type="number"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[0.9em]">Length</label>
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  {formData.lenghtUnit}
                </span>
                <InputText
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  type="number"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[0.9em]">Width</label>
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  {formData.lenghtUnit}
                </span>
                <InputText
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  type="number"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[0.9em]">Height</label>
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  {formData.lenghtUnit}
                </span>
                <InputText
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-6" />
      <div class="grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          <h3 className="font-bold">Upload Product Photos </h3>
        </div>
        <div class="col-span-5 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div {...getRootProps()} className="dropzone mt-2">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <div className="flex h-46 items-center justify-center rounded-xl bg-[#fafafa]">
                  <i className="pi pi-upload text-[40px]" />
                </div>
              )}
            </div>
            {previews.length > 0 && (
              <div className="p-5">
                <div className="item-center flex justify-start gap-3">
                  {previews.map(({ preview }, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                    >
                      <div
                        key={index}
                        onClick={() => handleDelete(index)}
                        className="group relative flex items-center justify-center hover:bg-gray"
                      >
                        <div
                          style={{ position: "absolute" }}
                          className="group-hover: hidden  group-hover:block"
                        >
                          <i
                            color={"black"}
                            className="pi pi-trash text-[30px]"
                          />
                        </div>
                        <div className="flex h-40 w-40 bg-[#fafafa]">
                          <img
                            className="group-hover:opacity-40"
                            src={preview}
                            alt={`Preview ${index + 1}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {error && files.length == 0
              ? files.length == 0 && (
                  <label className="text-[0.8em] text-red">
                    Product images is required.
                  </label>
                )
              : ""}
          </div>
        </div>
      </div>
      <hr className="my-6" />
      <div class="mt-5 grid grid-cols-10 gap-4">
        <div class="col-span-2  p-4 ">
          {/* <h3 className="font-bold">Upload Product Photos </h3> */}
        </div>
        <div class="col-span-5  p-4">
          <div className="flex justify-end gap-7 ">
            <div className="">
              <Button label="Cancel" onClick={handleSubmit} />
            </div>
            <div className="">
              <Button label="Save" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
