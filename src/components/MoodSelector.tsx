import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smile, Frown, Heart, Coffee, Zap, Cloud } from 'lucide-react';

interface Mood {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  gradient: string;
  description: string;
}

const moods: Mood[] = [
  {
    id: 'happy',
    label: 'Happy',
    icon: Smile,
    gradient: 'from-yellow-400 to-orange-500',
    description: 'Sunny and bright vibes ☀️'
  },
  {
    id: 'romantic',
    label: 'Romantic',
    icon: Heart,
    gradient: 'from-pink-400 to-red-500',
    description: 'Perfect for cozy moments 💕'
  },
  {
    id: 'energetic',
    label: 'Energetic',
    icon: Zap,
    gradient: 'from-primary to-accent',
    description: 'Ready for adventure! ⚡'
  },
  {
    id: 'lazy',
    label: 'Lazy',
    icon: Cloud,
    gradient: 'from-gray-400 to-blue-500',
    description: 'Cozy indoor weather 🛋️'
  },
  {
    id: 'productive',
    label: 'Productive',
    icon: Coffee,
    gradient: 'from-amber-600 to-orange-700',
    description: 'Perfect work weather ☕'
  },
  {
    id: 'melancholy',
    label: 'Melancholy',
    icon: Frown,
    gradient: 'from-indigo-400 to-purple-600',
    description: 'Contemplative rainy days 🌧️'
  },
];

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        What's your vibe today? ✨
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;
          
          return (
            <Button
              key={mood.id}
              variant={isSelected ? "futuristic" : "ghost"}
              onClick={() => onMoodSelect(mood.id)}
              className={`relative h-24 flex-col gap-2 group transition-all duration-300 hover:scale-105 ${
                isSelected ? 'ring-2 ring-primary animate-glow-pulse' : ''
              }`}
            >
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${mood.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <Icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold text-sm">{mood.label}</div>
                <div className="text-xs text-muted-foreground">{mood.description}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}