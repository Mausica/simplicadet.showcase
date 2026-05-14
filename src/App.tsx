import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Activities from "./pages/Activities";
import Documents from "./pages/Documents";
import Services from "./pages/Services";
import Collections from "./pages/Collections";
import Debug from "./pages/Debug";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import InstitutionLoader from "@/components/InstitutionLoader";
import InstitutionPage from "@/pages/InstitutionPage";
import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Resources from "@/pages/Resources";
import { GuestModeBanner } from "@/components/GuestModeBanner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
    },
  },
});

function InstitutionRedirect({ to }: { to: string }) {
  const college = (() => { try { return localStorage.getItem('current_college') || 'cnmtv'; } catch { return 'cnmtv'; } })();
  return <Navigate to={`/${college}${to ? '/' + to : ''}`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="topo-background" />
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/+$/, '')}>
        <GuestModeBanner />
        <Routes>
          {/* Landing Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/resources" element={<Resources />} />

          {/* Institution Redirects */}
          <Route path="/attendance" element={<InstitutionRedirect to="attendance" />} />
          <Route path="/documents" element={<InstitutionRedirect to="documents" />} />
          <Route path="/collections" element={<InstitutionRedirect to="collections" />} />
          <Route path="/services" element={<InstitutionRedirect to="services" />} />
          
          {}
          <Route path="/activities" element={<InstitutionRedirect to="activities" />} />
          <Route path="/debug" element={<InstitutionRedirect to="debug" />} />
          <Route path="/admin" element={<InstitutionRedirect to="admin" />} />

          {}
          <Route path=":slug" element={<InstitutionLoader />}>
            <Route index element={<InstitutionPage />} />
            <Route path="attendance" element={<ProtectedRoute guestAllowed><Index /></ProtectedRoute>} />
            <Route path="documents" element={<ProtectedRoute guestAllowed><Documents /></ProtectedRoute>} />
            <Route path="collections" element={<ProtectedRoute guestAllowed><Collections /></ProtectedRoute>} />
            <Route path="services" element={<ProtectedRoute guestAllowed><Services /></ProtectedRoute>} />
            <Route path="activities" element={<ProtectedRoute cmdOrAbove guestAllowed><Activities /></ProtectedRoute>} />
            <Route path="debug" element={<ProtectedRoute guestAllowed={false}><Debug /></ProtectedRoute>} />
            <Route path="admin" element={<ProtectedRoute adminOnly guestAllowed={false}><Admin /></ProtectedRoute>} />
          </Route>

          {}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
