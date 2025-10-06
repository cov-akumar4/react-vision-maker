import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { DataTable } from "@/components/dashboard/DataTable";
import { MapSection } from "@/components/dashboard/MapSection";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isClient } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-60 transition-all duration-300">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <DashboardHeader />
          {!isClient && (
            <>
              <FilterSection />
              <StatsCards />
              <ChartsSection />
              <DataTable />
              <MapSection />
            </>
          )}
          {isClient && (
            <div className="mt-8 text-center">
              <p className="text-lg text-muted-foreground">
                Welcome! Use the sidebar to navigate to your inspections.
              </p>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>&copy; 2025 PowerScan Analytics. All rights reserved.</div>
            <div>Version 3.2.1</div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
