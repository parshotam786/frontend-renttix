"use client";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import TopHeader from "@/components/navbar/TopHeader";
import { Button } from "primereact/button";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (index) => {
    if (isDropdownOpen === index) {
      setDropdownOpen(null); // Close dropdown if it's already open
    } else {
      setDropdownOpen(index); // Open the clicked dropdown
    }
  };

  return (
    <>
      <nav class="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div class="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between p-4">
          <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="/images/logo/logo-dark.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
          </a>
          <button
            data-collapse-toggle="navbar-dropdown"
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
            aria-controls="navbar-dropdown"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
            <ul class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 text-[18px] font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900 rtl:space-x-reverse">
              <li>
                <a
                  href="#"
                  class="block rounded bg-orange-700 px-3 py-2 text-white dark:bg-orange-600 md:bg-transparent md:p-0 md:text-orange-700 md:dark:bg-transparent md:dark:text-orange-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <button
                  id="dropdownNavbarLink"
                  data-dropdown-toggle="dropdownNavbar"
                  class="flex w-full items-center justify-between rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:text-white md:w-auto md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-orange-700 md:dark:hover:bg-transparent md:dark:hover:text-orange-500"
                >
                  Dropdown{" "}
                  <svg
                    class="ms-2.5 h-2.5 w-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>

                <div
                  id="dropdownNavbar"
                  class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white font-normal shadow dark:divide-gray-600 dark:bg-gray-700"
                >
                  <ul
                    class="py-2 text-sm text-gray-700 dark:text-gray-400"
                    aria-labelledby="dropdownLargeButton"
                  >
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Earnings
                      </a>
                    </li>
                  </ul>
                  <div class="py-1">
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <a
                  href="#"
                  class="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-orange-700 md:dark:hover:bg-transparent md:dark:hover:text-orange-500"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-orange-700 md:dark:hover:bg-transparent md:dark:hover:text-orange-500"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-orange-700 md:dark:hover:bg-transparent md:dark:hover:text-orange-500"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button
              label="Try fro free "
              severity="warning"
              style={{ borderRadius: "35px" }}
            />
          </div>
        </div>
      </nav>
      <TopHeader />
      <div className="h-[440px]"></div>
    </>
  );
};

export default Navbar;
