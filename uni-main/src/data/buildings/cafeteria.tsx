import React from 'react';
import { Utensils } from 'lucide-react';
import { Building } from '../../types/Building';

export const cafeteria: Building = {
  id: 'cafeteria',
  name: 'Cafeteria/Mensa',
  category: 'Dining',
  x: 570, // Top row, right position - increased spacing by 30px
  y: 50,
  width: 180,
  height: 120,
  color: '#DC2626',
  icon: <Utensils className="w-5 h-5" />,
  description: 'Delicious, affordable meals and vibrant dining atmosphere.',
  services: ['Daily Menus', 'Vegetarian Options', 'International Cuisine', 'Coffee & Snacks']
};