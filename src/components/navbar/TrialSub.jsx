import { Button } from "primereact/button";
import React from "react";

const TrialSub = () => {
  return (
    <section className="mx-auto  max-w-screen-2xl rounded-2xl  bg-[#F0F0F0] p-4 ">
      <div className="flex w-full flex-col items-center gap-6  ">
        <div className="flex flex-col gap-3 p-2 text-center">
          <label
            htmlFor=""
            className="text-[40px] font-semibold leading-tight text-[#131314] sm:text-[55px] lg:text-[60px]"
          >
            Lorem ipsum dolor sit amet
          </label>
          <label
            htmlFor=""
            className="text-[16px] sm:text-[18px] md:text-[22px]"
          >
            Get started and see the benefits of rental software.
          </label>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex space-x-4">
            <a
              href="#"
              className="rounded-full bg-orange-500 px-8 py-3 font-medium text-white shadow-md transition hover:bg-orange-600"
            >
              Start free trial
            </a>
            <a
              href="#"
              className="rounded-full border border-orange-500 px-8 py-3 font-medium text-orange-500 transition hover:text-orange-600"
            >
              Watch demo
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-[16px] text-[#131314] sm:text-[18px]">
            <i className="pi pi-check-circle text-orange-400" />
            <label htmlFor="">Free 14-day trial</label>
          </div>
          <div className="flex items-center gap-2 text-[16px] text-[#131314] sm:text-[18px]">
            <i className="pi pi-check-circle text-orange-400" />
            <label htmlFor="">No credit card required</label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrialSub;
