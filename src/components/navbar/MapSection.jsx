import React from "react";

const MapSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto    py-40 ">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <label
              htmlFor=""
              className="text-center text-[56px] font-bold leading-[57px] text-dark-2"
            >
              Over 6000 rental businesses already use us, why dont you?
            </label>
          </div>
          <div className="">
            <a
              href="#"
              className="rounded-full bg-orange-500 px-16 py-4 font-medium text-white shadow-md transition hover:bg-orange-600"
            >
              Join them now
            </a>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="w-full ">
            <img src="/images/sections/maps.png" className="w-full" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
