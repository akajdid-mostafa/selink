import BaseBlock from './BaseBlock';
import type { BlockItem } from '@/types';
import { cn } from '@/lib/utils';
import type React from 'react';
import type { DraggableStateSnapshot } from '@hello-pangea/dnd';

interface VideoBlockProps extends BlockItem {
  innerRef?: React.Ref<HTMLDivElement>;
  draggableProps?: Record<string, any>;
  dragHandleProps?: Record<string, any>;
  snapshot?: DraggableStateSnapshot;
}

export default function VideoBlock({ 
  videoUrl, 
  title, 
  pastelColor, 
  className,
  innerRef,
  draggableProps,
  dragHandleProps,
  snapshot
}: VideoBlockProps) {
  if (!videoUrl) return null;

  let embedUrl = videoUrl;
  if (videoUrl.includes("youtube.com/watch?v=")) {
    const videoId = videoUrl.split("v=")[1].split("&")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (videoUrl.includes("youtu.be/")) {
    const videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }
  
  return (
    <BaseBlock 
      pastelColor={pastelColor} 
      className={cn("p-0 overflow-hidden", className)}
      innerRef={innerRef}
      draggableProps={draggableProps}
      dragHandleProps={dragHandleProps}
      snapshot={snapshot}
    >
      <div className="aspect-video w-full h-full">
        <iframe
          src={embedUrl}
          title={title || 'Embedded Video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </BaseBlock>
  );
}
