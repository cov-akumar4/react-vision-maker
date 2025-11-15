import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Filter, ArrowUpDown, Grid, RotateCcw, FileDown, FileType, Eye, ThermometerSun, Triangle, Camera, BarChart3 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileModal } from "@/components/ProfileModal";
import { Slider } from "@/components/ui/slider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Mock data based on the screenshot
const measureDetails = {
  id: "003",
  measureId: "003",
  date: "30/09/2025",
  time: "20:35:44",
  address: "Rua Santo Antônio Jardim Carolina 78890-000 Sorriso",
  maxTemp: "30.83°C",
  action: "Scheduled Action",
  camera: "Front Left A615",
  inference: "Manual Capture",
  coordinates: "-12.54536, -55.75413",
  relativeHumidity: "27.8%",
  wind: "0.9m/s",
  temperature: "31.3°C",
  speed: "0.0Km/h",
  detectedFeeders: "",
  inspectionName: "2025 EMT - RSI",
  inspectionFeeder: "RSL088009_2014237",
  load: 100,
  observations: ""
};

const actionsData = [
  { id: 1, element: "Árvore", opNumbers: "-", temperature: "-", tAbs: "-", tDelta: "-", finalAction: "Action not Defined" },
  { id: 2, element: "Baixa", opNumbers: "-", temperature: "-", tAbs: "-", tDelta: "-", finalAction: "Action not Defined" },
  { id: 3, element: "7294115", opNumbers: "-", temperature: "-", tAbs: "-", tDelta: "-", finalAction: "Action not Defined" },
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

export default function MeasureImageDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imagesOpen, setImagesOpen] = useState(true);
  const [informationOpen, setInformationOpen] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(true);

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
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-4">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('filter')}
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  {t('sort')}
                </Button>
                <Button variant="outline" size="sm">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('returnToInspectionMeasures')}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileDown className="w-4 h-4 mr-2" />
                  {t('pdf')}
                </Button>
                <Button variant="outline" size="sm">
                  <FileType className="w-4 h-4 mr-2" />
                  {t('tiff')}
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  {t('optical')}
                </Button>
              </div>
            </div>

            {/* Measure Info Header */}
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded font-semibold">
                    {measureDetails.measureId}
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{measureDetails.date}</span>
                      <span className="text-muted-foreground">{measureDetails.time}</span>
                    </div>
                    <div className="font-medium">{measureDetails.address}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="w-4 h-4 text-destructive" />
                    <span className="font-semibold">{t('max')}: {measureDetails.maxTemp}</span>
                    <Triangle className="w-4 h-4 text-orange-500 fill-orange-500" />
                  </div>
                  {getActionBadge(measureDetails.action)}
                </div>
                <Button variant="ghost" size="sm">
                  <Camera className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </div>

            {/* Images Section */}
            <Collapsible open={imagesOpen} onOpenChange={setImagesOpen}>
              <Card>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
                  <h3 className="text-lg font-semibold">{t('images')}</h3>
                  {imagesOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 rotate-180" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Thermal Image */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-center">{t('thermalImage')}</div>
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-yellow-300 via-orange-500 to-purple-900 rounded-lg overflow-hidden border">
                          {/* Temperature scale */}
                          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            15.0°C
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            30.83°C
                          </div>
                          {/* Temperature gradient bar */}
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-48 rounded">
                            <div className="w-full h-full bg-gradient-to-b from-white via-yellow-400 via-orange-500 to-purple-900 rounded border-2 border-white"></div>
                          </div>
                          {/* Crosshair */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 border-2 border-white rounded-full"></div>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white"></div>
                            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white"></div>
                          </div>
                        </div>
                        {/* Thermal image controls */}
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Button variant="outline" size="sm" className="h-8">
                            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-red-600 mr-2"></span>
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            <ThermometerSun className="w-4 h-4 mr-1" />
                            0°
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            ⟲
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            ⊞
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            ⊡
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            👁
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            🔊
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            ⚠
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            📷
                          </Button>
                        </div>
                      </div>

                      {/* Optical Image */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-center">{t('opticalImage')}</div>
                        <div className="relative aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden border">
                          {/* Simulated night photo with power lines */}
                          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-700">
                            <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gray-400"></div>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-400"></div>
                            <div className="absolute top-1/3 right-1/3 w-16 h-32 bg-gradient-to-b from-white to-yellow-200 rounded-full blur-md opacity-90"></div>
                            <div className="absolute bottom-1/3 left-0 right-0 h-32 bg-gradient-to-t from-green-900/30 to-transparent"></div>
                          </div>
                        </div>
                        {/* Optical image controls */}
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="sm" className="h-8">
                            +
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            −
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            ⟲
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            ⤢
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Information Section */}
            <Collapsible open={informationOpen} onOpenChange={setInformationOpen}>
              <Card>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
                  <h3 className="text-lg font-semibold">{t('information')}</h3>
                  {informationOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 rotate-180" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-4 gap-6">
                      {/* Column 1 */}
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('address')}</div>
                          <div className="text-sm text-muted-foreground">{measureDetails.address}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('dateLabel')}</div>
                          <div className="text-sm text-muted-foreground">{measureDetails.date} {measureDetails.time}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('detectedFeeders')}</div>
                          <div className="text-sm text-muted-foreground">-</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('observations')}</div>
                          <div className="text-sm text-muted-foreground h-20 border rounded p-2 bg-muted/20"></div>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('camera')}</div>
                          <div className="text-sm text-muted-foreground">{measureDetails.camera}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('relativeHumidity')}</div>
                          <div className="text-sm text-muted-foreground">{measureDetails.relativeHumidity}</div>
                        </div>
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('inference')}</div>
                          <div className="text-sm text-muted-foreground">{measureDetails.inference}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('wind')}</div>
                          <div className="text-sm text-muted-foreground">{measureDetails.wind}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('inspectionName')}</div>
                          <div className="text-sm text-muted-foreground">{measureDetails.inspectionName}</div>
                        </div>
                      </div>

                      {/* Column 4 */}
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('coordinates')}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            {measureDetails.coordinates}
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-primary">
                              📍
                            </Button>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('temperature')}</div>
                          <div className="text-sm text-muted-foreground">{measureDetails.temperature}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('speed')}</div>
                          <div className="text-sm text-muted-foreground">{measureDetails.speed}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('inspectionFeeder')}</div>
                          <div className="text-sm text-primary">{measureDetails.inspectionFeeder}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-1">{t('load')}</div>
                          <div className="flex items-center gap-2">
                            <Slider value={[measureDetails.load]} max={100} className="flex-1" />
                            <span className="text-sm font-medium">{measureDetails.load}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Actions Section */}
            <Collapsible open={actionsOpen} onOpenChange={setActionsOpen}>
              <Card>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
                  <h3 className="text-lg font-semibold">{t('actionDetails')}</h3>
                  {actionsOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 rotate-180" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('element')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('opNumbers')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('id')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('temperature')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('tAbs')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('tDelta')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('finalAction')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {actionsData.map((action) => (
                            <tr key={action.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-sm">{action.element}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{action.opNumbers}</td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{action.id}</td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{action.temperature}</td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  {action.tAbs}
                                  {action.id === 1 && <Triangle className="w-3 h-3 text-muted-foreground fill-muted-foreground" />}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{action.tDelta}</td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{action.finalAction}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </main>

        <footer className="border-t bg-background py-4 px-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} MVI. All rights reserved.
          </p>
        </footer>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
