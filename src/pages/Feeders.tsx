"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Upload } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  ZoomControl,
} from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import * as toGeoJSON from "@tmcw/togeojson";
import { toast } from "@/hooks/use-toast";
import "leaflet/dist/leaflet.css";

function MapController({
  mapRef,
}: {
  mapRef: React.MutableRefObject<LeafletMap | null>;
}) {
  const map = useMap();
  mapRef.current = map;
  return null;
}

interface Feeder {
  id: string;
  feeder: string;
  ea: string;
  region: string;
  geoJson?: any;
  bounds?: [[number, number], [number, number]];
}

const initialFeeders: Feeder[] = [
  { id: "1", feeder: "001005", ea: "-", region: "-" },
  { id: "2", feeder: "001019", ea: "-", region: "-" },
  { id: "3", feeder: "001042", ea: "-", region: "-" },
  { id: "4", feeder: "001044", ea: "-", region: "-" },
  { id: "5", feeder: "045005", ea: "-", region: "-" },
  { id: "6", feeder: "045006", ea: "-", region: "-" },
  { id: "7", feeder: "045007", ea: "-", region: "-" },
  { id: "8", feeder: "056015", ea: "-", region: "-" },
  { id: "9", feeder: "069010", ea: "-", region: "-" },
  { id: "10", feeder: "069012", ea: "-", region: "-" },
];

const layerOptions = [
  { id: "condutores", label: "Condutores" },
  { id: "trafo", label: "Trafo" },
  { id: "regulator", label: "Regulator" },
  { id: "threePoleSwitch", label: "ThreePoleSwitch" },
  { id: "recloser", label: "Recloser" },
  { id: "oilSwitch", label: "OilSwitch" },
  { id: "singlePhaseOilSwitch", label: "SinglePhaseOilSwitch" },
  { id: "fuseSwitch", label: "FuseSwitch" },
  { id: "knifeSwitch", label: "KnifeSwitch" },
  { id: "capacitorBank", label: "CapacitorBank" },
  { id: "poles", label: "Poles" },
];

