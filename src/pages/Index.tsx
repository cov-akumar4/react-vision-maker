import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { DataTable } from "@/components/dashboard/DataTable";
import { MapSection } from "@/components/dashboard/MapSection";
import { AccessControlModal } from "@/components/dashboard/AccessControlModal";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-60 transition-all duration-300">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenAccessModal={() => setAccessModalOpen(true)}
        />

        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <DashboardHeader />
          <FilterSection />
          <StatsCards />
          <ChartsSection />
          <DataTable />
          <MapSection />

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>&copy; 2025 PowerScan Analytics. All rights reserved.</div>
            <div>Version 3.2.1</div>
          </footer>
        </div>
      </main>

      {/* Access Control Modal */}
      <AccessControlModal open={accessModalOpen} onOpenChange={setAccessModalOpen} />
    </div>
  );
};

export default Index;
