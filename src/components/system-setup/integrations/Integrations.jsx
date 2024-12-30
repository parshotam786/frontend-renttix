import Link from "next/link";
import React from "react";

const Integrations = () => {
  return (
    <div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-12 ">
        <div class="col-span-12 p-4  lg:col-span-3 xl:col-span-2 ">
          <h3 className="font-bold"> Integrations</h3>
        </div>
        <div class="col-span-12 rounded-lg bg-white p-4 dark:bg-dark md:col-span-12 md:w-[100%] lg:col-span-9 lg:w-[100%]  xl:col-span-9 xl:w-[70%] 2xl:w-[70%]">
          <label className="my-3 font-bold">Account</label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
            <div className="h-auto cursor-pointer rounded-md border-2 p-4">
              <div className="col-2 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                <Link href={"/system-setup/integrations/quickbook"}>
                  <div className="flex items-center justify-center">
                    <img
                      className="h-32 w-32"
                      src="/images/QuickBooks.png"
                      alt=""
                    />
                  </div>
                </Link>
                <Link href={"/system-setup/integrations/quickbook"}>
                  <div className="flex flex-col">
                    <label className="font-bold">QuickBooks</label>
                    <label>
                      Integrate with QuickBooks accounting software to provide
                      the ability to post your invoices into QuickBooks and keep
                      your accounts and QuickBooks contacts in sync.
                    </label>
                  </div>
                </Link>
              </div>
            </div>
            {/* <div className="h-auto border-2 p-4 rounded-md">
            <label>Quick Book</label>
          </div>
          <div className="h-auto border-2 p-4 rounded-md">
            <label>Quick Book</label>
            
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
