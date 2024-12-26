import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";

const Footer = () => {
  return (
    <section className="mx-auto  max-w-screen-2xl rounded-2xl  p-4 pt-10 ">
      <div className="py-7">
        <img src="/images/logo/logo-dark.svg" alt="" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col gap-5">
            <div className="">
              <h2 className="text-[26px] font-bold text-dark-2">Company</h2>
            </div>
            <label htmlFor="" className="text-[18px] text-dark-2">
              About
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Pricing
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Contact
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Newsroom
            </label>
          </div>
          <div className="flex flex-col gap-5">
            <div className="">
              <h2 className="text-[26px] font-bold text-dark-2">Product</h2>
            </div>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Sales Management
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Features
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Product Updates
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Blog
            </label>
          </div>
          <div className="flex flex-col gap-5">
            <div className="">
              <h2 className="text-[26px] font-bold text-dark-2">Resouces</h2>
            </div>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Blog
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Customer Stories
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Product Support
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Help Center
            </label>
            <label htmlFor="" className="text-[18px] text-dark-2">
              Security
            </label>
          </div>
        </div>
        <div className="">
          <div className="pb-8">
            <h2 className="text-[26px] font-bold text-dark-2">
              Subscribe to our newsletter
            </h2>
          </div>
          <div className="relative w-full flex-1">
            <input
              className="w-full rounded-full border-[1px] border-orange-500 px-4  py-4  focus:border-orange-500 focus-visible:border-[1px] focus-visible:border-orange-500 active:border-orange-500"
              placeholder="Enter your Email"
            />
            <a
              href="#"
              className="absolute right-[5px] top-[5px]   rounded-full bg-orange-500 px-8 py-3 font-medium text-white shadow-md transition hover:bg-orange-600"
            >
              Try for free
            </a>
          </div>
          <div className="py-4">
            <label htmlFor="" className="text-[18px] text-dark-2">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam quaerat
              voluptatem.
            </label>
          </div>
        </div>
      </div>
      <div className="mb-5 mt-15 w-full bg-black pb-[1px]"></div>

      <div className="flex items-center justify-between">
        <div className="flex gap-5">
          <label htmlFor="" className="text-[18px] text-dark-2">
            Terms & Conditions
          </label>
          <label htmlFor="" className="text-[18px] text-dark-2">
            Privacy Policy
          </label>
        </div>
        <div className="">
          <label htmlFor="" className="text-[18px] text-dark-2">
            © 2024. All Rights Reserved{" "}
          </label>
        </div>
      </div>
    </section>
  );
};

export default Footer;
