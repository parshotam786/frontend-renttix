"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useSelector } from "react-redux";

const NavigationBar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const path = usePathname();
  const { token } = useSelector((state) => state?.authReducer);

  console.log(path, "ddd");

  const toggleDropdown = (index) => {
    if (isDropdownOpen === index) {
      setDropdownOpen(null); // Close dropdown if it's already open
    } else {
      setDropdownOpen(index); // Open the clicked dropdown
    }
  };

  useEffect(() => {
    if (menuOpen) {
      gsap.to(".mobile-menu", {
        x: 0, // Slide in from the left
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(".mobile-menu", {
        x: "-100%", // Slide out to the left
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [menuOpen]);

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link className="text-xl font-bold text-gray-800" href="/">
                <img
                  src="/images/logo/logo-dark.svg"
                  className="h-8"
                  alt="Flowbite Logo"
                />
              </Link>
            </div>

            {/* Middle - Services */}
            <div className="hidden space-x-8 md:flex">
              <Link
                className="block py-2 font-semibold text-dark-2 hover:text-orange-600"
                href="/services"
              >
                How It Works
              </Link>
              <Link
                className="block py-2 font-semibold text-dark-2 hover:text-orange-600"
                href="/services"
              >
                Product
              </Link>
              <Link
                className="block py-2 font-semibold text-dark-2 hover:text-orange-600"
                href="/services"
              >
                Pricing
              </Link>
              <Link
                className="block py-2 font-semibold text-dark-2 hover:text-orange-600"
                href="/services"
              >
                Resources
              </Link>
              <Link
                className="block py-2 font-semibold text-dark-2 hover:text-orange-600"
                href="/services"
              >
                FAQ
              </Link>
            </div>

            {/* Login Button */}
            <div className="hidden gap-3 md:flex">
              {path != "/login/login" && (
                <>
                  {!token && (
                    <Link
                      className="block py-2 font-semibold text-dark-2 hover:text-orange-600"
                      href="/login/login"
                    >
                      Log In
                    </Link>
                  )}{" "}
                </>
              )}

              {token ? (
                <a
                  href="/dashboard"
                  className="rounded-full bg-orange-500 px-8 py-3 font-medium text-white shadow-md transition hover:bg-orange-600"
                >
                  Dashboard
                </a>
              ) : (
                <a
                  href="/signup"
                  className="rounded-full bg-orange-500 px-8 py-3 font-medium text-white shadow-md transition hover:bg-orange-600"
                >
                  Start free trial
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="block py-2 text-dark-2 hover:text-orange-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      menuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16m-7 6h7"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`mobile-menu bg-orange-300 shadow-md md:hidden ${menuOpen ? "block" : "hidden"}`}
        >
          <div className="px-4 py-2">
            <Link
              className="block py-2 text-dark-2 hover:text-orange-600"
              href="/services"
            >
              How It Works
            </Link>
            <Link
              className="block py-2 text-dark-2 hover:text-orange-600"
              href="/services"
            >
              Product
            </Link>
            <Link
              className="block py-2 text-dark-2 hover:text-orange-600"
              href="/services"
            >
              Pricing
            </Link>
            <Link
              className="block py-2 text-dark-2 hover:text-orange-600"
              href="/services"
            >
              Resources
            </Link>
            <Link
              className="block py-2 text-dark-2 hover:text-orange-600"
              href="/services"
            >
              FAQ
            </Link>
            <Link className="block py-2 text-orange-600" href="/login">
              Login
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
