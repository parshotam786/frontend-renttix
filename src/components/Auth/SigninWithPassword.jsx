"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { setLoginData } from "@/store/authSlice";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  remember: Yup.boolean(),
});
export default function SigninWithPassword() {
  const [data, setData] = useState({
    remember: false,
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const [loader, setloader] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const BaseURL = process.env.NEXT_PUBLIC_API_URL;
  console.log(process.env.NEXT_PUBLIC_API_URL);
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setloader(true);
    try {
      const response = await axios.post(`${BaseURL}/vender-login`, values);
      if (response.message === "Login successful") {
        setloader(false);
      }

      const output = response?.data;
      console.log(output);
      dispatch(setLoginData(output));
      // if (
      //   ["Admin", "Seller", "Operator", "Editor", "Supervisor"].includes(
      //     output?.role
      //   )
      // ) {

      router.push("/dashboard");
      // }
    } catch (error) {
      setloader(false);
      setErrors({ api: error.response.data.message });
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "", remember: false }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
              Email
            </label>
            <div className="relative">
              <Field
                as={InputText}
                type="email"
                placeholder="Enter your email"
                name="email"
              />

              <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                <i
                  className="pi pi-envelope"
                  style={{ fontSize: "1.3rem" }}
                ></i>
              </span>
            </div>
            {errors.email && (
              <p className="text-[15px] text-red">{errors.email}</p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
              Password
            </label>
            <div className="relative">
              <Field
                as={InputText}
                type={show ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete="password"
                className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />

              <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
                {show ? (
                  <i
                    className="pi pi-eye"
                    style={{ fontSize: "1.3rem" }}
                    pi-envelope
                    onClick={handleClick}
                  ></i>
                ) : (
                  <i
                    className="pi pi-eye-slash"
                    onClick={handleClick}
                    style={{ fontSize: "1.3rem" }}
                  ></i>
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-[15px] text-red">{errors.password}</p>
            )}
          </div>

          <div className="mb-6 flex items-center justify-between gap-2 py-2">
            <label
              htmlFor="remember"
              className="flex cursor-pointer select-none items-center font-satoshi text-base font-medium text-dark dark:text-white"
            >
              <Field
                type="checkbox"
                name="remember"
                id="remember"
                className="peer sr-only"
              />
              <span
                className={`mr-2.5 inline-flex h-5.5 w-5.5 items-center justify-center rounded-md border border-stroke bg-white text-white text-opacity-0 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-opacity-100 dark:border-stroke-dark dark:bg-white/5 ${
                  data.remember ? "bg-primary" : ""
                }`}
              >
                <svg
                  width="10"
                  height="7"
                  viewBox="0 0 10 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.70692 0.292787C9.89439 0.480314 9.99971 0.734622 9.99971 0.999786C9.99971 1.26495 9.89439 1.51926 9.70692 1.70679L4.70692 6.70679C4.51939 6.89426 4.26508 6.99957 3.99992 6.99957C3.73475 6.99957 3.48045 6.89426 3.29292 6.70679L0.292919 3.70679C0.110761 3.51818 0.00996641 3.26558 0.0122448 3.00339C0.0145233 2.74119 0.119692 2.49038 0.3051 2.30497C0.490508 2.11956 0.741321 2.01439 1.00352 2.01211C1.26571 2.00983 1.51832 2.11063 1.70692 2.29279L3.99992 4.58579L8.29292 0.292787C8.48045 0.105316 8.73475 0 8.99992 0C9.26508 0 9.51939 0.105316 9.70692 0.292787Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Remember me
            </label>

            <Link
              href="/auth/forgot-password"
              className="select-none font-satoshi text-base font-medium text-dark underline duration-300 hover:text-primary dark:text-white dark:hover:text-primary"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mb-4.5">
            <Button
              label=" Sign In"
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              loading={loader}
            />
          </div>
          {errors.api && <p className="mt-3 text-red">{errors.api}</p>}
        </Form>
      )}
    </Formik>
  );
}
