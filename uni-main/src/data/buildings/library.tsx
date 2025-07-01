import React from 'react';
import { BookOpen } from 'lucide-react';
import { Building } from '../../types/Building';

export const library: Building = {
  id: 'library',
  name: 'Central Library',
  category: 'Academic Resources',
  x: 50, // Top row, left position
  y: 50,
  width: 180,
  height: 120,
  color: '#8B4513',
  icon: <BookOpen className="w-5 h-5" />,
  description: 'Your gateway to academic excellence and research resources.',
  services: ['Digital Library Access', 'Study Rooms', 'Research Support', 'Printing Services'],
  isMainBuilding: true
};