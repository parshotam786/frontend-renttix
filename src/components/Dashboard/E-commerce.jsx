import React from "react";
import StackedBar from "../Chat/StackedBar";
import LineStyles from "../Chat/LineStyles";
import DoughnutChart from "../Chat/DoughnutChart";
import LastOrder from "./LastOrder";

const Ecommerce = () => {
  return (
    <div>
      <div class="mt-5 grid grid-cols-12 gap-4">
        <div class="col-span-2  bg-white p-4">
          <div className="my-auto flex h-[100%] items-center justify-center">
            <DoughnutChart />
          </div>
        </div>
        <div class="col-span-5  bg-white p-4">
          <div className="flex h-[100%] w-full flex-col justify-end">
            <StackedBar />
          </div>
        </div>
        <div class="col-span-5  bg-white p-4">
          <LineStyles />
        </div>
      </div>
      <div class="mt-5 grid grid-cols-12 gap-4">
        <div class="col-span-8  bg-white p-4">
          <LastOrder />
        </div>

        <div class="col-span-4 bg-white p-4">
          <label htmlFor="">Transactions</label>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
