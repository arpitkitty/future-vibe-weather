import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Heart, 
  Shirt, 
  Clock, 
  Satellite, 
  Users, 
  Leaf 
} from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'mood', label: 'Mood Weather', icon: Heart },
  { id: 'outfits', label: 'Outfits', icon: Shirt },
  { id: 'time-travel', label: 'Time Travel', icon: Clock },
  { id: 'space', label: 'Space', icon: Satellite },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'eco', label: 'Eco Hub', icon: Leaf },
];

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <nav className="glass rounded-2xl p-2 mb-6 animate-float">
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? "futuristic" : "ghost"}
            size="sm"
            onClick={() => onTabChange(id)}
            className="relative group transition-all duration-300 hover:scale-105"
          >
            <Icon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{label}</span>
            {activeTab === id && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 animate-glow-pulse" />
            )}
          </Button>
        ))}
      </div>
    </nav>
  );
}