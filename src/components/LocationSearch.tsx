import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Target } from 'lucide-react';
import { weatherService } from '@/services/weatherApi';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from '@/components/ui/use-toast';

interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, name?: string) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { 
    latitude, 
    longitude, 
    loading: gpsLoading, 
    error: gpsError, 
    getCurrentPosition 
  } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude) {
      onLocationSelect(latitude, longitude, 'Your Location');
      toast({
        title: 'Location Found',
        description: 'Using your current location for weather data.',
      });
    }
  }, [latitude, longitude, onLocationSelect]);

  useEffect(() => {
    if (gpsError) {
      toast({
        title: 'Location Error',
        description: gpsError,
        variant: 'destructive',
      });
    }
  }, [gpsError]);

  const searchLocation = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await weatherService.searchLocation(searchQuery);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'Unable to search locations. Please check your API keys.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchLocation(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleLocationSelect = (location: Location) => {
    setQuery(`${location.name}, ${location.country}`);
    setShowSuggestions(false);
    onLocationSelect(location.lat, location.lon, location.name);
  };

  const handleGPSLocation = () => {
    getCurrentPosition();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="pl-10 glass"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        
        <Button
          onClick={handleGPSLocation}
          disabled={gpsLoading}
          variant="outline"
          size="icon"
          className="glass"
        >
          {gpsLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <Target className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 glass border-primary/20 max-h-60 overflow-y-auto">
          {suggestions.map((location, index) => (
            <div
              key={index}
              className="p-3 hover:bg-primary/10 cursor-pointer transition-colors border-b border-border/10 last:border-b-0 flex items-center gap-2"
              onClick={() => handleLocationSelect(location)}
            >
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-muted-foreground">{location.country}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}