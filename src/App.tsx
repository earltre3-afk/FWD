import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { FWDProvider } from "@/contexts/FWDContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Detail from "./pages/Detail";
import Create from "./pages/Create";
import CameraPage from "./pages/CameraPage";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Collections from "./pages/Collections";
import EmbedPicker from "./pages/EmbedPicker";
import Demo from "./pages/Demo";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CreateProfile from "./pages/CreateProfile";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <FWDProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/create" element={<Create />} />
                <Route path="/camera" element={<CameraPage />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/embed/picker" element={<EmbedPicker />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/create-profile" element={<CreateProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </FWDProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
