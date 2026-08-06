/* ============================================
   DashboardLayout — sidebar + navbar + content
   ============================================ */
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/useMediaQuery';

const DashboardLayout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} isMobile={isMobile} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar sidebarOpen={sidebarOpen} onSidebarToggle={toggleSidebar} />

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
