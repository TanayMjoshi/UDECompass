import React from 'react';
import { Users } from 'lucide-react';
import { Building } from '../../types/Building';

export const studentCenter: Building = {
  id: 'student-center',
  name: 'Student Center',
  category: 'Student Life',
  x: 310, // Top row, center position - increased spacing by 30px
  y: 50,
  width: 180,
  height: 120,
  color: '#BE185D',
  icon: <Users className="w-5 h-5" />,
  description: 'Hub for student activities, organizations, and community discussions.',
  services: ['Student Organizations', 'Event Spaces', 'Counseling Services', 'Career Center', 'Student Forum']
};