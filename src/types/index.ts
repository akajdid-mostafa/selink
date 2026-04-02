
import type { LucideIcon } from 'lucide-react';

export type SocialPlatform = 'twitter' | 'instagram' | 'github' | 'linkedin' | 'youtube' | 'tiktok';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  iconName?: string; // Changed from icon: LucideIcon
}

export type BlockType = 'link' | 'image' | 'video' | 'text';

export type PastelColor = 'blue' | 'lavender' | 'mint' | 'peach' | 'yellow';

export interface BlockItem {
  id: string;
  type: BlockType;
  title?: string;
  content?: string; // For text content or description for link
  imageUrl?: string; // For ImageBlock
  imageAlt?: string; // For ImageBlock
  videoUrl?: string; // YouTube or TikTok embed URL
  linkUrl?: string;
  iconName?: string; // Changed from icon?: LucideIcon // For LinkBlock
  colSpan?: number; // Grid column span (e.g., 1, 2, 3)
  rowSpan?: number; // Grid row span
  pastelColor?: PastelColor;
  className?: string; // Additional classes for custom styling / grid spanning
  dataAiHint?: string; // For ImageBlock's main image
  thumbnailUrl?: string; // For LinkBlock's thumbnail
  faviconUrl?: string; // For LinkBlock's favicon
  categoryId?: string | null; // To associate block with a category
}

export interface Category {
  id: string;
  name: string;
}

export interface SyncPayload {
  blocks: BlockItem[];
  categories: Category[];
}
