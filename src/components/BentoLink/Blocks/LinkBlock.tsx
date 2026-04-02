
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Trash2, MoreVertical, QrCode, Copy, Download, Link as LinkIconLucide, Pencil } from 'lucide-react';
import BaseBlock from './BaseBlock';
import type { BlockItem, Category } from '@/types';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import IconRenderer from '@/components/IconRenderer';
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from 'qrcode.react';
import type { DraggableStateSnapshot } from '@hello-pangea/dnd';
import { Skeleton } from '@/components/ui/skeleton';


interface LinkBlockProps extends BlockItem {
  onDelete?: (id: string) => void;
  innerRef?: React.Ref<HTMLDivElement>;
  draggableProps?: Record<string, any>;
  dragHandleProps?: Record<string, any>;
  categories: Category[];
  onAssignCategoryToBlock: (blockId: string, categoryId: string | null) => void;
  selectedBlockIds: string[];
  onToggleBlockSelection: (blockId: string) => void;
  isSelectionModeActive: boolean;
  isMobileView: boolean;
  snapshot?: DraggableStateSnapshot;
  onOpenEditModal: (block: BlockItem) => void;
}

export default function LinkBlock({
  id,
  title,
  content,
  linkUrl,
  iconName,
  pastelColor,
  className,
  thumbnailUrl,
  faviconUrl,
  onDelete,
  categories,
  onAssignCategoryToBlock,
  categoryId,
  selectedBlockIds,
  onToggleBlockSelection,
  isSelectionModeActive,
  isMobileView,
  onOpenEditModal,
  innerRef,
  draggableProps,
  dragHandleProps,
  snapshot,
  ...props
}: LinkBlockProps) {
  const { toast } = useToast();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const qrCodeSvgRef = useRef<HTMLDivElement>(null);
  
  const [faviconFailed, setFaviconFailed] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [isFaviconLoading, setIsFaviconLoading] = useState(true);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(true);

  useEffect(() => {
    if (thumbnailUrl) {
      setIsThumbnailLoading(true);
      setThumbnailFailed(false);
    } else {
      setIsThumbnailLoading(false);
    }
  }, [thumbnailUrl]);
  
  useEffect(() => {
    if (faviconUrl) {
      setIsFaviconLoading(true);
      setFaviconFailed(false);
    } else {
       setIsFaviconLoading(false);
    }
  }, [faviconUrl]);


  if (!linkUrl && !isSelectionModeActive) return null;

  const isSelected = selectedBlockIds.includes(id);

  const handleCardClick = () => {
    if (isSelectionModeActive) {
      onToggleBlockSelection(id);
    } else if (linkUrl) {
      window.open(linkUrl, '_blank');
    }
  };

  const handleDelete = () => {
    if (onDelete && id) {
      onDelete(id);
      toast({
        title: "Link Removed!",
        description: "The link URL has been removed.",
      });
    }
  };

  const handleCategorySelect = (newCatId: string | null) => {
    if (id) {
      onAssignCategoryToBlock(id, newCatId);
    }
  };

  const handleCheckboxWrapperClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleBlockSelection(id);
  };

  const handleQrCodeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsQrModalOpen(true);
  };

  const handleCopyUrl = async () => {
    if (!linkUrl) return;
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast({
        title: "URL Copied!",
        description: "The link URL has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy the URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQrCode = () => {
    if (qrCodeSvgRef.current) {
      const svgElement = qrCodeSvgRef.current.querySelector('svg');
      if (svgElement && linkUrl) {
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElement);

        const declaredWidth = svgElement.getAttribute('width');
        const declaredHeight = svgElement.getAttribute('height');
        const size = declaredWidth || '200';

        if (!svgString.includes('width=') || !svgString.includes('height=')) {
            svgString = svgString.replace('<svg', `<svg width="${size}" height="${size}"`);
        }

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || parseInt(declaredWidth || '200', 10);
          canvas.height = img.naturalHeight || parseInt(declaredHeight || '200', 10);

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const pngUrl = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            const safeTitle = (title || linkUrl.split('/').pop() || 'qrcode').replace(/[^a-z0-9_.-]/gi, '_').substring(0, 50);
            downloadLink.href = pngUrl;
            downloadLink.download = `${safeTitle}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

          } else {
            toast({ title: "Download Error", description: "Could not create canvas context for QR code.", variant: "destructive" });
          }
        };
        img.onerror = (e) => {
          console.error("Image load error for QR download:", e);
          toast({
            title: "Download Failed",
            description: "Could not load QR code image for download. Check console for errors.",
            variant: "destructive",
          });
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
      } else {
         toast({
          title: "Download Failed",
          description: "QR Code SVG element not found or link URL is missing.",
          variant: "destructive",
        });
      }
    }
  };

  const finalThumbnailUrl = thumbnailUrl
    ? `/api/image-proxy?url=${encodeURIComponent(thumbnailUrl)}`
    : null;

  const proxiedFaviconUrl = faviconUrl ? `/api/image-proxy?url=${encodeURIComponent(faviconUrl)}` : null;

  const availableCategoriesToMove = categories.filter(cat => cat.id !== categoryId);
  const canMoveToUncategorized = !!categoryId;
  const canBeDeleted = onDelete && id;
  const hasMoveOptions = availableCategoriesToMove.length > 0 || canMoveToUncategorized;

  return (
    <>
      <BaseBlock
        pastelColor={pastelColor}
        className={cn(
          "flex flex-col",
          className,
          isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
        )}
        onClick={handleCardClick}
        innerRef={innerRef}
        draggableProps={draggableProps}
        dragHandleProps={dragHandleProps}
        snapshot={snapshot}
      >
        <div
          className={cn(
            "absolute top-2 left-2 z-20 h-7 w-7 flex items-center justify-center rounded-full bg-card/60 backdrop-blur-sm transition-opacity",
            (isMobileView || isSelected) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={handleCheckboxWrapperClick}
        >
          <Checkbox
            checked={isSelected}
            aria-label={`Select link ${title || 'Untitled'}`}
            className="h-4 w-4 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </div>

        {finalThumbnailUrl && !thumbnailFailed && (
          <div className="relative w-full aspect-[2/1] border-b border-card-foreground/10 overflow-hidden bg-muted">
            {isThumbnailLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
            <img
              src={finalThumbnailUrl}
              alt={title ? `Thumbnail for ${title}` : 'Link thumbnail'}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500 ease-in-out",
                isThumbnailLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsThumbnailLoading(false)}
              onError={() => {
                setThumbnailFailed(true);
                setIsThumbnailLoading(false);
              }}
            />
          </div>
        )}
        <CardHeader
          className={cn(
            "flex flex-row items-start justify-between space-y-0 pb-2 pt-4 z-10",
            (finalThumbnailUrl && !thumbnailFailed) ? "px-4" : "px-6"
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {proxiedFaviconUrl && !faviconFailed ? (
                <div className="relative h-4 w-4">
                  {isFaviconLoading && <Skeleton className="absolute inset-0 h-full w-full rounded-sm" />}
                  <img
                    src={proxiedFaviconUrl}
                    alt={title ? `Favicon for ${title}` : 'Favicon'}
                    width={16}
                    height={16}
                    className={cn(
                      "rounded-sm transition-opacity duration-300",
                      isFaviconLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => setIsFaviconLoading(false)}
                    onError={() => {
                        setFaviconFailed(true);
                        setIsFaviconLoading(false);
                    }}
                  />
                </div>
              ) : iconName ? (
                <IconRenderer iconName={iconName} className="h-5 w-5 text-muted-foreground" />
              ) : null }
          </div>

          <div className="flex-shrink-0 flex items-center gap-1">
            {linkUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={handleQrCodeClick}
                aria-label="Show QR Code"
                title="Show QR Code"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                {hasMoveOptions && (
                  <>
                    <DropdownMenuLabel>Move to Category</DropdownMenuLabel>
                    {availableCategoriesToMove.map((categoryItem) => (
                      <DropdownMenuItem key={categoryItem.id} onSelect={() => handleCategorySelect(categoryItem.id)}>
                        {categoryItem.name}
                      </DropdownMenuItem>
                    ))}
                    {canMoveToUncategorized && (
                      <>
                        {availableCategoriesToMove.length > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuItem onSelect={() => handleCategorySelect(null)}>
                          Uncategorized
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}

                {(hasMoveOptions) && <DropdownMenuSeparator />}

                <DropdownMenuItem onSelect={() => onOpenEditModal({ ...props, id, title, content, linkUrl, iconName, pastelColor, className, thumbnailUrl, faviconUrl, categoryId })} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Thumbnail
                </DropdownMenuItem>
                
                {canBeDeleted && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleDelete} className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent
          className={cn(
            "flex-grow flex flex-col justify-end",
            (finalThumbnailUrl && !thumbnailFailed) ? "px-4 pb-4" : "px-6 pb-6"
          )}
        >
          {title && <CardTitle className="text-xl font-semibold mb-1 text-card-foreground line-clamp-2">{title}</CardTitle>}
          {content && <p className="text-xs text-card-foreground/80 line-clamp-1 break-all">{content}</p>}
        </CardContent>
      </BaseBlock>

      {linkUrl && (
        <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-background">
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription>
                Scan this QR code to access the URL
              </DialogDescription>
            </DialogHeader>
            <div ref={qrCodeSvgRef} className="flex flex-col items-center justify-center py-4">
              <QRCodeSVG value={linkUrl} size={200} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} includeMargin={true} />
              <div className="mt-4 flex items-center justify-center w-full max-w-xs">
                <p className="text-xs text-muted-foreground break-all text-center flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                  {linkUrl}
                </p>
                <Button variant="ghost" size="icon" onClick={handleCopyUrl} className="ml-2 flex-shrink-0 h-7 w-7">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy URL</span>
                </Button>
              </div>
            </div>
            <DialogFooter className="sm:justify-center gap-2">
              <Button type="button" onClick={handleDownloadQrCode} className="gap-1">
                <Download className="h-4 w-4" />
                Download QR
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
