import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Filter, ArrowUpDown, Grid, RotateCcw, FileDown, FileType, Eye, ThermometerSun, Triangle, ZoomIn, ZoomOut, Move, Maximize2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { ProfileModal } from "@/components/ProfileModal";
import { Slider } from "@/components/ui/slider";

// Mock data
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
  inspectionFeeder: "RSI_088009_2014237",
  load: 100,
  observations: ""
};

const measureList = [
  { id: "001", date: "30/09/2025", time: "21:15:52", maxTemp: "29.66°C", status: "normal" },
  { id: "002", date: "30/09/2025", time: "20:46:01", maxTemp: "31.90°C", status: "warning" },
  { id: "003", date: "30/09/2025", time: "20:35:44", maxTemp: "30.83°C", status: "normal", active: true },
  { id: "004", date: "30/09/2025", time: "20:27:14", maxTemp: "38.53°C", status: "warning" },
  { id: "005", date: "29/09/2025", time: "22:11:39", maxTemp: "41.51°C", status: "critical" },
  { id: "006", date: "30/09/2025", time: "18:27:10", maxTemp: "32.92°C", status: "warning" },
];

const actionsData = [
  { id: 1, element: "Árvore", opNumbers: "-", idNum: "1", temperature: "-", tAbs: "-", tDelta: "-", finalAction: "Action not Defined" },
  { id: 2, element: "Baixa", opNumbers: "-", idNum: "2", temperature: "-", tAbs: "-", tDelta: "-", finalAction: "Action not Defined" },
  { id: 3, element: "7294115", opNumbers: "-", idNum: "3", temperature: "-", tAbs: "-", tDelta: "-", finalAction: "Action not Defined" },
];

