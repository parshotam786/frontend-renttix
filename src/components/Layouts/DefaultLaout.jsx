"use client";
import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import { setUpdateUser } from "@/store/authSlice";

export default function DefaultLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      const res = await axios?.get(
        `${process.env.NEXT_PUBLIC_API_URL}/vender/profile/${user?._id}`,
      );
      if (res.data) {
        dispatch(setUpdateUser(res.data?.data?.user));
        Cookies.set("xpdx_s", res.data?.data?.user?.status);

        // dispatch(setLoginData({ status: res?.data?.data?.user?.status }));
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      {/* <!-- ===== Page Wrapper Star ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Star ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Star ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Star ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Star ===== --> */}
          <main>
            {/* <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div> */}
            <div className="mx-auto p-4 md:p-6 2xl:p-10">{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
