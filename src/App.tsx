import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Distribution from "./pages/Distribution";
import UploadMeasures from "./pages/UploadMeasures";
import Feeders from "./pages/Feeders";
import AdminClients from "./pages/AdminClients";
import ClientInspections from "./pages/ClientInspections";
import Profile from "./pages/Profile";
import Elements from "./pages/system/Elements";
import Lamps from "./pages/system/Lamps";
import Cars from "./pages/system/Cars";
import Actions from "./pages/system/Actions";
import Methods from "./pages/system/Methods";
import Alarms from "./pages/system/Alarms";
import MeasureDetails from "./pages/MeasureDetails";
import MeasureImageDetails from "./pages/MeasureImageDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/distribution" element={<ProtectedRoute><Distribution /></ProtectedRoute>} />
            <Route path="/distribution/measures/:id" element={<ProtectedRoute><MeasureDetails /></ProtectedRoute>} />
            <Route path="/measure-image/:id" element={<ProtectedRoute><MeasureImageDetails /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><UploadMeasures /></ProtectedRoute>} />
            <Route path="/feeders" element={<ProtectedRoute><Feeders /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><AdminClients /></ProtectedRoute>} />
            <Route path="/inspections" element={<ProtectedRoute><ClientInspections /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/system/elements" element={<ProtectedRoute><Elements /></ProtectedRoute>} />
            <Route path="/system/lamps" element={<ProtectedRoute><Lamps /></ProtectedRoute>} />
            <Route path="/system/cars" element={<ProtectedRoute><Cars /></ProtectedRoute>} />
            <Route path="/system/actions" element={<ProtectedRoute><Actions /></ProtectedRoute>} />
            <Route path="/system/methods" element={<ProtectedRoute><Methods /></ProtectedRoute>} />
            <Route path="/system/alarms" element={<ProtectedRoute><Alarms /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
