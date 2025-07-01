import React from 'react';
import { Globe } from 'lucide-react';
import { Building } from '../../types/Building';

export const udePortals: Building = {
  id: 'ude-portals',
  name: 'UDE Portals',
  category: 'Digital Services',
  x: 570, // Bottom row, right position - increased spacing by 30px
  y: 250,
  width: 180,
  height: 120,
  color: '#2563EB',
  icon: <Globe className="w-5 h-5" />,
  description: 'Your digital gateway to all UDE online services and platforms.',
  services: ['Moodle LMS', 'Student Portals', 'Email Access', 'Campus Maps', 'WhatsApp Groups', 'Discord Server'],
  isMainBuilding: true
};