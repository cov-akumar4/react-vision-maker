import { Bolt, LayoutDashboard, MapPin, FileText, TrendingUp, BarChart3, Flame, Users, Settings, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    title: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true },
      { icon: Bolt, label: "Inspections" },
      { icon: MapPin, label: "KML Viewer" },
      { icon: FileText, label: "PDF Reports" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { icon: TrendingUp, label: "Performance" },
      { icon: BarChart3, label: "Power BI Integration" },
      { icon: Flame, label: "FLIR Analytics" },
    ],
  },
  {
    title: "Management",
    items: [
      { icon: Users, label: "User Access" },
      { icon: Settings, label: "Settings" },
      { icon: Database, label: "Backup" },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar-background text-sidebar-foreground z-50 transition-transform duration-300 flex flex-col w-60",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3">
          <div className="relative">
            <Bolt className="w-8 h-8 text-primary fill-primary" />
            <div className="absolute inset-0 bg-secondary/70 blur-sm -z-10" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">PowerScan</h1>
            <p className="text-xs opacity-80">Power Line Diagnosis</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs uppercase opacity-60 mb-2 px-2 tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.label}
                    variant={item.active ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      item.active
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">Admin Manager</h4>
              <p className="text-xs opacity-70 truncate">admin@powerscan.com</p>
              <span className="inline-block mt-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                Admin Access
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
