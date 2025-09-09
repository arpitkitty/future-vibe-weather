import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { weatherService } from '@/services/weatherApi';
import { toast } from '@/components/ui/use-toast';
import { Settings as SettingsIcon, Key, Palette, Globe } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [tomorrowApiKey, setTomorrowApiKey] = useState('');
  const [openWeatherApiKey, setOpenWeatherApiKey] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState('metric');

  useEffect(() => {
    // Load saved settings
    const stored = localStorage.getItem('weather_api_keys');
    if (stored) {
      const keys = JSON.parse(stored);
      setTomorrowApiKey(keys.tomorrow || '');
      setOpenWeatherApiKey(keys.openWeather || '');
      setAiApiKey(keys.ai || '');
    }

    const theme = localStorage.getItem('theme');
    setDarkMode(theme === 'dark');

    const notifSetting = localStorage.getItem('notifications');
    setNotifications(notifSetting !== 'false');

    const unitSetting = localStorage.getItem('units');
    setUnits(unitSetting || 'metric');
  }, []);

  const saveApiKeys = () => {
    weatherService.setApiKeys(tomorrowApiKey, openWeatherApiKey, aiApiKey);
    toast({
      title: 'API Keys Saved',
      description: 'Your API keys have been saved successfully.',
    });
  };

  const savePreferences = () => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('units', units);
    
    // Apply theme
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toast({
      title: 'Preferences Saved',
      description: 'Your preferences have been updated.',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto glass border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Settings
            </CardTitle>
          </div>
          <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
            ✕
          </Button>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="api" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="api">API Keys</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="h-4 w-4 text-primary" />
                  <h3 className="text-lg font-semibold">API Configuration</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tomorrow-api">Tomorrow.io API Key (Primary Weather)</Label>
                  <Input
                    id="tomorrow-api"
                    type="password"
                    placeholder="Enter your Tomorrow.io API key"
                    value={tomorrowApiKey}
                    onChange={(e) => setTomorrowApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your free API key at{' '}
                    <a href="https://www.tomorrow.io/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      tomorrow.io
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openweather-api">OpenWeatherMap API Key (Fallback & Features)</Label>
                  <Input
                    id="openweather-api"
                    type="password"
                    placeholder="Enter your OpenWeatherMap API key"
                    value={openWeatherApiKey}
                    onChange={(e) => setOpenWeatherApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your free API key at{' '}
                    <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      openweathermap.org
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-api">AI API Key (OpenAI/Groq/Cohere)</Label>
                  <Input
                    id="ai-api"
                    type="password"
                    placeholder="Enter your AI API key for smart suggestions"
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Required for AI-powered mood suggestions and fashion advice
                  </p>
                </div>

                <Button onClick={saveApiKeys} className="w-full">
                  Save API Keys
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-4 w-4 text-primary" />
                  <h3 className="text-lg font-semibold">User Preferences</h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive weather alerts and tips</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Temperature Units</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant={units === 'metric' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setUnits('metric')}
                    >
                      Celsius
                    </Button>
                    <Button 
                      variant={units === 'imperial' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setUnits('imperial')}
                    >
                      Fahrenheit
                    </Button>
                  </div>
                </div>

                <Button onClick={savePreferences} className="w-full">
                  Save Preferences
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-4 w-4 text-primary" />
                  <h3 className="text-lg font-semibold">About 2050 Weather</h3>
                </div>

                <div className="text-center space-y-4">
                  <div className="text-6xl">🌦️</div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    2050 Weather
                  </h2>
                  <p className="text-muted-foreground">
                    The future of weather meets lifestyle. Experience weather like never before with AI-powered insights and futuristic features.
                  </p>
                  
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Features:</strong> Mood Weather, Fashion Forecaster, Space Weather, Energy Saver</p>
                    <p><strong>APIs:</strong> Tomorrow.io, OpenWeatherMap, NASA/NOAA Space Weather</p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Built with ❤️ for the future of weather apps
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}