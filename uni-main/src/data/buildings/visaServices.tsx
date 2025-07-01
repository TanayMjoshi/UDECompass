import React from 'react';
import { FileText } from 'lucide-react';
import { Building } from '../../types/Building';

export const visaServices: Building = {
  id: 'visa-services',
  name: 'Visa Services',
  category: 'International Support',
  x: 50, // Bottom row, left position
  y: 250,
  width: 180,
  height: 120,
  color: '#7C2D12',
  icon: <FileText className="w-5 h-5" />,
  description: 'Comprehensive immigration and visa support for international students.',
  services: ['Visa Applications', 'Residence Permits', 'Document Verification', 'Immigration Consultation']
};