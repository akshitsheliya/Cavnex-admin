import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen text="Loading dashboard..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 min-h-full">
            <div className="max-w-7xl mx-auto animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
