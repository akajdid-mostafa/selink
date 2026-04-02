"use client";

import React from 'react';
import {
  Twitter,
  Instagram,
  Github,
  Linkedin,
  Youtube,
  Link,
  MessageSquare,
  MonitorPlay,
  FileText,
  Image as LucideImage, // Renamed to avoid conflict with next/image
  HelpCircle, // Fallback icon
  type LucideProps,
} from 'lucide-react';

interface IconMap {
  [key: string]: React.ElementType<LucideProps>;
}

const iconMap: IconMap = {
  Twitter,
  Instagram,
  Github,
  Linkedin,
  Youtube,
  Link,
  MessageSquare,
  MonitorPlay,
  FileText,
  Image: LucideImage,
};

interface IconRendererProps extends LucideProps {
  iconName?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, ...props }) => {
  if (!iconName) return null;
  
  const IconComponent = iconMap[iconName] || HelpCircle; // Fallback to HelpCircle if icon not found

  // Log a warning if a specific icon is not found and HelpCircle is used as fallback,
  // but only if iconName was provided and not found in the map.
  if (iconName && !iconMap[iconName]) {
    console.warn(`Icon "${iconName}" not found in IconRenderer.tsx. Rendering fallback HelpCircle icon.`);
  }
  
  return <IconComponent {...props} />;
};

export default IconRenderer;
