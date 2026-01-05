
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export const IconMapper: React.FC<IconProps> = ({ name, ...props }) => {
  // @ts-ignore - Dynamic access to Lucide icons
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export const AVAILABLE_ICONS = [
  'TestTube2', 'Baby', 'Activity', 'Microscope', 'Stethoscope', 
  'Scissors', 'Heart', 'Clock', 'Snowflake', 'Calendar', 
  'AlertCircle', 'CircleDot', 'Syringe', 'Pill', 'User', 'Sparkles'
];
