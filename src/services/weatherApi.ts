interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  emoji: string;
  description?: string;
  uv?: number;
  aqi?: number;
  pressure?: number;
  visibility?: number;
  moonPhase?: string;
}

interface ForecastData {
  date: string;
  high: number;
  low: number;
  condition: string;
  emoji: string;
  precipitation: number;
}

class WeatherService {
  private tomorrowApiKey: string = '';
  private openWeatherApiKey: string = '';
  private aiApiKey: string = '';

  setApiKeys(tomorrow: string, openWeather: string, ai: string) {
    this.tomorrowApiKey = tomorrow;
    this.openWeatherApiKey = openWeather;
    this.aiApiKey = ai;
    
    // Store in localStorage
    localStorage.setItem('weather_api_keys', JSON.stringify({
      tomorrow, openWeather, ai
    }));
  }

  loadApiKeys() {
    const stored = localStorage.getItem('weather_api_keys');
    if (stored) {
      const keys = JSON.parse(stored);
      this.tomorrowApiKey = keys.tomorrow || '';
      this.openWeatherApiKey = keys.openWeather || '';
      this.aiApiKey = keys.ai || '';
    }
  }

  private getWeatherEmoji(condition: string, isDay: boolean = true): string {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('cloud')) return isDay ? '☁️' : '☁️';
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return isDay ? '☀️' : '🌙';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
    if (conditionLower.includes('wind')) return '💨';
    return isDay ? '☀️' : '🌙';
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      // Try Tomorrow.io first
      if (this.tomorrowApiKey) {
        const response = await fetch(
          `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,weatherCode,humidity,windSpeed,uvIndex,pressureSeaLevel,visibility,moonPhase&timesteps=current&units=metric&apikey=${this.tomorrowApiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const current = data.data.timelines[0].intervals[0].values;
          
          return {
            location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
            temperature: Math.round(current.temperature),
            condition: this.getConditionFromCode(current.weatherCode),
            humidity: Math.round(current.humidity),
            windSpeed: Math.round(current.windSpeed * 2.237), // m/s to mph
            emoji: this.getWeatherEmoji(this.getConditionFromCode(current.weatherCode)),
            description: `${this.getConditionFromCode(current.weatherCode)} weather today`,
            uv: current.uvIndex,
            aqi: 0, // Tomorrow.io doesn't provide AQI in free tier
            pressure: Math.round(current.pressureSeaLevel),
            visibility: Math.round(current.visibility),
            moonPhase: current.moonPhase
          };
        }
      }

      // Fallback to OpenWeatherMap
      if (this.openWeatherApiKey) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.openWeatherApiKey}&units=metric`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          return {
            location: data.name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 2.237), // m/s to mph
            emoji: this.getWeatherEmoji(data.weather[0].main),
            description: data.weather[0].description,
            uv: 0, // Requires separate API call
            pressure: data.main.pressure,
            visibility: data.visibility ? Math.round(data.visibility / 1000) : 0
          };
        }
      }

      throw new Error('No valid API keys provided');
    } catch (error) {
      console.error('Weather API error:', error);
      throw error;
    }
  }

  async searchLocation(query: string): Promise<Array<{name: string, lat: number, lon: number, country: string}>> {
    try {
      if (this.openWeatherApiKey) {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.openWeatherApiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          return data.map((item: any) => ({
            name: item.name,
            lat: item.lat,
            lon: item.lon,
            country: item.country
          }));
        }
      }
      
      throw new Error('Location search failed');
    } catch (error) {
      console.error('Location search error:', error);
      throw error;
    }
  }

  async getForecast(lat: number, lon: number, days: number = 5): Promise<ForecastData[]> {
    try {
      if (this.openWeatherApiKey) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.openWeatherApiKey}&units=metric&cnt=${days * 8}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const dailyData: { [key: string]: any } = {};
          
          data.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyData[date]) {
              dailyData[date] = {
                temps: [item.main.temp],
                condition: item.weather[0].main,
                precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0
              };
            } else {
              dailyData[date].temps.push(item.main.temp);
              dailyData[date].precipitation += item.rain?.['3h'] || item.snow?.['3h'] || 0;
            }
          });

          return Object.entries(dailyData).slice(0, days).map(([date, info]: [string, any]) => ({
            date,
            high: Math.round(Math.max(...info.temps)),
            low: Math.round(Math.min(...info.temps)),
            condition: info.condition,
            emoji: this.getWeatherEmoji(info.condition),
            precipitation: Math.round(info.precipitation * 100) / 100
          }));
        }
      }
      
      return [];
    } catch (error) {
      console.error('Forecast error:', error);
      return [];
    }
  }

  async getAirQuality(lat: number, lon: number): Promise<{aqi: number, pm25: number, pm10: number, o3: number, no2: number}> {
    try {
      if (this.openWeatherApiKey) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.openWeatherApiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const components = data.list[0].components;
          
          return {
            aqi: data.list[0].main.aqi,
            pm25: components.pm2_5,
            pm10: components.pm10,
            o3: components.o3,
            no2: components.no2
          };
        }
      }
      
      return { aqi: 0, pm25: 0, pm10: 0, o3: 0, no2: 0 };
    } catch (error) {
      console.error('Air quality error:', error);
      return { aqi: 0, pm25: 0, pm10: 0, o3: 0, no2: 0 };
    }
  }

  async getUVIndex(lat: number, lon: number): Promise<number> {
    try {
      if (this.openWeatherApiKey) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${this.openWeatherApiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          return data.value;
        }
      }
      
      return 0;
    } catch (error) {
      console.error('UV Index error:', error);
      return 0;
    }
  }

  private getConditionFromCode(code: number): string {
    // Tomorrow.io weather codes mapping
    const codes: { [key: number]: string } = {
      1000: 'Clear',
      1100: 'Mostly Clear',
      1101: 'Partly Cloudy',
      1102: 'Mostly Cloudy',
      1001: 'Cloudy',
      2000: 'Fog',
      2100: 'Light Fog',
      4000: 'Drizzle',
      4001: 'Rain',
      4200: 'Light Rain',
      4201: 'Heavy Rain',
      5000: 'Snow',
      5001: 'Flurries',
      5100: 'Light Snow',
      5101: 'Heavy Snow',
      6000: 'Freezing Drizzle',
      6001: 'Freezing Rain',
      6200: 'Light Freezing Rain',
      6201: 'Heavy Freezing Rain',
      7000: 'Ice Pellets',
      7101: 'Heavy Ice Pellets',
      7102: 'Light Ice Pellets',
      8000: 'Thunderstorm'
    };
    
    return codes[code] || 'Unknown';
  }

  async generateAISuggestion(prompt: string): Promise<string> {
    if (!this.aiApiKey) {
      return 'Please add an AI API key in settings to get personalized suggestions.';
    }

    try {
      // This is a mock implementation - you would integrate with OpenAI, Groq, or Cohere here
      const mockResponses = [
        'Based on the current weather conditions, I recommend staying hydrated and wearing light, breathable fabrics.',
        'The atmospheric pressure suggests a great day for outdoor activities. Consider a morning walk or bike ride!',
        'Current humidity levels indicate you might want to use a moisturizer and drink extra water today.',
        'The UV index is moderate - perfect for outdoor activities with proper sun protection.',
        'Energy-saving tip: With these temperatures, you can reduce AC usage by opening windows during cooler hours.'
      ];
      
      return mockResponses[Math.floor(Math.random() * mockResponses.length)];
    } catch (error) {
      console.error('AI suggestion error:', error);
      return 'Unable to generate suggestion at the moment.';
    }
  }
}

export const weatherService = new WeatherService();
export type { WeatherData, ForecastData };