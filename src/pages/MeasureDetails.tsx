import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown, Home, BarChart3, Calendar, MapPin, ThermometerSun, Bell } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileModal } from "@/components/ProfileModal";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const measureData = [
  { id: "b74d9f44-a2b4-4d93-89c7-bf9fdf83993", address: "Rua Samo Antonio Jardim Carolina 78890-000 Sorriso", date: "30/09/2025", time: "20:35:44", action: "", hotspot: "30.83", reprocessedAt: "-" },
  { id: "5dc07ac7-0560-4ade-8232-bf28e70a6c85", address: "Rua das Hortensias Parque Universitário 78891-138 Sorriso", date: "30/09/2025", time: "21:15:52", action: "", hotspot: "29.66", reprocessedAt: "-" },
  { id: "ca334235-d348-4867-a141-00b7bb5c94a", address: "Rua Eça de Queiroz Taiamã 78891-138 Sorriso", date: "30/09/2025", time: "20:46:01", action: "", hotspot: "31.80", reprocessedAt: "-" },
  { id: "fe0e4ef3-c0bc-4f13-b1fc-807a6244fb94", address: "", date: "30/09/2025", time: "20:27:14", action: "", hotspot: "36.53", reprocessedAt: "-" },
  { id: "8c29239b-3ac5-4031-974f-b7f534b66b6b", address: "", date: "29/09/2025", time: "22:11:39", action: "", hotspot: "41.51", reprocessedAt: "-" },
  { id: "8e5d9a85-5e3c-41B7-9b05-7bf0f043ac3d", address: "Rua Santa Catarina de Alexandria Parque Universitário 78891-138 Sorriso", date: "30/09/2025", time: "21:24:01", action: "Immediate Action", hotspot: "86.84", reprocessedAt: "-" },
  { id: "45b7896b-2f77-4dcb-8bd8-ef7d723e0e69", address: "Rua Santa Catarina de Alexandria Parque Universitário 78891-138 Sorriso", date: "30/09/2025", time: "21:24:14", action: "Immediate Action", hotspot: "83.07", reprocessedAt: "-" },
  { id: "c52ba81e-b48c-4bf4-b248-2d4caa5c77b7", address: "-", date: "30/09/2025", time: "21:22:56", action: "Immediate Action", hotspot: "73.74", reprocessedAt: "-" },
  { id: "a43969b3-124e-4c8a-956d-c6ff64adba05", address: "Rua Santa Catarina de Alexandria Parque Universitário 78891-138 Sorriso", date: "30/09/2025", time: "21:22:11", action: "Scheduled Action", hotspot: "53.56", reprocessedAt: "-" },
  { id: "0a6266ac-33c8-4e8d-b296-2ccc80c76759", address: "Rua Euclides da Cunha Pinheiros 78891-138 Sorriso", date: "30/09/2025", time: "20:58:28", action: "Scheduled Action", hotspot: "41.29", reprocessedAt: "-" },
];

const chartData = [
  { category: "Poles", feederElements: 600, inspectionMeasures: 552 },
  { category: "Poste", feederElements: 0, inspectionMeasures: 0 },
];

const actionsChartData = [
  { action: "Immediate Action", count: 3 },
  { action: "Scheduled Action", count: 15 },
  { action: "No Action", count: 306 },
  { action: "Action not Defined", count: 552 },
];

const chartConfig = {
  feederElements: {
    label: "Feeder Elements",
    color: "hsl(var(--chart-1))",
  },
  inspectionMeasures: {
    label: "Inspection Measures",
    color: "hsl(var(--chart-2))",
  },
};

