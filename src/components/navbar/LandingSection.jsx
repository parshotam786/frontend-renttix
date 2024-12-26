import { Tag } from "primereact/tag";
import React from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { LuLayoutTemplate } from "react-icons/lu";
import { IoSyncCircleOutline } from "react-icons/io5";
import { LuInbox } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineDocumentPlus } from "react-icons/hi2";

const LandingSection = () => {
  return (
    <div className="bg-white">
      <section className="mx-auto  max-w-screen-2xl p-4 pt-40 ">
        <div className="grid grid-cols-1 gap-20 py-4  sm:grid-cols-1 md:grid-cols-2 md:gap-40">
          <div className="">
            <img src="/images/sections/image.png" alt="" />
          </div>
          <div className="flex flex-col gap-8">
            <div className="">
              <Tag severity={"warning"} value="BOOST EFFICIENCY"></Tag>
            </div>
            <label htmlFor="" className="text-[26px] font-semibold text-dark-2">
              Lorem ipsum dolor sit amet consectetur. Quis sit pulvinar sagittis
              nec at mattis nisl. Cras vivamus.
            </label>
            <div className="mt-5">
              <label htmlFor="">
                Lorem ipsum dolor sit amet consectetur. Bibendum mattis sit nisi
                ipsum. Fames enim volutpat nibh pellentesque egestas ligula
                sodales eu ullamcorper. Risus a bibendum diam ut. Duis turpis
                sapien ullamcorper eleifend vitae orci. Eu feugiat et leo duis
                ultrices sit. Nibh a sed tempor hac hendrerit ut. Ut amet
                sagittis viverra luctus fames vel amet id nisi.
              </label>
            </div>
            <div className="flex items-center justify-start gap-4">
              <div className="">
                <IoIosCheckmarkCircleOutline className="text-[20px] text-orange-500" />
              </div>
              <div className="">
                <label htmlFor="" className="text-[18px] ">
                  Achieve higher deal closure rates with simplified single-page{" "}
                  <br />
                  contact management.
                </label>
              </div>
            </div>
            <div className="flex items-center justify-start gap-4">
              <div className="">
                <IoIosCheckmarkCircleOutline className="text-[20px] text-orange-500" />
              </div>
              <div className="">
                <label htmlFor="" className="text-[18px] ">
                  Experience the convenience of one-click calling, automated{" "}
                  <br />
                  call scripts, and voicemail management.
                </label>
              </div>
            </div>
            <div className="flex items-center justify-start gap-4">
              <div className="">
                <IoIosCheckmarkCircleOutline className="text-[20px] text-orange-500" />
              </div>
              <div className="">
                <label htmlFor="" className="text-[18px] ">
                  Keep your sales process on target by tracking stages and{" "}
                  <br />
                  milestones of your deals.
                </label>
              </div>
            </div>
            <div className="flex items-center justify-start gap-4">
              <div className="">
                <IoIosCheckmarkCircleOutline className="text-[20px] text-orange-500" />
              </div>
              <div className="">
                <label htmlFor="" className="text-[18px] ">
                  Achieve higher deal closure rates with simplified single-page
                  contact management.
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="">
              <Tag severity={"warning"} value="IN-DEPTH DATA INSIGHTS"></Tag>
            </div>
            <label htmlFor="" className="text-[26px] font-semibold text-dark-2">
              Lorem ipsum dolor sit amet consectetur. Fames <br /> porttitor
              pulvinar quam vulputate. Ut eget integer.
            </label>
            <div className="">
              <label htmlFor="">
                Lorem ipsum dolor sit amet consectetur. Suspendisse a dolor
                vehicula quam libero varius sit volutpat at. Sapien in iaculis
                fermentum nisi. Eget velit odio sodales urna. Leo morbi congue
                vitae enim cursus. Orci diam interdum nisl in eu. Id volutpat
                tellus ornare vestibulum vitae nunc eget elit dignissim. Egestas
                ac turpis adipiscing ullamcorper massa nisl. Ultrices vestibulum
                amet mauris at vitae nec convallis quam. Vestibulum amet mi
                faucibus eu. Non aliquam egestas magna dolor. Sit fringilla at.
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="flex   h-13 w-13 items-center justify-center rounded-full bg-orange-500">
                  <LuLayoutTemplate className="text-[30px] text-white" />
                </div>
                <label className="text-[26px]" htmlFor="">
                  Dynamic Dashboard
                </label>
                <label htmlFor="" className="text-[18px">
                  Seamlessly merging numerous reports into one visually stunning
                  interface.
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex  h-13 w-13 items-center justify-center rounded-full bg-orange-500">
                  <IoSyncCircleOutline className="text-[30px] text-white" />
                </div>
                <label className="text-[26px]" htmlFor="">
                  Continuous Data Sync
                </label>
                <label htmlFor="" className="text-[18px">
                  Stay worry-free about data synchronization, our system ensures
                  continual harmony.
                </label>
              </div>
            </div>
          </div>
          <div className="">
            <img src="/images/sections/image2.png" alt="" />
          </div>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="">
            <button className="rounded-full bg-orange-500 px-20 py-5 text-[20px] text-white">
              Start free trial
            </button>
          </div>
        </div>
      </section>
      <section className="mx-auto  mb-40 max-w-screen-2xl p-4 ">
        <div className="flex flex-col items-center justify-center gap-6">
          <label htmlFor="" className="text-[56px] font-bold text-dark-2">
            Lorem ipsum dolor sit amet consectetur.
          </label>
          <label htmlFor="" className="text-center">
            Lorem ipsum dolor sit amet consectetur. Massa sed amet fermentum
            duis egestas suspendisse lorem mattis at. Molestie adipiscing libero
            arcu et. Volutpat nibh at mi et convallis lorem eget eu dictum.
            Sapien maecenas non a ut arcu laoreet.
          </label>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex  justify-start gap-5">
              <div className="">
                <LuInbox className="text-[30px] text-orange-500" />
              </div>
              <label className="">
                <span htmlFor="" className="text-[18px] font-semibold">
                  Easily create, manage and fulfill orders. <br />
                </span>
                Easily create, manage and fulfill orders. Whether you serve
                walk-ins or accept online bookings.
              </label>
            </div>
            <div className="flex  justify-start gap-5">
              <div className="">
                <IoSettingsOutline className="text-[30px] text-orange-500" />
              </div>
              <label className="">
                <span htmlFor="" className="text-[18px] font-semibold">
                  Easily create, manage and fulfill orders. <br />
                </span>
                Easily create, manage and fulfill orders. Whether you serve
                walk-ins or accept online bookings.
              </label>
            </div>
            <div className="flex  justify-start gap-5">
              <div className="">
                <HiOutlineDocumentPlus className="text-[30px] text-orange-500" />
              </div>
              <label className="">
                <span htmlFor="" className="text-[18px] font-semibold">
                  Easily create, manage and fulfill orders. <br />
                </span>
                Easily create, manage and fulfill orders. Whether you serve
                walk-ins or accept online bookings.
              </label>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img src="/images/sections/dashobard.png" alt="" />
          </div>
        </div>
      </section>
      <section className="mx-auto  my-40 max-w-screen-2xl p-4 ">
        <div className="flex flex-col items-center justify-center gap-6">
          <label htmlFor="" className="text-[56px] font-bold text-dark-2">
            Get paid in advance and reduce
          </label>
          <label htmlFor="" className="text-center">
            Customers who pay in advance on your website are more likely to show
            up for their booking. Isnt that what you want too?
          </label>
          <div className="grid grid-cols-1 rounded-3xl bg-[#F0F0F0] px-8 md:grid-cols-2">
            <div className="flex flex-col justify-center gap-5">
              <div className="py-3">
                <label
                  htmlFor=""
                  className="rounded-full bg-white px-3 text-[18px] text-orange-500"
                >
                  INTEGRATION
                </label>
              </div>
              <div className="">
                <label
                  htmlFor=""
                  className="text-[56px] font-bold leading-[70px] text-dark-2"
                >
                  Connect with the tools you’re already familiar with.
                </label>
              </div>
              <div className="">
                <label htmlFor="" className="text-dark-2">
                  Lorem ipsum dolor sit amet consectetur. Vitae volutpat aliquet
                  posuere facilisis sed. Nulla diam eu in donec etiam ipsum
                  aliquam vulputate. Eu scelerisque potenti sed diam. Phasellus
                  tempor in.
                </label>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img src="/images/sections/sharedoc.png" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto  max-w-screen-2xl px-4 py-40 ">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <label
              htmlFor=""
              className="text-center text-[56px] font-bold leading-[57px] text-dark-2"
            >
              Serve customers faster with order <br /> management on mobile
            </label>
          </div>
          <div className="">
            <label htmlFor="" className="text-center">
              Lorem ipsum dolor sit amet consectetur. Nibh ipsum porta non arcu
              nec libero. Quis tellus suscipit duis dolor.
            </label>
          </div>
          <div className="flex gap-4">
            <div className="">
              <img src="/images/sections/googleplay.png" alt="" />
            </div>
            <div className="">
              <img src="/images/sections/appstore.png" alt="" />
            </div>
          </div>
          <div className="">
            <img src="/images/sections/Background.png" alt="" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingSection;
