import { useState } from 'react';
import MoodSelector from './MoodSelector';
import WeatherCard from './WeatherCard';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles } from 'lucide-react';

interface WeatherLocation {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  emoji: string;
  matchReason: string;
  country: string;
}

const moodWeatherData: Record<string, WeatherLocation[]> = {
  happy: [
    {
      location: "Santorini, Greece",
      temperature: 28,
      condition: "Sunny",
      humidity: 45,
      windSpeed: 8,
      emoji: "☀️",
      matchReason: "Perfect blue skies for your sunny mood! ☀️",
      country: "🇬🇷"
    },
    {
      location: "Malibu, CA",
      temperature: 25,
      condition: "Clear",
      humidity: 52,
      windSpeed: 12,
      emoji: "🌤️",
      matchReason: "Beach vibes to match your happiness 🏖️",
      country: "🇺🇸"
    },
    {
      location: "Gold Coast, Australia",
      temperature: 26,
      condition: "Partly Sunny",
      humidity: 58,
      windSpeed: 15,
      emoji: "🌞",
      matchReason: "Endless summer energy! 🌊",
      country: "🇦🇺"
    }
  ],
  romantic: [
    {
      location: "Paris, France",
      temperature: 18,
      condition: "Light Rain",
      humidity: 78,
      windSpeed: 6,
      emoji: "🌧️",
      matchReason: "Romantic drizzle for cozy moments 💕",
      country: "🇫🇷"
    },
    {
      location: "Venice, Italy",
      temperature: 22,
      condition: "Misty",
      humidity: 82,
      windSpeed: 4,
      emoji: "🌫️",
      matchReason: "Dreamy mist for romantic walks 🚤",
      country: "🇮🇹"
    },
    {
      location: "Kyoto, Japan",
      temperature: 20,
      condition: "Cherry Blossoms",
      humidity: 65,
      windSpeed: 7,
      emoji: "🌸",
      matchReason: "Sakura season for love birds 🌺",
      country: "🇯🇵"
    }
  ],
  energetic: [
    {
      location: "Rio de Janeiro, Brazil",
      temperature: 32,
      condition: "Hot & Humid",
      humidity: 75,
      windSpeed: 18,
      emoji: "🔥",
      matchReason: "High-energy tropical vibes! ⚡",
      country: "🇧🇷"
    },
    {
      location: "Miami, FL",
      temperature: 30,
      condition: "Thunderstorms",
      humidity: 85,
      windSpeed: 22,
      emoji: "⛈️",
      matchReason: "Electric storm energy! ⚡🌊",
      country: "🇺🇸"
    }
  ],
  lazy: [
    {
      location: "Amsterdam, Netherlands",
      temperature: 15,
      condition: "Overcast",
      humidity: 68,
      windSpeed: 8,
      emoji: "☁️",
      matchReason: "Perfect for Netflix & chill 🛋️",
      country: "🇳🇱"
    },
    {
      location: "Seattle, WA",
      temperature: 16,
      condition: "Drizzly",
      humidity: 85,
      windSpeed: 5,
      emoji: "🌦️",
      matchReason: "Ideal coffee weather ☕",
      country: "🇺🇸"
    }
  ],
  productive: [
    {
      location: "Stockholm, Sweden",
      temperature: 12,
      condition: "Crisp",
      humidity: 55,
      windSpeed: 10,
      emoji: "❄️",
      matchReason: "Sharp focus weather! ⚡",
      country: "🇸🇪"
    },
    {
      location: "Zurich, Switzerland",
      temperature: 14,
      condition: "Clear & Cool",
      humidity: 48,
      windSpeed: 6,
      emoji: "🌬️",
      matchReason: "Crystal clear thinking weather 🧠",
      country: "🇨🇭"
    }
  ],
  melancholy: [
    {
      location: "London, UK",
      temperature: 11,
      condition: "Rainy",
      humidity: 88,
      windSpeed: 12,
      emoji: "🌧️",
      matchReason: "Perfect for introspection 🌂",
      country: "🇬🇧"
    },
    {
      location: "Portland, OR",
      temperature: 13,
      condition: "Foggy Rain",
      humidity: 92,
      windSpeed: 8,
      emoji: "🌫️",
      matchReason: "Contemplative misty vibes 💭",
      country: "🇺🇸"
    }
  ]
};

export default function MoodWeatherPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const getMatchingWeather = () => {
    if (!selectedMood || !moodWeatherData[selectedMood]) return [];
    return moodWeatherData[selectedMood];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Mood Weather Discovery 🌍
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Let AI find the perfect weather destinations that match your current vibe. 
          Experience the world through your emotions! ✨
        </p>
      </div>

      <MoodSelector selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />

      {isGenerating && (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="animate-pulse space-y-4">
            <Sparkles className="h-12 w-12 mx-auto text-primary animate-spin" />
            <h3 className="text-xl font-semibold">AI is finding your perfect weather matches...</h3>
            <p className="text-muted-foreground">Analyzing global weather patterns for your mood 🌍</p>
          </div>
        </div>
      )}

      {!isGenerating && selectedMood && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Perfect matches for your {selectedMood} mood ✨
            </h2>
            <Button variant="neon" onClick={() => handleMoodSelect(selectedMood)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getMatchingWeather().map((weather, index) => (
              <div key={index} className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{weather.location}</span>
                    <span className="text-lg">{weather.country}</span>
                  </div>
                  <span className="text-3xl">{weather.emoji}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {weather.temperature}°
                    </span>
                    <span className="text-lg text-foreground/80">{weather.condition}</span>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm font-medium text-primary">{weather.matchReason}</p>
                  </div>
                  
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" size="sm" className="w-full">
                      Plan Trip Here 🧳
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Want to visit these places? 🗺️</h3>
            <p className="text-muted-foreground mb-4">
              Our AI Travel Planner can create the perfect itinerary based on weather forecasts!
            </p>
            <Button variant="futuristic" size="lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Travel Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}