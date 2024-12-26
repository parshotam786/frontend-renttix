import React from "react";

const BlogPost = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto  max-w-screen-2xl px-4 pb-40 ">
        <div className="mb-4 flex items-center justify-between">
          <div className="">
            <label htmlFor="" className="text-[46px] font-bold text-[#131314]">
              Recent Blog Posts
            </label>
          </div>
          <div className="">
            <a
              href="#"
              className="rounded-full bg-orange-500 px-8 py-3 font-medium text-white shadow-md transition hover:bg-orange-600"
            >
              View All
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-20 py-4  sm:grid-cols-1 md:grid-cols-3 md:gap-40">
          <div className="flex flex-col gap-1">
            <img src="/images/blogs/blog1.png" alt="" />
            <label htmlFor="" className="font-bold text-[#17012C]">
              Lorem ipsum dolor sit amet consectetur. Sit viverra vitae.
            </label>
            <label htmlFor="">
              Lorem ipsum dolor sit amet consectetur. Et senectus ac lectus
              gravida neque ac arcu leo.
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <img src="/images/blogs/blog2.png" alt="" />
            <label htmlFor="" className="font-bold text-[#17012C]">
              Lorem ipsum dolor sit amet consectetur. Sit viverra vitae.
            </label>
            <label htmlFor="">
              Lorem ipsum dolor sit amet consectetur. Et senectus ac lectus
              gravida neque ac arcu leo.
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <img src="/images/blogs/blog3.png" alt="" />
            <label htmlFor="" className="font-bold text-[#17012C]">
              Lorem ipsum dolor sit amet consectetur. Sit viverra vitae.
            </label>
            <label htmlFor="">
              Lorem ipsum dolor sit amet consectetur. Et senectus ac lectus
              gravida neque ac arcu leo.
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPost;
