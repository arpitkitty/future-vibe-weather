interface SpaceWeatherData {
  solarActivity: string;
  geomagneticActivity: string;
  solarWindSpeed: number;
  kpIndex: number;
  solarFlares: Array<{
    class: string;
    peakTime: string;
    region: string;
  }>;
  satelliteDisruption: string;
  auroraForecast: {
    visibility: string;
    locations: string[];
  };
}

class SpaceWeatherService {
  async getSpaceWeather(): Promise<SpaceWeatherData> {
    try {
      // Note: In a real implementation, you would use NOAA/NASA APIs
      // For now, we'll simulate space weather data
      
      const mockData: SpaceWeatherData = {
        solarActivity: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)],
        geomagneticActivity: ['Quiet', 'Unsettled', 'Active', 'Minor Storm'][Math.floor(Math.random() * 4)],
        solarWindSpeed: Math.floor(Math.random() * 300) + 300, // 300-600 km/s
        kpIndex: Math.floor(Math.random() * 9), // 0-9 scale
        solarFlares: [
          {
            class: ['A', 'B', 'C', 'M', 'X'][Math.floor(Math.random() * 5)] + (Math.random() * 9 + 1).toFixed(1),
            peakTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            region: 'AR' + Math.floor(Math.random() * 3000 + 1000)
          }
        ],
        satelliteDisruption: ['None', 'Minor', 'Moderate', 'Severe'][Math.floor(Math.random() * 4)],
        auroraForecast: {
          visibility: ['Not Visible', 'Possible', 'Likely', 'Very Likely'][Math.floor(Math.random() * 4)],
          locations: ['Northern Canada', 'Alaska', 'Northern Scandinavia', 'Siberia']
        }
      };

      return mockData;
    } catch (error) {
      console.error('Space weather API error:', error);
      throw error;
    }
  }

  getSeverityColor(activity: string): string {
    const colors: { [key: string]: string } = {
      'Low': 'text-green-500',
      'Quiet': 'text-green-500',
      'None': 'text-green-500',
      'Moderate': 'text-yellow-500',
      'Unsettled': 'text-yellow-500',
      'Minor': 'text-yellow-500',
      'High': 'text-red-500',
      'Active': 'text-orange-500',
      'Minor Storm': 'text-red-500',
      'Severe': 'text-red-600'
    };
    
    return colors[activity] || 'text-gray-500';
  }

  getSpaceWeatherTips(data: SpaceWeatherData): string[] {
    const tips: string[] = [];
    
    if (data.kpIndex >= 5) {
      tips.push('🛰️ Possible GPS and satellite communication disruptions');
      tips.push('📡 Radio blackouts may affect aviation and marine communications');
    }
    
    if (data.auroraForecast.visibility === 'Likely' || data.auroraForecast.visibility === 'Very Likely') {
      tips.push('🌌 Great aurora viewing conditions tonight! Look north after sunset');
    }
    
    if (data.solarActivity === 'High') {
      tips.push('☀️ Increased solar radiation - astronauts take extra precautions');
      tips.push('⚡ Power grid operators monitor for potential fluctuations');
    }
    
    if (tips.length === 0) {
      tips.push('🌌 Calm space weather conditions - perfect for stargazing!');
    }
    
    return tips;
  }
}

export const spaceWeatherService = new SpaceWeatherService();
export type { SpaceWeatherData };