export default function MeasureDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [statisticsOpen, setStatisticsOpen] = useState(true);
  const [measuresOpen, setMeasuresOpen] = useState(true);
  const [mapOpen, setMapOpen] = useState(true);

  const totalPages = Math.ceil(measureData.length / parseInt(entriesPerPage));
  const paginatedData = measureData.slice(
    (currentPage - 1) * parseInt(entriesPerPage),
    currentPage * parseInt(entriesPerPage)
  );

  const getActionBadge = (action: string) => {
    if (action === "Immediate Action") {
      return <Badge className="bg-destructive hover:bg-destructive/90 text-white">{t('immediateAction')}</Badge>;
    } else if (action === "Scheduled Action") {
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">{t('scheduledAction')}</Badge>;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-60 transition-all duration-300">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          <DashboardHeader 
            breadcrumbs={[
              { label: t('home'), path: "/" },
              { label: t('inspections'), path: "/distribution" },
              { label: t('distribution'), path: "/distribution" }
            ]}
            title={t('dashboardTitle')}
            subtitle={t('dashboardSubtitle')}
          />
        </div>
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-6 space-y-6 overflow-auto max-w-[1600px] mx-auto w-full">{/* Main content */}
          <div className="space-y-6">

      {/* Statistics Section */}
      <Collapsible open={statisticsOpen} onOpenChange={setStatisticsOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-70">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                {t('statistics')}
              </CardTitle>
              {statisticsOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Charts */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Feeder Elements vs Inspection Measures Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">{t('feederElementsVsInspectionMeasures')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-[300px]">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="category" 
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                          />
                          <YAxis 
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="feederElements" fill="var(--color-feederElements)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="inspectionMeasures" fill="var(--color-inspectionMeasures)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Actions Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">{t('actions')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={{
                        count: { label: t('count'), color: "hsl(var(--primary))" }
                      }} className="h-[250px]">
                        <BarChart data={actionsChartData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis 
                            dataKey="action" 
                            type="category" 
                            width={140}
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {actionsChartData.map((entry, index) => (
                              <Bar 
                                key={`cell-${index}`} 
                                dataKey="count"
                                fill={
                                  entry.action === "Immediate Action" ? "hsl(var(--destructive))" :
                                  entry.action === "Scheduled Action" ? "hsl(30 100% 50%)" :
                                  entry.action === "No Action" ? "hsl(160 60% 50%)" :
                                  "hsl(var(--muted))"
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel - Statistics Cards */}
                <div className="space-y-6">
                  {/* Inspection Statistics */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        {t('inspectionStatistics')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm font-medium">{t('feederName')}</span>
                        <span className="text-sm text-muted-foreground">RSL_279001_777249</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm font-medium">{t('feederLength')}</span>
                        <span className="text-sm text-muted-foreground">41.43 km</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm font-medium">{t('distanceTraveled')}</span>
                        <span className="text-sm text-muted-foreground">20.97 km</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm font-medium">{t('firstMeasure')}</span>
                        <span className="text-sm text-muted-foreground">30/09/2025 23:17:22</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm font-medium">{t('lastMeasure')}</span>
                        <span className="text-sm text-muted-foreground">01/10/2025 01:29:04</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm font-medium">{t('totalMeasures')}</span>
                        <span className="text-sm text-muted-foreground">891</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium">{t('totalTime')}</span>
                        <span className="text-sm text-muted-foreground">0d 1h 10min 5s</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Daily Statistics */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        {t('dailyStatistics')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium">30/09/2025</span>
                        <span className="text-sm text-muted-foreground">20.97 km • 1h 10min 5s</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Measures Table */}
      <Collapsible open={measuresOpen} onOpenChange={setMeasuresOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-70">
              <CardTitle className="flex items-center gap-2">
                <ThermometerSun className="w-5 h-5 text-primary" />
                {t('measuresCarThermographic')}
              </CardTitle>
              {measuresOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{t('show')}</span>
                  <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm">{t('entries')}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('id')}</TableHead>
                      <TableHead>{t('address')}</TableHead>
                      <TableHead>{t('dateLabel')}</TableHead>
                      <TableHead>{t('actionLabel')}</TableHead>
                      <TableHead>{t('hotspot')}</TableHead>
                      <TableHead>{t('reprocessedAt')}</TableHead>
                      <TableHead className="text-right">{t('actionColumn')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((measure) => (
                      <TableRow key={measure.id}>
                        <TableCell className="font-mono text-xs">{measure.id}</TableCell>
                        <TableCell>{measure.address || "-"}</TableCell>
                        <TableCell>
                          <div>{measure.date}</div>
                          <div className="text-xs text-muted-foreground">{measure.time}</div>
                        </TableCell>
                        <TableCell>
                          {measure.action ? getActionBadge(measure.action) : <Bell className="w-4 h-4 text-muted-foreground" />}
                        </TableCell>
                        <TableCell>{measure.hotspot}</TableCell>
                        <TableCell>{measure.reprocessedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => navigate(`/measure-image/${measure.id}`)}>{t('open')}</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  {t('showing')} {(currentPage - 1) * parseInt(entriesPerPage) + 1} {t('to')}{" "}
                  {Math.min(currentPage * parseInt(entriesPerPage), measureData.length)} {t('of')} {measureData.length} {t('entries')}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                    {t('previous')}
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                    {t('next')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Map Section */}
      <Collapsible open={mapOpen} onOpenChange={setMapOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-70">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t('map')}
              </CardTitle>
              {mapOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="h-[500px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">{t('mapVisualizationPlaceholder')}</p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
          </div>
        </main>

        <footer className="border-t bg-background py-4 px-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} MVI. {t('allRightsReserved')}
          </p>
        </footer>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
