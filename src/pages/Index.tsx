import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavigationTabs from "@/components/NavigationTabs";
import WeatherDashboard from "@/components/WeatherDashboard";
import MoodWeatherPage from "@/components/MoodWeatherPage";
import FashionForecaster from "@/components/FashionForecaster";

const queryClient = new QueryClient();

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <WeatherDashboard />;
      case "mood":
        return <MoodWeatherPage />;
      case "outfits":
        return <FashionForecaster />;
      case "time-travel":
        return (
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Time Travel Weather ⏰
            </h2>
            <p className="text-muted-foreground">Coming soon! Travel through weather history and see 2050 predictions.</p>
          </div>
        );
      case "space":
        return (
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Space Weather 🛰️
            </h2>
            <p className="text-muted-foreground">Solar storms, geomagnetic activity, and satellite disruptions - coming soon!</p>
          </div>
        );
      case "community":
        return (
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Community Feed 👥
            </h2>
            <p className="text-muted-foreground">Share weather photos and connect with other weather enthusiasts - coming soon!</p>
          </div>
        );
      case "eco":
        return (
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Eco Actions Hub 🌱
            </h2>
            <p className="text-muted-foreground">Gamified eco-challenges and energy saving streaks - coming soon!</p>
          </div>
        );
      default:
        return <WeatherDashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* App Header */}
            <header className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-aurora bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                2050 Weather
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The future of weather meets lifestyle. Experience weather like never before! ⚡
              </p>
            </header>

            {/* Navigation */}
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Active Tab Content */}
            <main className="animate-fade-in">
              {renderActiveTab()}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Index;
