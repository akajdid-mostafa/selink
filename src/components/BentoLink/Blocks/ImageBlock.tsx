 "use client";

import Image from 'next/image';
import BaseBlock from './BaseBlock';
import type { BlockItem } from '@/types';
import { cn } from '@/lib/utils';
import type { DraggableStateSnapshot } from '@hello-pangea/dnd';

interface ImageBlockProps extends BlockItem {
  innerRef?: React.Ref<HTMLDivElement>;
  draggableProps?: Record<string, any>;
  dragHandleProps?: Record<string, any>;
  snapshot?: DraggableStateSnapshot;
}

export default function ImageBlock({ 
  imageUrl, 
  imageAlt, 
  pastelColor, 
  className, 
  linkUrl, 
  dataAiHint,
  innerRef,
  draggableProps,
  dragHandleProps,
  snapshot
}: ImageBlockProps) {
  if (!imageUrl) return null;

  const handleClick = () => {
    if (linkUrl) {
      window.open(linkUrl, '_blank');
    }
  };

  const imageContent = (
      <div className="relative w-full h-full aspect-[4/3] sm:aspect-square md:aspect-[4/3] lg:aspect-square">
         <Image
          src={imageUrl}
          alt={imageAlt || 'Bento block image'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint={dataAiHint || "abstract background"}
        />
      </div>
  );
  
  return (
    <BaseBlock 
      pastelColor={pastelColor} 
      className={cn("p-0", className)} 
      onClick={linkUrl ? handleClick : undefined}
      innerRef={innerRef}
      draggableProps={draggableProps}
      dragHandleProps={dragHandleProps}
      snapshot={snapshot}
    >
      {imageContent}
    </BaseBlock>
  );
}