export default function MeasureImageDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imagesOpen, setImagesOpen] = useState(true);
  const [informationOpen, setInformationOpen] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Main Navigation Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Measures List Sidebar */}
      <div className="hidden lg:flex lg:flex-col w-72 border-r bg-card lg:ml-60 fixed left-0 top-0 bottom-0 pt-16">
        {/* Toolbar */}
        <div className="p-3 border-b space-y-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
              Sort
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className="px-2.5"
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            >
              <Grid className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Measures List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === "list" ? (
            /* List View */
            <div className="divide-y">
              {measureList.map((measure) => (
                <div
                  key={measure.id}
                  className={`p-3 cursor-pointer transition-colors ${measure.active
                    ? "bg-primary/10 border-l-4 border-primary"
                    : "hover:bg-muted/50"
                    }`}
                  onClick={() => navigate(`/measure-image/${measure.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-primary">{measure.id}</div>
                      {measure.status === "critical" && (
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{measure.time}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">{measure.date}</div>
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Max: {measure.maxTemp}</span>
                    {measure.status !== "normal" && (
                      <Triangle className={`w-3 h-3 ${measure.status === "critical" ? "text-red-500 fill-red-500" : "text-orange-500 fill-orange-500"
                        }`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid View */
            <div className="p-3 grid grid-cols-2 gap-3">
              {measureList.map((measure) => (
                <div
                  key={measure.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${measure.active
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:border-primary/50"
                    }`}
                  onClick={() => navigate(`/measure-image/${measure.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-primary">{measure.id}</div>
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-0.5">{measure.date}</div>
                  <div className="text-xs text-muted-foreground mb-2">{measure.time}</div>
                  <div className="bg-muted/50 rounded px-2 py-1 mb-2">
                    <div className="text-xs font-semibold">Max: {measure.maxTemp}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">🌲</span>
                    {measure.status !== "normal" && (
                      <Triangle className={`w-3 h-3 ${measure.status === "critical" ? "text-red-500 fill-red-500" : "text-orange-500 fill-orange-500"
                        }`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mini Map - Fixed at Bottom */}
        <div className="p-3 border-t flex-shrink-0">
          <div className="aspect-square bg-muted/30 rounded border relative">
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              Map View
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[504px] flex flex-col">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="p-4 space-y-3">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-lg border">
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Return to Inspection Measures
                </Button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <FileDown className="w-3.5 h-3.5 mr-1.5" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <FileType className="w-3.5 h-3.5 mr-1.5" />
                  TIFF
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Optical
                </Button>
              </div>
            </div>

            {/* Images Section */}
            <Collapsible open={imagesOpen} onOpenChange={setImagesOpen}>
              <Card>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 border-b">
                  <h3 className="text-base font-semibold text-primary">Images</h3>
                  <ChevronDown className={`w-5 h-5 transition-transform ${!imagesOpen && "rotate-180"}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-0">
                    {/* Temperature Scale Bar */}
                    <div className="px-4 pt-4 pb-3 bg-background border-b">
                      <div className="flex items-center gap-2 w-full">
                        <div className="text-[10px] font-semibold bg-black text-white px-2 py-1 rounded shrink-0">-1.93°C</div>
                        <div className="flex-1 min-w-0">
                          <div className="relative">
                            {/* Gradient bar */}
                            <div className="h-5 rounded overflow-hidden bg-gradient-to-r from-blue-900 via-purple-700 via-pink-600 via-red-600 via-orange-500 via-yellow-400 to-yellow-200"></div>
                            {/* Temperature markers in one line below gradient */}
                            <div className="flex flex-nowrap justify-between text-[8px] text-muted-foreground font-mono mt-0.5 whitespace-nowrap overflow-hidden">
                              <span className="inline-block">-1.93</span>
                              <span className="inline-block">1.1</span>
                              <span className="inline-block">4.1</span>
                              <span className="inline-block">7.2</span>
                              <span className="inline-block">10.2</span>
                              <span className="inline-block">13.2</span>
                              <span className="inline-block">16.3</span>
                              <span className="inline-block">19.3</span>
                              <span className="inline-block">22.4</span>
                              <span className="inline-block">25.4</span>
                              <span className="inline-block">28.5</span>
                              <span className="inline-block">29.66</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] font-semibold bg-black text-white px-2 py-1 rounded shrink-0">29.66°C</div>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="px-4 py-3 border-b bg-background flex items-center justify-center gap-2">
                      {/* Color Palette Dropdown */}
                      <div className="relative group">
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></span>
                        </Button>
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          <div className="p-1">
                            <div className="px-3 py-2 hover:bg-primary hover:text-primary-foreground rounded cursor-pointer flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-yellow-400"></span>
                              <span className="text-sm font-medium">Iron</span>
                            </div>
                            <div className="px-3 py-2 hover:bg-primary/10 rounded cursor-pointer flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-400"></span>
                              <span className="text-sm">Blue Lila</span>
                            </div>
                            <div className="px-3 py-2 hover:bg-primary/10 rounded cursor-pointer flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 via-green-500 via-yellow-500 to-red-500"></span>
                              <span className="text-sm">Rainbow</span>
                            </div>
                            <div className="px-3 py-2 hover:bg-primary/10 rounded cursor-pointer flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-gray-900 to-white"></span>
                              <span className="text-sm">White Hot</span>
                            </div>
                            <div className="px-3 py-2 hover:bg-primary/10 rounded cursor-pointer flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-white to-gray-900"></span>
                              <span className="text-sm">Black Hot</span>
                            </div>
                            <div className="px-3 py-2 hover:bg-primary/10 rounded cursor-pointer flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-200"></span>
                              <span className="text-sm">Arctic</span>
                            </div>
                            <div className="px-3 py-2 hover:bg-primary/10 rounded cursor-pointer flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-300"></span>
                              <span className="text-sm">Outdoor</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-medium">
                        <ThermometerSun className="w-4 h-4 mr-1.5" />
                        0°
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Move className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                        🔊
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Triangle className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                        📷
                      </Button>
                    </div>

                    {/* Images Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 bg-muted/10">
                      {/* Thermal Image */}
                      <div className="relative p-4 border-r">
                        {/* Left Control Buttons - Top Left Corner */}
                        <div className="absolute left-6 top-20 flex flex-col gap-1 z-20">
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Right Control Buttons - Top Right Corner */}
                        <div className="absolute right-6 top-20 flex flex-col gap-1 z-20">
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            <Move className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            ✋
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            🖱
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            <ThermometerSun className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Thermal Image */}
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-yellow-200 via-orange-500 to-purple-900 rounded overflow-hidden">
                          {/* Crosshair */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-10 h-10 border-2 border-white rounded-full"></div>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white -translate-y-1/2"></div>
                            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white -translate-x-1/2"></div>
                          </div>
                        </div>
                      </div>

                      {/* Optical Image */}
                      <div className="relative p-4">
                        {/* Left Control Buttons - Top Left Corner */}
                        <div className="absolute left-6 top-20 flex flex-col gap-1 z-20">
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Right Control Buttons - Top Right Corner */}
                        <div className="absolute right-6 top-20 flex flex-col gap-1 z-20">
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            <Move className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            ✋
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white shadow-sm rounded">
                            🖱
                          </Button>
                        </div>

                        {/* Optical Image */}
                        <div className="relative aspect-[4/3] bg-gray-800 rounded overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-700">
                            <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gray-400/50"></div>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-400/50"></div>
                            <div className="absolute top-1/3 right-1/3 w-20 h-40 bg-gradient-to-b from-white to-yellow-200 rounded-full blur-lg opacity-90"></div>
                            <div className="absolute bottom-1/3 left-0 right-0 h-40 bg-gradient-to-t from-green-900/30 to-transparent"></div>
                          </div>
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
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 border-b">
                  <h3 className="text-base font-semibold text-primary">Information</h3>
                  <ChevronDown className={`w-5 h-5 transition-transform ${!informationOpen && "rotate-180"}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-6">
                    {/* 4-Column Grid */}
                    <div className="grid grid-cols-4 gap-x-8 gap-y-5">
                      {/* Row 1 */}
                      <div>
                        <div className="text-sm font-bold mb-1.5">Address</div>
                        <div className="text-sm">{measureDetails.address}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1.5">Camera</div>
                        <div className="text-sm">{measureDetails.camera}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1.5">Inference</div>
                        <div className="text-sm">{measureDetails.inference}</div>
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-bold mb-1.5">Coordinates</div>
                          <div className="text-sm">{measureDetails.coordinates}</div>
                        </div>
                        <Button variant="default" size="sm" className="h-9 w-9 p-0 ml-2">
                          💾
                        </Button>
                      </div>

                      {/* Row 2 */}
                      <div>
                        <div className="text-sm font-bold mb-1.5">Date</div>
                        <div className="text-sm">{measureDetails.date} {measureDetails.time}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1.5">Relative Humidity</div>
                        <div className="text-sm">{measureDetails.relativeHumidity}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1.5">Wind</div>
                        <div className="text-sm">{measureDetails.wind}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1.5">Temperature</div>
                        <div className="text-sm">{measureDetails.temperature}</div>
                      </div>

                      {/* Row 3 */}
                      <div>
                        <div className="text-sm font-bold mb-1.5">Detected Feeders</div>
                        <div className="text-sm">-</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1.5">Inspection Name</div>
                        <div className="text-sm">{measureDetails.inspectionName}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1.5">Inspection Feeder</div>
                        <div className="text-sm text-primary font-medium">{measureDetails.inspectionFeeder}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1.5">Speed</div>
                        <div className="text-sm">{measureDetails.speed}</div>
                      </div>

                      {/* Row 4 - Observations spanning first 3 columns, Load in last column */}
                      <div className="col-span-3">
                        <div className="text-sm font-bold mb-1.5">Observations</div>
                        <textarea
                          className="w-full h-24 px-3 py-2 text-sm border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="update this"
                        ></textarea>
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1.5">Load</div>
                        <div className="flex items-center gap-3">
                          <Slider value={[measureDetails.load]} max={100} className="flex-1" />
                          <span className="text-sm font-semibold min-w-[45px]">{measureDetails.load}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-5">
                      <Button variant="default" size="sm" className="h-9 px-4">
                        💾 Save
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Actions Section */}
            <Collapsible open={actionsOpen} onOpenChange={setActionsOpen}>
              <Card>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 border-b">
                  <h3 className="text-base font-semibold text-primary">Actions</h3>
                  <ChevronDown className={`w-5 h-5 transition-transform ${!actionsOpen && "rotate-180"}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 text-xs font-semibold">ELEMENT</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold">OP. NUMBERS</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold">ID</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold">TEMPERATURE</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold">T. ABS (°C)</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold">T. DELTA (°C)</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold">FINAL ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {actionsData.map((action) => (
                            <tr key={action.id} className="border-b hover:bg-muted/30">
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-xs">{action.element}</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{action.opNumbers}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{action.idNum}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{action.temperature}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  {action.tAbs}
                                  {action.id === 1 && <Triangle className="w-3 h-3 text-muted-foreground fill-muted-foreground" />}
                                </div>
                              </td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{action.tDelta}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{action.finalAction}</td>
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
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
