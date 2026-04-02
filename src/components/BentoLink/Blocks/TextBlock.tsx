import BaseBlock from './BaseBlock';
import type { BlockItem } from '@/types';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type React from 'react';
import type { DraggableStateSnapshot } from '@hello-pangea/dnd';

interface TextBlockProps extends BlockItem {
  innerRef?: React.Ref<HTMLDivElement>;
  draggableProps?: Record<string, any>;
  dragHandleProps?: Record<string, any>;
  snapshot?: DraggableStateSnapshot;
}

export default function TextBlock({ 
  title, 
  content, 
  pastelColor, 
  className,
  innerRef,
  draggableProps,
  dragHandleProps,
  snapshot
}: TextBlockProps) {
  return (
    <BaseBlock 
      pastelColor={pastelColor} 
      className={cn(className)}
      innerRef={innerRef}
      draggableProps={draggableProps}
      dragHandleProps={dragHandleProps}
      snapshot={snapshot}
    >
      <CardHeader>
        {title && <CardTitle className="text-xl font-semibold text-card-foreground">{title}</CardTitle>}
      </CardHeader>
      <CardContent>
        {content && <p className="text-base text-card-foreground/80 whitespace-pre-wrap">{content}</p>}
      </CardContent>
    </BaseBlock>
  );
}
