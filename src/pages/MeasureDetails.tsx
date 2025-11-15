import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown, Home, BarChart3, Calendar, MapPin, ThermometerSun, Bell } from "lucide-react";

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

export default function MeasureDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
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
      return <Badge className="bg-destructive hover:bg-destructive/90 text-white">{action}</Badge>;
    } else if (action === "Scheduled Action") {
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">{action}</Badge>;
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <Home className="w-4 h-4" />
        </Button>
        <ChevronRight className="w-4 h-4" />
        <button onClick={() => navigate("/inspections")} className="hover:text-foreground">
          Inspections
        </button>
        <ChevronRight className="w-4 h-4" />
        <button onClick={() => navigate("/distribution")} className="hover:text-foreground">
          Distribution
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Measures</span>
      </div>

      {/* Statistics Section */}
      <Collapsible open={statisticsOpen} onOpenChange={setStatisticsOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-70">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Statistics
              </CardTitle>
              {statisticsOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[300px] bg-muted rounded flex items-center justify-center">
                  Chart Placeholder
                </div>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Inspection Statistics
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Feeder Name</span>
                        <span className="font-medium">RSL088009_2014237</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Feeder Length</span>
                        <span className="font-medium">71.59 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total measures</span>
                        <span className="font-medium">587</span>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Daily Statistics
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="pb-2 border-b">
                        <div className="font-medium">29/09/2025</div>
                        <div className="text-muted-foreground">9.66 km • 0h 33min 7s</div>
                      </div>
                      <div>
                        <div className="font-medium">30/09/2025</div>
                        <div className="text-muted-foreground">16.53 km • 0h 57min 32s</div>
                      </div>
                    </div>
                  </div>
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
                Measures - Car - Thermographic
              </CardTitle>
              {measuresOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Show</span>
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
                  <span className="text-sm">entries</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>ADDRESS</TableHead>
                      <TableHead>DATE</TableHead>
                      <TableHead>ACTION</TableHead>
                      <TableHead>HOTSPOT</TableHead>
                      <TableHead>REPROCESSED AT</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
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
                          <Button size="sm">Open</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * parseInt(entriesPerPage) + 1} to{" "}
                  {Math.min(currentPage * parseInt(entriesPerPage), measureData.length)} of {measureData.length} entries
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                    Previous
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
                    Next
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
                Map
              </CardTitle>
              {mapOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="h-[500px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Map visualization placeholder</p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
