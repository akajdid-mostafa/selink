
"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PastelColor } from '@/types';
import type { DraggableStateSnapshot } from '@hello-pangea/dnd';

interface BaseBlockProps {
  children: React.ReactNode;
  className?: string;
  pastelColor?: PastelColor;
  onClick?: () => void;
  innerRef?: React.Ref<HTMLDivElement>;
  draggableProps?: Record<string, any>;
  dragHandleProps?: Record<string, any>;
  snapshot?: DraggableStateSnapshot;
}

export default function BaseBlock({ 
  children, 
  className, 
  pastelColor, 
  onClick,
  innerRef,
  draggableProps,
  dragHandleProps,
  snapshot
}: BaseBlockProps) {
  const pastelClassName = pastelColor ? `pastel-${pastelColor}` : '';
  
  return (
    <Card
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className={cn(
        'group relative rounded-2xl transition-all duration-300 ease-in-out overflow-hidden', 
        snapshot?.isDragging ? 'shadow-2xl' : 'hover:shadow-xl hover:-translate-y-1',
        onClick ? 'cursor-pointer' : '',
        pastelClassName,
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}
