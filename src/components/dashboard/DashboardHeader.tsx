import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';

interface DashboardHeaderProps {
  currentView: string;
}

export function DashboardHeader({ currentView }: DashboardHeaderProps) {
  const { t } = useTranslation();

  const getBreadcrumbs = () => {
    const parts = currentView.split('/');
    const breadcrumbs = [{ label: t('home'), path: 'dashboard' }];

    if (parts[0] === 'inspections' && parts.length > 1) {
      breadcrumbs.push({ label: t('inspections'), path: 'inspections' });
      breadcrumbs.push({ label: t(parts[1]), path: currentView });
    } else if (parts[0] === 'system' && parts.length > 1) {
      breadcrumbs.push({ label: t('system'), path: 'system' });
      breadcrumbs.push({ label: t(parts[1]), path: currentView });
    } else if (currentView !== 'dashboard') {
      breadcrumbs.push({ label: t(currentView), path: currentView });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4" />}
            <span className={index === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
              {crumb.label}
            </span>
          </div>
        ))}
      </div>
      <h1 className="text-3xl font-bold mb-2">{t('dashboardTitle')}</h1>
      <p className="text-muted-foreground">
        {t('dashboardSubtitle')}
      </p>
    </div>
  );
}
