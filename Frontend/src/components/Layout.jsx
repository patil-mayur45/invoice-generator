import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition.jsx";

const TITLES = {
  "/": "Dashboard",
  "/invoices": "Invoices",
  "/clients": "Clients",
  "/settings": "Settings",
};

const titleFor = (pathname) => {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/invoices")) return "Invoices";
  if (pathname.startsWith("/clients")) return "Clients";
  return "Invoicely";
};

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={titleFor(location.pathname)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
