import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Sun, Snowflake, Lightbulb, Trophy, TrendingDown, TrendingUp } from 'lucide-react';
import { type WeatherData } from '@/services/weatherApi';

interface EnergyMeterProps {
  weather: WeatherData;
}

interface EnergyPrediction {
  acUsage: number;
  heaterUsage: number;
  solarBenefit: number;
  totalCost: number;
  savings: number;
  tips: string[];
}

export default function EnergyMeter({ weather }: EnergyMeterProps) {
  const [energyData, setEnergyData] = useState<EnergyPrediction | null>(null);
  const [streak, setStreak] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    calculateEnergyPrediction();
    loadStreak();
  }, [weather]);

  const calculateEnergyPrediction = () => {
    const temp = weather.temperature;
    const humidity = weather.humidity;
    const condition = weather.condition.toLowerCase();
    
    // Energy usage calculations based on weather
    let acUsage = 0;
    let heaterUsage = 0;
    let solarBenefit = 0;
    const tips: string[] = [];

    // AC Usage (increases with temperature above 22°C)
    if (temp > 22) {
      acUsage = Math.min(100, (temp - 22) * 8 + humidity * 0.3);
      if (acUsage > 70) {
        tips.push('🌡️ High AC usage predicted - consider using fans instead');
      }
    }

    // Heater Usage (increases with temperature below 18°C)
    if (temp < 18) {
      heaterUsage = Math.min(100, (18 - temp) * 6);
      if (heaterUsage > 60) {
        tips.push('🔥 High heating costs - layer up and lower thermostat by 2°C');
      }
    }

    // Solar Benefit (based on conditions)
    if (condition.includes('sunny') || condition.includes('clear')) {
      solarBenefit = 85 + Math.random() * 15;
      tips.push('☀️ Excellent solar generation today - great time for energy-heavy tasks');
    } else if (condition.includes('partly') || condition.includes('cloud')) {
      solarBenefit = 45 + Math.random() * 25;
      tips.push('⛅ Moderate solar generation - plan energy usage accordingly');
    } else if (condition.includes('rain') || condition.includes('storm')) {
      solarBenefit = 10 + Math.random() * 15;
      tips.push('🌧️ Low solar output - conserve energy where possible');
    } else {
      solarBenefit = 30 + Math.random() * 20;
    }

    // Cost calculation (mock values)
    const baseCost = 5.50; // Base daily cost
    const acCost = (acUsage / 100) * 8.20;
    const heaterCost = (heaterUsage / 100) * 12.40;
    const solarSavings = (solarBenefit / 100) * 6.80;
    
    const totalCost = baseCost + acCost + heaterCost - solarSavings;
    const savings = Math.max(0, baseCost - totalCost + solarSavings);

    // Additional tips based on weather
    if (weather.windSpeed > 15) {
      tips.push('💨 Windy conditions - ensure windows are sealed to prevent heat loss');
    }
    
    if (humidity > 70) {
      tips.push('💧 High humidity - dehumidifier may help reduce AC load');
    }

    if (tips.length === 0) {
      tips.push('🎯 Optimal weather conditions for energy efficiency!');
    }

    setEnergyData({
      acUsage: Math.round(acUsage),
      heaterUsage: Math.round(heaterUsage),
      solarBenefit: Math.round(solarBenefit),
      totalCost: parseFloat(totalCost.toFixed(2)),
      savings: parseFloat(savings.toFixed(2)),
      tips
    });
  };

  const loadStreak = () => {
    const savedStreak = localStorage.getItem('energy_saving_streak');
    setStreak(savedStreak ? parseInt(savedStreak) : 0);
  };

  const incrementStreak = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('energy_saving_streak', newStreak.toString());
  };

  const getEfficiencyBadge = () => {
    if (!energyData) return null;
    
    const totalUsage = energyData.acUsage + energyData.heaterUsage;
    if (totalUsage < 30) return { text: 'Eco Hero', color: 'bg-green-500' };
    if (totalUsage < 60) return { text: 'Energy Saver', color: 'bg-blue-500' };
    if (totalUsage < 80) return { text: 'Good Effort', color: 'bg-yellow-500' };
    return { text: 'Room for Improvement', color: 'bg-orange-500' };
  };

  if (!energyData) return null;

  const efficiencyBadge = getEfficiencyBadge();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Energy Saver Mode
        </h3>
        {efficiencyBadge && (
          <Badge className={`${efficiencyBadge.color} text-white`}>
            {efficiencyBadge.text}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AC Usage */}
        <Card className="glass p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Snowflake className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">AC Usage</span>
            </div>
            <span className="text-lg font-bold">{energyData.acUsage}%</span>
          </div>
          <Progress value={energyData.acUsage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Based on {weather.temperature}°C temperature
          </p>
        </Card>

        {/* Heater Usage */}
        <Card className="glass p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Heating</span>
            </div>
            <span className="text-lg font-bold">{energyData.heaterUsage}%</span>
          </div>
          <Progress value={energyData.heaterUsage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Temperature-based prediction
          </p>
        </Card>

        {/* Solar Benefit */}
        <Card className="glass p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Solar Output</span>
            </div>
            <span className="text-lg font-bold">{energyData.solarBenefit}%</span>
          </div>
          <Progress value={energyData.solarBenefit} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {weather.condition} conditions
          </p>
        </Card>
      </div>

      {/* Cost Prediction */}
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">Today's Energy Cost</h4>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">{streak} day streak</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">${energyData.totalCost}</div>
            <div className="text-sm text-muted-foreground">Estimated Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              ${energyData.savings > 0 ? energyData.savings : '0.00'}
            </div>
            <div className="text-sm text-muted-foreground">
              {energyData.savings > 0 ? 'Savings' : 'No Savings'}
            </div>
          </div>
        </div>

        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          className="w-full mb-4"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          {showDetails ? 'Hide Tips' : 'Show Energy Tips'}
        </Button>

        {showDetails && (
          <div className="space-y-2">
            {energyData.tips.map((tip, index) => (
              <div key={index} className="text-sm text-muted-foreground p-2 bg-background/50 rounded">
                {tip}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            onClick={incrementStreak}
            variant="neon"
            size="sm"
            className="flex-1"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Followed Tips Today
          </Button>
          <Button
            onClick={() => setStreak(0)}
            variant="outline"
            size="sm"
          >
            Reset Streak
          </Button>
        </div>
      </Card>
    </div>
  );
}