import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import WeatherCard from './WeatherCard';
import { MapPin, Thermometer, Eye, Wind, Droplets, Sun } from 'lucide-react';
import weatherBg from '@/assets/weather-bg.jpg';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  emoji: string;
  description: string;
}

const mockWeatherData: WeatherData = {
  location: "San Francisco, CA",
  temperature: 22,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  emoji: "⛅",
  description: "Perfect weather for a walk in the park"
};

const nearbyWeather: WeatherData[] = [
  {
    location: "Oakland, CA",
    temperature: 24,
    condition: "Sunny",
    humidity: 58,
    windSpeed: 8,
    emoji: "☀️",
    description: "Beautiful clear skies"
  },
  {
    location: "Berkeley, CA", 
    temperature: 21,
    condition: "Foggy",
    humidity: 78,
    windSpeed: 6,
    emoji: "🌫️",
    description: "Typical bay area fog"
  },
  {
    location: "Palo Alto, CA",
    temperature: 26,
    condition: "Clear",
    humidity: 52,
    windSpeed: 10,
    emoji: "🌤️", 
    description: "Warm and pleasant"
  }
];

export default function WeatherDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Weather Section */}
      <div 
        className="relative h-96 rounded-2xl overflow-hidden glass"
        style={{
          backgroundImage: `url(${weatherBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="relative h-full flex flex-col justify-between p-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-foreground/70">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-foreground/70">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <Button variant="glass" size="icon" className="animate-float">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-6xl">{mockWeatherData.emoji}</span>
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {mockWeatherData.temperature}°
                </h1>
                <p className="text-xl text-foreground/90">{mockWeatherData.condition}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground/80">{mockWeatherData.location}</span>
            </div>
            
            <p className="text-foreground/70 max-w-md">
              {mockWeatherData.description}
            </p>
            
            {/* Weather Stats */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-400" />
                <span>{mockWeatherData.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-green-400" />
                <span>{mockWeatherData.windSpeed} mph</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-400" />
                <span>10 mi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="neon" className="h-20 flex-col gap-2">
          <Sun className="h-6 w-6" />
          <span className="text-xs">UV Index</span>
        </Button>
        <Button variant="glass" className="h-20 flex-col gap-2">
          <Wind className="h-6 w-6" />
          <span className="text-xs">Air Quality</span>
        </Button>
        <Button variant="glass" className="h-20 flex-col gap-2">
          <Droplets className="h-6 w-6" />
          <span className="text-xs">Humidity</span>
        </Button>
        <Button variant="glass" className="h-20 flex-col gap-2">
          <Thermometer className="h-6 w-6" />
          <span className="text-xs">Feels Like</span>
        </Button>
      </div>

      {/* Nearby Weather */}
      <div>
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Nearby Locations 🌍
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbyWeather.map((weather, index) => (
            <WeatherCard key={index} weather={weather} />
          ))}
        </div>
      </div>
    </div>
  );
}