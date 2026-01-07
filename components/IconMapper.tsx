
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  strokeWidth?: number | string;
}

export const IconMapper: React.FC<IconProps> = ({ name, ...props }) => {
  // @ts-ignore - Dynamic access to Lucide icons
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    // @ts-ignore
    return <LucideIcons.HelpCircle {...props} />;
  }

  // @ts-ignore
  return <IconComponent {...props} />;
};

export const AVAILABLE_ICONS = [
  'TestTube2', 'Baby', 'Activity', 'Microscope', 'Stethoscope', 
  'Scissors', 'Heart', 'Clock', 'Snowflake', 'Calendar', 
  'AlertCircle', 'CircleDot', 'Syringe', 'Pill', 'User', 'Sparkles'
];
