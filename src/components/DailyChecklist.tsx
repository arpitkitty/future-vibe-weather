import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Calendar, Target } from 'lucide-react';
import { type WeatherData } from '@/services/weatherApi';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  icon: string;
  category: 'health' | 'energy' | 'comfort' | 'safety';
}

interface DailyChecklistProps {
  weather: WeatherData;
}

export default function DailyChecklist({ weather }: DailyChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    generateChecklist();
    loadSavedChecklist();
  }, [weather]);

  useEffect(() => {
    const completed = checklist.filter(item => item.completed).length;
    const rate = checklist.length > 0 ? (completed / checklist.length) * 100 : 0;
    setCompletionRate(Math.round(rate));
    
    // Save to localStorage
    localStorage.setItem('daily_checklist', JSON.stringify(checklist));
    localStorage.setItem('checklist_date', new Date().toDateString());
  }, [checklist]);

  const generateChecklist = () => {
    const items: Omit<ChecklistItem, 'completed'>[] = [];
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();
    const humidity = weather.humidity;
    const uv = weather.uv || 0;

    // Health-based items
    if (temp > 25) {
      items.push({
        id: 'hydration',
        text: 'Drink extra water (high temperature)',
        icon: '💧',
        category: 'health'
      });
    }

    if (temp < 10) {
      items.push({
        id: 'warmth',
        text: 'Wear layers and warm clothing',
        icon: '🧥',
        category: 'health'
      });
    }

    if (uv > 5) {
      items.push({
        id: 'sunscreen',
        text: 'Apply sunscreen before going out',
        icon: '🧴',
        category: 'health'
      });
    }

    if (condition.includes('rain')) {
      items.push({
        id: 'umbrella',
        text: 'Take umbrella or rain jacket',
        icon: '☔',
        category: 'comfort'
      });
    }

    // Energy saving items
    if (temp > 22) {
      items.push({
        id: 'ac_temp',
        text: 'Set AC to 24°C or higher',
        icon: '❄️',
        category: 'energy'
      });
    }

    if (temp < 18) {
      items.push({
        id: 'heater_lower',
        text: 'Lower heating by 2°C, use extra blankets',
        icon: '🔥',
        category: 'energy'
      });
    }

    if (condition.includes('sunny')) {
      items.push({
        id: 'solar_tasks',
        text: 'Do energy-heavy tasks (solar benefit high)',
        icon: '☀️',
        category: 'energy'
      });
    }

    // Comfort items
    if (humidity > 70) {
      items.push({
        id: 'dehumidify',
        text: 'Use dehumidifier or ventilation',
        icon: '💨',
        category: 'comfort'
      });
    }

    if (weather.windSpeed > 20) {
      items.push({
        id: 'secure',
        text: 'Secure outdoor items (windy conditions)',
        icon: '💨',
        category: 'safety'
      });
    }

    // Safety items
    if (condition.includes('storm') || condition.includes('severe')) {
      items.push({
        id: 'stay_safe',
        text: 'Avoid outdoor activities (severe weather)',
        icon: '⚠️',
        category: 'safety'
      });
    }

    // Daily wellness
    items.push({
      id: 'mood_check',
      text: 'Take a moment to enjoy the weather',
      icon: '🌈',
      category: 'health'
    });

    // Convert to full ChecklistItem objects
    const fullItems: ChecklistItem[] = items.map(item => ({
      ...item,
      completed: false
    }));

    setChecklist(fullItems);
  };

  const loadSavedChecklist = () => {
    const savedDate = localStorage.getItem('checklist_date');
    const today = new Date().toDateString();
    
    if (savedDate === today) {
      const saved = localStorage.getItem('daily_checklist');
      if (saved) {
        try {
          const savedChecklist = JSON.parse(saved);
          setChecklist(savedChecklist);
        } catch (error) {
          console.error('Error loading saved checklist:', error);
        }
      }
    }
  };

  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getCategoryColor = (category: ChecklistItem['category']) => {
    const colors = {
      health: 'bg-green-500',
      energy: 'bg-yellow-500',
      comfort: 'bg-blue-500',
      safety: 'bg-red-500'
    };
    return colors[category];
  };

  const getCategoryIcon = (category: ChecklistItem['category']) => {
    const icons = {
      health: '💚',
      energy: '⚡',
      comfort: '🏠',
      safety: '🛡️'
    };
    return icons[category];
  };

  if (checklist.length === 0) return null;

  return (
    <Card className="glass p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Weather Checklist
        </h3>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">{completionRate}% Complete</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex-1 bg-background/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            {checklist.filter(item => item.completed).length} / {checklist.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              item.completed 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-background/30 hover:bg-background/50'
            }`}
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => toggleItem(item.id)}
              className="flex-shrink-0"
            />
            
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            
            <div className="flex-1">
              <span className={`text-sm ${
                item.completed ? 'line-through text-muted-foreground' : ''
              }`}>
                {item.text}
              </span>
            </div>

            <Badge 
              variant="outline" 
              className={`text-xs ${getCategoryColor(item.category)} text-white border-0`}
            >
              {getCategoryIcon(item.category)} {item.category}
            </Badge>
          </div>
        ))}
      </div>

      {completionRate === 100 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="text-sm font-medium text-green-400">
            Awesome! You've completed all weather-based tasks today!
          </div>
        </div>
      )}
    </Card>
  );
}