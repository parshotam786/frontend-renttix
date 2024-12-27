import { NextResponse } from "next/server";

// Middleware function
export function middleware(request) {
  const xpdx = request.cookies.get("xpdx")?.value; // Authentication status
  const xpdx_r = request.cookies.get("xpdx_r")?.value; // User role
  const xpdx_s = request.cookies.get("xpdx_s")?.value; // User status

  const dashboardPaths = new Set([
    "/profile",
    "/dashboard",
    "/product/product-list",
    "/product/add-product",
    "/order/list",
    "/order/create",
    "/customer/create",
    "/customer/listing",
    "/system-setup",
    "/invoicing/invoice-batch",
    "/invoicing/invoice-run",
    "/system-setup/roles",
    "/system-setup/roles/add-role",
    "/system-setup/integrations",
    "/system-setup/integrations/quickbook",
    "/system-setup/listnames",
    "/system-setup/documentnumbers",
    "/system-setup/tax-classes",
    "/system-setup/tax-classes/add/account",
    "/system-setup/payment-terms",
    "/system-setup/payment-terms/add",
    "/system-setup/rate-definition",
    "/system-setup/invoice-run-code",
    "/system-setup/import-data",
  ]);

  const adminOnlyPaths = new Set(["/category", "/sellers"]); // Admin-only paths
  const authPaths = new Set(["/auth/register", "/auth/login"]);
  const restrictedStatuses = ["inactive", "pending", "deactive"]; // Restricted statuses

  const url = new URL(request.url);

  // Allow access to the /dashboard for restricted users to prevent loops
  if (xpdx_s && restrictedStatuses.includes(xpdx_s)) {
    if (dashboardPaths.has(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", url));
    }
    // If already on /dashboard, allow access
    if (request.nextUrl.pathname === "/dashboard") {
      return NextResponse.next();
    }
  }

  // Admin-only access to specific paths
  if (adminOnlyPaths.has(request.nextUrl.pathname)) {
    if (xpdx_r !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", url));
    }
  }

  // Redirect logged-in users away from auth routes
  if (xpdx && authPaths.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", url));
  }

  // Redirect guests to login for protected routes, including dynamic routes
  const protectedRoutes = [
    ...dashboardPaths,
    "/order/",
    "/product/",
    "/customer/",
    "/invoicing/",
    "/system-setup/",
  ];
  const isProtected = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!xpdx && isProtected) {
    return NextResponse.redirect(new URL("/", url));
  }
}

// Configuration for the middleware matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Exclude static files and APIs
    "/order/:path*", // Include dynamic route patterns explicitly
    "/product/:path*", // Include dynamic route patterns explicitly
  ],
};
