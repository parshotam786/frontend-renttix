import { Button } from "primereact/button";
import React, { useEffect, useRef } from "react";
import { SiTelegram } from "react-icons/si";
import { gsap } from "gsap";

const TopHeader = () => {
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const textRef = useRef([]);

  useEffect(() => {
    // Header animation
    gsap.from(headerRef.current, {
      opacity: 0,
      y: -50,
      duration: 1.5,
      ease: "power2.out",
    });

    // Cards animation
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 50,
      stagger: 0.3,
      duration: 1,
      ease: "power2.out",
    });

    // Text animation
    gsap.from(textRef.current, {
      opacity: 0,
      scale: 0.8,
      stagger: 0.2,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <div
        ref={headerRef}
        className="flex w-full flex-col items-center justify-center bg-white bg-cover px-4 md:bg-[url('/images/navbar/ranttixbg.png')]"
      >
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between">
          <div className="flex w-full flex-col items-center gap-6 pt-32 sm:pt-96">
            <div
              ref={(el) => (textRef.current[0] = el)}
              className="flex flex-col gap-3 p-2 text-center"
            >
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
            <div
              ref={(el) => (textRef.current[1] = el)}
              className="flex flex-col gap-3 sm:flex-row"
            >
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

      {/* Cards section */}
      <div className="mt-14 flex flex-wrap justify-center gap-5 px-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`flex h-[144px] w-[300px] items-center justify-around gap-4 rounded-xl p-4 sm:w-[440px] ${
              i === 0 ? "bg-orange-400" : "bg-[#F0F0F0]"
            }`}
          >
            <div>
              <SiTelegram
                className={`text-[50px] ${
                  i === 0 ? "text-white" : "text-[#28170B]"
                } sm:text-[75px]`}
              />
            </div>
            <div>
              <label
                htmlFor=""
                className={`text-[18px] ${
                  i === 0 ? "text-white" : "text-[#28170B]"
                } sm:text-[20px] md:text-[25px]`}
              >
                Unmatched Innovation and Versatility
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopHeader;
