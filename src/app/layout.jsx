"use client";
// import "jsvectormap/dist/css/jsvectormap.css";
// import "flatpickr/dist/flatpickr.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { PrimeReactProvider } from "primereact/api";
import ReduxProvider from "@/components/ReduxProvider";

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReduxProvider>
          <PrimeReactProvider>
            {loading ? <Loader /> : children}
          </PrimeReactProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
