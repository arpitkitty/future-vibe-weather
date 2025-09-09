import { Button } from '@/components/ui/button';
import { MapPin, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  emoji: string;
}

interface WeatherCardProps {
  weather: WeatherData;
  className?: string;
}

export default function WeatherCard({ weather, className = "" }: WeatherCardProps) {
  return (
    <div className={`glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">{weather.location}</span>
        </div>
        <span className="text-2xl">{weather.emoji}</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {weather.temperature}°
          </span>
          <span className="text-lg text-foreground/80">{weather.condition}</span>
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Droplets className="h-3 w-3" />
            {weather.humidity}%
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-3 w-3" />
            {weather.windSpeed}mph
          </div>
        </div>
      </div>
      
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}