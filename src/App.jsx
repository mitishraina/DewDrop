import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserDashboard from "./pages/UserDashboard";
import AdminPanel from "./pages/AdminPanel";
import DevicePage from "./pages/DevicePage";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import LoadingDroplet from "./components/LoadingDroplet";
import "./App.css";
import LiquidChrome from "./styles/LiquidChrome";
import ScrollToTop from "./styles/ScrollToTop";

const queryClient = new QueryClient();

const NavigationLoader = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return isLoading ? <LoadingDroplet /> : null;
};

const AppRoutes = () => (
    <>
        <NavigationLoader />
        <div style={{ width: '100%', position: 'absolute' }}>
            <LiquidChrome
                baseColor={[0, 0.3, 0.4]}
                speed={0.15}
                amplitude={0.3}
                interactive={true}
                className="h-[1400px]"
            >
            </LiquidChrome>
        </div>
        <div className="relative z-10">
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/device/:deviceId" element={<DevicePage />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

        </div>
    </>
);

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App; 