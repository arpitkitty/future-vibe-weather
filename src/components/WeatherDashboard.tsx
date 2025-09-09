import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Thermometer, Droplets, Wind, Eye, Gauge, Sun, Moon, Settings as SettingsIcon, AlertTriangle } from 'lucide-react';
import WeatherCard from './WeatherCard';
import LocationSearch from './LocationSearch';
import SettingsModal from './Settings';
import EnergyMeter from './EnergyMeter';
import DailyChecklist from './DailyChecklist';
import { weatherService, type WeatherData } from '@/services/weatherApi';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from '@/components/ui/use-toast';

export default function WeatherDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [airQuality, setAirQuality] = useState<any>(null);
  const [uvIndex, setUvIndex] = useState<number>(0);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lon: number, name?: string} | null>(null);
  
  const { latitude, longitude, getCurrentPosition } = useGeolocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    weatherService.loadApiKeys();
    
    // Try to get user's location on first load
    getCurrentPosition();

    return () => clearInterval(timer);
  }, [getCurrentPosition]);

  useEffect(() => {
    if (latitude && longitude) {
      handleLocationSelect(latitude, longitude, 'Your Location');
    }
  }, [latitude, longitude]);

  const handleLocationSelect = async (lat: number, lon: number, name?: string) => {
    setCurrentLocation({ lat, lon, name });
    await fetchWeatherData(lat, lon);
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const [weatherData, forecastData, aqData, uvData] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getForecast(lat, lon, 5),
        weatherService.getAirQuality(lat, lon),
        weatherService.getUVIndex(lat, lon)
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setAirQuality(aqData);
      setUvIndex(uvData);
    } catch (error) {
      console.error('Weather fetch error:', error);
      toast({
        title: 'Weather Error',
        description: 'Unable to fetch weather data. Please check your API keys.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'bg-green-500' };
    if (uv <= 5) return { level: 'Moderate', color: 'bg-yellow-500' };
    if (uv <= 7) return { level: 'High', color: 'bg-orange-500' };
    if (uv <= 10) return { level: 'Very High', color: 'bg-red-500' };
    return { level: 'Extreme', color: 'bg-purple-500' };
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 1) return { level: 'Good', color: 'bg-green-500' };
    if (aqi <= 2) return { level: 'Fair', color: 'bg-yellow-500' };
    if (aqi <= 3) return { level: 'Moderate', color: 'bg-orange-500' };
    if (aqi <= 4) return { level: 'Poor', color: 'bg-red-500' };
    return { level: 'Very Poor', color: 'bg-purple-500' };
  };

  if (loading && !weather) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="glass rounded-2xl p-8 h-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-lg h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Location Search */}
      <div className="flex items-center justify-between mb-6">
        <LocationSearch onLocationSelect={handleLocationSelect} />
        <Button
          onClick={() => setShowSettings(true)}
          variant="outline"
          size="icon"
          className="glass"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>

      {weather ? (
        <>
          {/* Hero Weather Card */}
          <div className="glass rounded-2xl p-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">{formatDate(currentTime)}</p>
                  <p className="text-2xl font-bold">{formatTime(currentTime)}</p>
                </div>
                <span className="text-6xl animate-bounce">{weather.emoji}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {weather.temperature}°
                  </h2>
                  <p className="text-xl text-foreground/80 mb-2">{weather.condition}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{currentLocation?.name || weather.location}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Droplets className="h-5 w-5 text-blue-400" />
                    <span>Humidity: {weather.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5 text-gray-400" />
                    <span>Wind: {weather.windSpeed} mph</span>
                  </div>
                  {weather.pressure && (
                    <div className="flex items-center gap-3">
                      <Gauge className="h-5 w-5 text-purple-400" />
                      <span>Pressure: {weather.pressure} hPa</span>
                    </div>
                  )}
                  {weather.visibility && weather.visibility > 0 && (
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-green-400" />
                      <span>Visibility: {weather.visibility} km</span>
                    </div>
                  )}
                </div>
              </div>
              
              {weather.description && (
                <div className="mt-6 p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {weather.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UV Index Alert */}
            {uvIndex > 0 && (
              <Card className="glass p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">UV Index</span>
                  </div>
                  <Badge className={`${getUVLevel(uvIndex).color} text-white`}>
                    {getUVLevel(uvIndex).level}
                  </Badge>
                </div>
                <p className="text-2xl font-bold mt-2">{uvIndex}</p>
                {uvIndex > 5 && (
                  <div className="flex items-center gap-1 mt-2 text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Use sun protection</span>
                  </div>
                )}
              </Card>
            )}

            {/* Air Quality */}
            {airQuality && airQuality.aqi > 0 && (
              <Card className="glass p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Air Quality</span>
                  </div>
                  <Badge className={`${getAQILevel(airQuality.aqi).color} text-white`}>
                    {getAQILevel(airQuality.aqi).level}
                  </Badge>
                </div>
                <p className="text-2xl font-bold mt-2">AQI {airQuality.aqi}</p>
                {airQuality.aqi > 3 && (
                  <div className="flex items-center gap-1 mt-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Limit outdoor activities</span>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Energy Meter */}
          <EnergyMeter weather={weather} />

          {/* Daily Checklist */}
          <DailyChecklist weather={weather} />

          {/* 5-Day Forecast */}
          {forecast.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                5-Day Forecast
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {forecast.map((day, index) => (
                  <Card key={index} className="glass p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-2xl mb-2">{day.emoji}</div>
                    <div className="space-y-1">
                      <div className="font-bold">{day.high}°</div>
                      <div className="text-sm text-muted-foreground">{day.low}°</div>
                      {day.precipitation > 0 && (
                        <div className="text-xs text-blue-400">
                          {day.precipitation}mm
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Welcome to 2050 Weather</h2>
          <p className="text-muted-foreground mb-6">
            Search for a location or allow GPS access to get started
          </p>
          <Button onClick={() => setShowSettings(true)}>
            Configure API Keys
          </Button>
        </div>
      )}
    </div>
  );
}