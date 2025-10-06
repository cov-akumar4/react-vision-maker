import { BarChart3, Home, FileText, Map, Settings, Users, X, Upload, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile, signOut, isAdmin, isClient } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const getMenuSections = () => {
    if (isAdmin) {
      return [
        {
          title: "Main",
          items: [
            { icon: Home, label: t('dashboard'), path: "/" },
            { icon: Users, label: t('clients'), path: "/admin/clients" },
          ],
        },
        {
          title: "Account",
          items: [
            { icon: UserCircle, label: t('profile'), path: "/profile" },
          ],
        },
      ];
    }
    
    if (isClient) {
      return [
        {
          title: "Main",
          items: [
            { icon: Home, label: t('dashboard'), path: "/" },
            { icon: Upload, label: t('inspections'), path: "/client/inspections" },
          ],
        },
        {
          title: "Account",
          items: [
            { icon: UserCircle, label: t('profile'), path: "/profile" },
          ],
        },
      ];
    }
    
    return [];
  };

  const menuSections = getMenuSections();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 lg:hidden transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-60 bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close Button (Mobile) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-3 right-3 lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-xl font-bold text-sidebar-primary-foreground">P</span>
            </div>
            <span className="text-xl font-semibold text-sidebar-foreground">PowerScan</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6">
          {menuSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={itemIdx}
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className={`
                        w-full justify-start gap-3 
                        ${isActive 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-xs text-sidebar-foreground/60">{profile?.email}</p>
              <p className="text-xs text-sidebar-accent-foreground bg-sidebar-accent px-2 py-1 rounded w-fit">
                {t(profile?.role || 'client')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
