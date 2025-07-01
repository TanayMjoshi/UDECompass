import React from 'react';
import { Building2 } from 'lucide-react';
import { Building } from '../../types/Building';

export const administration: Building = {
  id: 'administration',
  name: 'Administration Building',
  category: 'Administrative Services',
  x: 310, // Bottom row, center position - increased spacing by 30px
  y: 250,
  width: 180,
  height: 120,
  color: '#059669',
  icon: <Building2 className="w-5 h-5" />,
  description: 'Central hub for student registration, academic records, and administrative services.',
  services: ['Student Registration', 'Academic Records', 'Financial Aid', 'Examination Office']
};