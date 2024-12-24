import { Button } from "primereact/button";
import React from "react";
import { SiTelegram } from "react-icons/si";

const TopHeader = () => {
  return (
    <div className="flex  flex-col items-center justify-center  ">
      {/* <img src="images/navbar/ranttixbg.png" className="w-full" alt="" /> */}

      <div className="flex w-full flex-col items-center justify-center bg-[url('/images/navbar/ranttixbg.png')] bg-cover px-4">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between">
          <div className="flex w-full flex-col items-center gap-6 pt-32 sm:pt-96 md:mt-96">
            <div className="flex flex-col gap-3 p-2 text-center">
              <label
                htmlFor=""
                className="text-[40px] font-semibold leading-tight text-[#131314] sm:text-[55px] lg:text-[60px]"
              >
                Lorem ipsum dolor sit amet <br /> consectetur. In egestas.
              </label>
              <label
                htmlFor=""
                className="text-[16px] sm:text-[18px] md:text-[22px]"
              >
                Lorem ipsum dolor sit amet consectetur. Ligula sed felis amet
                <br />
                urna condimentum. Enim consectetur at lobortis suspendisse.
              </label>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="">
                <Button label="Submit" icon="pi pi-arrow-right" />
              </div>
              <div className="">
                <Button>Watch Demo</Button>
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
            <div className="flex w-full flex-wrap items-center justify-center gap-8 pt-26 sm:gap-12">
              <div className="">
                <img
                  src="/images/navbar/quickbook.png"
                  alt=""
                  className="w-[150px] sm:w-[180px]"
                />
              </div>
              <div className="">
                <img
                  src="/images/navbar/verify.png"
                  alt=""
                  className="w-[150px] sm:w-[180px]"
                />
              </div>
              <div className="">
                <img
                  src="/images/navbar/xero.png"
                  alt=""
                  className="w-[150px] sm:w-[180px]"
                />
              </div>
              <div className="">
                <img
                  src="/images/navbar/gohire.png"
                  alt=""
                  className="w-[150px] sm:w-[180px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section with description */}
      <div className="mb-10 mt-10 flex w-full flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <label
            htmlFor=""
            className="text-center text-[30px] font-bold leading-snug text-[#28170B] sm:text-[40px] md:text-[45px] lg:text-[55px]"
          >
            Lorem ipsum dolor sit amet consectetur.
          </label>
          <label
            htmlFor=""
            className="text-center text-[14px] leading-relaxed text-[#333] sm:text-[16px] md:text-[18px] lg:text-[20px]"
          >
            Lorem ipsum dolor sit amet consectetur. Massa sed amet fermentum
            duis egestas suspendisse lorem mattis at. Molestie adipiscing libero
            arcu et. Volutpat nibh at mi et convallis lorem eget eu dictum.
            <br />
            Sapien maecenas non a ut arcu laoreet.
          </label>
        </div>
      </div>

      {/* Cards section */}
      <div className="flex flex-wrap justify-center gap-5 px-4">
        <div className="flex h-[144px] w-[300px] items-center justify-around gap-4 rounded-xl bg-orange-400 p-4 sm:w-[440px]">
          <div className="">
            <SiTelegram className="text-[50px] text-white sm:text-[75px]" />
          </div>
          <div className="">
            <label
              htmlFor=""
              className="text-[18px] text-white sm:text-[20px] md:text-[25px]"
            >
              Unmatched Innovation and Versatility
            </label>
          </div>
        </div>

        <div className="flex h-[144px] w-[300px] items-center justify-around gap-4 rounded-xl bg-[#F0F0F0] p-4 sm:w-[440px]">
          <div className="">
            <SiTelegram className="text-[50px] text-[#28170B] sm:text-[75px]" />
          </div>
          <div className="">
            <label
              htmlFor=""
              className="text-[18px] text-[#28170B] sm:text-[20px] md:text-[25px]"
            >
              Unmatched Innovation and Versatility
            </label>
          </div>
        </div>

        <div className="flex h-[144px] w-[300px] items-center justify-around gap-4 rounded-xl bg-[#F0F0F0] p-4 sm:w-[440px]">
          <div className="">
            <SiTelegram className="text-[50px] text-[#28170B] sm:text-[75px]" />
          </div>
          <div className="">
            <label
              htmlFor=""
              className="text-[18px] text-[#28170B] sm:text-[20px] md:text-[25px]"
            >
              Unmatched Innovation and Versatility
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