export default function Feeders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mapType, setMapType] = useState("streets");
  const [selectedLayers, setSelectedLayers] = useState<string[]>(
    layerOptions.map((opt) => opt.id)
  );
  const [feeders, setFeeders] = useState<Feeder[]>(initialFeeders);
  const [selectedFeeder, setSelectedFeeder] = useState<string | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFeeders = feeders.filter((feeder) =>
    Object.values(feeder).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredFeeders.length / itemsPerPage);
  const paginatedFeeders = filteredFeeders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleLayer = (id: string) => {
    setSelectedLayers((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const getAllCoordinates = (geometry: any): number[][] => {
    const coords: number[][] = [];

    const extract = (geom: any) => {
      if (geom.type === "Point") return;
      if (geom.type === "LineString") coords.push(...geom.coordinates);
      else if (geom.type === "Polygon")
        geom.coordinates.forEach((ring: number[][]) => coords.push(...ring));
      else if (
        geom.type === "MultiLineString" ||
        geom.type === "MultiPolygon"
      ) {
        geom.coordinates.forEach((part: any) => {
          part.forEach((sub: any) => coords.push(...sub));
        });
      } else if (geom.type === "GeometryCollection")
        geom.geometries.forEach((g: any) => extract(g));
    };

    extract(geometry);
    return coords;
  };

  const handleKmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const doc = new DOMParser().parseFromString(text, "text/xml");
        const geoJson = toGeoJSON.kml(doc);

        if (geoJson?.features?.length > 0) {
          const fileName = file.name.replace(".kml", "");

          // ✅ Filter to keep only line-based features
          const lineFeatures = geoJson.features.filter(
            (f: any) =>
              f.geometry?.type === "LineString" ||
              f.geometry?.type === "MultiLineString" ||
              f.geometry?.type === "Polygon" ||
              f.geometry?.type === "MultiPolygon"
          );

          const filteredGeoJson = {
            ...geoJson,
            features: lineFeatures,
          };

          let bounds;
          const all: number[][] = [];

          lineFeatures.forEach((f: any) => {
            if (f.geometry) all.push(...getAllCoordinates(f.geometry));
          });

          if (all.length > 0) {
            const lats = all.map((c) => c[1]);
            const lngs = all.map((c) => c[0]);
            bounds = [
              [Math.min(...lats), Math.min(...lngs)],
              [Math.max(...lats), Math.max(...lngs)],
            ] as [[number, number], [number, number]];
          }

          const newFeeder: Feeder = {
            id: `kml-${Date.now()}`,
            feeder: fileName,
            ea: "-",
            region: "-",
            geoJson: filteredGeoJson,
            bounds,
          };

          setFeeders((p) => [newFeeder, ...p]);
          toast({
            title: "Success",
            description: "KML file uploaded successfully!",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to parse KML",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleFeederClick = (feeder: Feeder) => {
    setSelectedFeeder(feeder.id);
    if (feeder.bounds && mapRef.current) {
      mapRef.current.fitBounds(feeder.bounds, {
        paddingTopLeft: [80, 80],
        paddingBottomRight: [80, 80],
        animate: true,
      });
    }
  };

  const selectedFeederData = feeders.find((f) => f.id === selectedFeeder);

  return (
    <div className="space-y-6 h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feeders</h1>

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".kml"
            onChange={handleKmlUpload}
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Upload KML
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* LEFT */}
        <div className="col-span-3 space-y-4 flex flex-col overflow-hidden">
          <div>
            <Label className="text-sm mb-2 block">Search:</Label>
            <Input
              placeholder="Search feeders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead />
                  <TableHead>FEEDER</TableHead>
                  <TableHead>EA</TableHead>
                  <TableHead>REGION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFeeders.map((feeder) => (
                  <TableRow
                    key={feeder.id}
                    onClick={() => handleFeederClick(feeder)}
                    className={`cursor-pointer hover:bg-muted/50 ${
                      selectedFeeder === feeder.id ? "bg-accent/20" : ""
                    }`}
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{feeder.feeder}</TableCell>
                    <TableCell>{feeder.ea}</TableCell>
                    <TableCell>{feeder.region}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>

        {/* MAP */}
        <div className="col-span-9 relative h-full">
          <Card className="h-full overflow-hidden">
            <MapContainer
              {...({
                center: [-23.5505, -46.6333],
                zoom: 14,
                scrollWheelZoom: true,
                zoomControl: false,
                style: { height: "100%", width: "100%" },
              } as any)}
            >
              <MapController mapRef={mapRef} />

              <ZoomControl position="topleft" />

              <TileLayer
                url={
                  mapType === "satellite"
                    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                }
                {...({ attribution: "© CARTO | © OpenStreetMap" } as any)}
              />

              {/* ✅ RENDER ONLY LINES */}
              {selectedFeederData?.geoJson && selectedLayers.includes("condutores") && (
                <GeoJSON
                  key={selectedFeeder}
                  data={selectedFeederData.geoJson}
                  {...({
                    pathOptions: {
                      color: "#ffc107",
                      weight: 3,
                      opacity: 0.9,
                    },
                    pointToLayer: () => null,
                  } as any)}
                />
              )}
            </MapContainer>
          </Card>

          {/* RIGHT PANEL */}
          <div className="absolute top-4 right-4 bg-card/95 rounded-md shadow-md p-3 space-y-3 text-sm w-48 z-[1000] border">
            <div>
              <Label className="text-xs font-semibold">Map Type</Label>
              <RadioGroup value={mapType} onValueChange={setMapType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="satellite" id="satellite" />
                  <Label htmlFor="satellite" className="cursor-pointer">
                    Satellite
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="streets" id="streets" />
                  <Label htmlFor="streets" className="cursor-pointer">
                    Streets
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-xs font-semibold">Layers</Label>
              <div className="max-h-52 overflow-y-auto space-y-1 mt-1">
                {layerOptions.map((l) => (
                  <div key={l.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={l.id}
                      checked={selectedLayers.includes(l.id)}
                      onCheckedChange={() => toggleLayer(l.id)}
                    />
                    <Label htmlFor={l.id} className="cursor-pointer text-sm">
                      {l.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
