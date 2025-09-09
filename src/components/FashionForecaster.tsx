import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shirt, Sparkles, Heart, Share2 } from 'lucide-react';

interface OutfitSuggestion {
  id: string;
  weather: string;
  temperature: number;
  vibe: string;
  description: string;
  items: string[];
  emoji: string;
  genZCaption: string;
  colors: string[];
}

const outfitSuggestions: OutfitSuggestion[] = [
  {
    id: '1',
    weather: 'Partly Cloudy',
    temperature: 22,
    vibe: 'Casual Chic',
    description: 'Perfect layering weather for that effortless look',
    items: ['Oversized denim jacket', 'White crop tee', 'High-waisted jeans', 'Chunky sneakers', 'Layered gold necklaces'],
    emoji: '✨',
    genZCaption: 'Drizzle vibes 🌧️ → hoodie + kicks today',
    colors: ['Blue', 'White', 'Gold']
  },
  {
    id: '2', 
    weather: 'Sunny',
    temperature: 28,
    vibe: 'Beach Ready',
    description: 'Sun protection meets style goals',
    items: ['Linen button-up (open)', 'Bralette', 'Flowy midi skirt', 'Strappy sandals', 'Oversized sunglasses'],
    emoji: '☀️',
    genZCaption: 'Main character energy in this heat 🔥✨',
    colors: ['Beige', 'White', 'Tan']
  },
  {
    id: '3',
    weather: 'Rainy',
    temperature: 16,
    vibe: 'Cozy Mood',
    description: 'Stay dry while serving looks',
    items: ['Trench coat', 'Turtleneck sweater', 'Leather boots', 'Crossbody bag', 'Statement umbrella'],
    emoji: '🌧️',
    genZCaption: 'Rainy day = main character moment 💅',
    colors: ['Camel', 'Black', 'Brown']
  },
  {
    id: '4',
    weather: 'Cold & Crisp',
    temperature: 8,
    vibe: 'Winter Chic',
    description: 'Bundle up in style',
    items: ['Puffer coat', 'Cashmere scarf', 'Thermal leggings', 'Combat boots', 'Beanie'],
    emoji: '❄️',
    genZCaption: 'Cold girl winter but make it fashion 🥶✨',
    colors: ['Black', 'Grey', 'White']
  }
];

export default function FashionForecaster() {
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [likedOutfits, setLikedOutfits] = useState<Set<string>>(new Set());

  const generateNewOutfit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const toggleLike = (outfitId: string) => {
    const newLiked = new Set(likedOutfits);
    if (newLiked.has(outfitId)) {
      newLiked.delete(outfitId);
    } else {
      newLiked.add(outfitId);
    }
    setLikedOutfits(newLiked);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Fashion Forecaster 👗
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered outfit suggestions based on today's weather. Stay stylish, stay comfortable! ✨
        </p>
      </div>

      {/* Generate New Outfit */}
      <div className="glass rounded-2xl p-6 text-center">
        <Shirt className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold mb-2">Get Your Perfect Outfit</h2>
        <p className="text-muted-foreground mb-4">
          Based on current weather: 22°C, Partly Cloudy ⛅
        </p>
        <Button 
          variant="futuristic" 
          size="lg" 
          onClick={generateNewOutfit}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Generating Your Look...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate New Outfit
            </>
          )}
        </Button>
      </div>

      {/* Outfit Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {outfitSuggestions.map((outfit) => (
          <div 
            key={outfit.id}
            className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedOutfit(outfit.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{outfit.emoji}</span>
                  <h3 className="font-bold text-lg">{outfit.vibe}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {outfit.weather} • {outfit.temperature}°C
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(outfit.id);
                  }}
                  className={likedOutfits.has(outfit.id) ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${likedOutfits.has(outfit.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm">{outfit.description}</p>
              
              {/* Gen-Z Caption */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <p className="font-medium text-sm">{outfit.genZCaption}</p>
              </div>

              {/* Outfit Items */}
              <div>
                <h4 className="font-semibold text-sm mb-2">The Look:</h4>
                <div className="space-y-1">
                  {outfit.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary/60" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Color Palette:</h4>
                <div className="flex gap-2">
                  {outfit.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="px-2 py-1 rounded-full text-xs glass"
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                Save to My Closet 👗
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Styling Tips */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Styling Tips for Today
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-2">🌡️ Temperature Alert</h4>
            <p>Perfect layering weather! Morning might be cooler, so bring a light jacket you can remove later.</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
            <h4 className="font-semibold mb-2">☀️ UV Protection</h4>
            <p>UV index is moderate today. Don't forget sunglasses and SPF if you'll be outdoors!</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <h4 className="font-semibold mb-2">👟 Footwear Tip</h4>
            <p>Slightly damp conditions expected. Avoid suede and opt for water-resistant materials.</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-2">✨ Vibe Check</h4>
            <p>Today's weather calls for comfortable confidence. Perfect for that casual-chic aesthetic!</p>
          </div>
        </div>
      </div>
    </div>
  );
}