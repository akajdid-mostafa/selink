
"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Trash2, FolderOutput, CheckCheck, ListX } from 'lucide-react';
import type { Category } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface BulkActionsBarProps {
  count: number;
  categories: Category[];
  onDelete: () => void;
  onMove: (categoryId: string | null) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  canSelectAnyMore: boolean;
  hasSelection: boolean;
  currentFilterCategoryId?: string | null;
  uncategorizedIdConstant: string;
}

export default function BulkActionsBar({
  count,
  categories,
  onDelete,
  onMove,
  onSelectAll,
  onClearSelection,
  canSelectAnyMore,
  hasSelection,
  currentFilterCategoryId,
  uncategorizedIdConstant,
}: BulkActionsBarProps) {
  if (count === 0 && !hasSelection) return null;

  const displayableCategories = categories.filter(category => category.id !== currentFilterCategoryId);
  const showUncategorizedOptionForMove = currentFilterCategoryId !== null && currentFilterCategoryId !== uncategorizedIdConstant;

  const canMoveToAnyCategory = displayableCategories.length > 0 || showUncategorizedOptionForMove;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl h-auto sm:h-16 py-3 sm:py-0 flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-0">
          <span className="text-sm font-medium text-foreground text-center sm:text-left">
            {count} item{count > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:flex-nowrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={onSelectAll}
                  disabled={!canSelectAnyMore}
                >
                  <CheckCheck className="h-4 w-4" />
                  Select All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select all items in the current view</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={onClearSelection}
                  disabled={!hasSelection}
                >
                  <ListX className="h-4 w-4" />
                  Clear
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear current selection</p>
              </TooltipContent>
            </Tooltip>

            <span className="h-6 w-px bg-border mx-1 hidden sm:inline-block"></span>

            {canMoveToAnyCategory && (
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1.5" disabled={!hasSelection}>
                          <FolderOutput className="h-4 w-4" />
                          Move to
                        </Button>
                      </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Move selected items to a category</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Move selected to</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {displayableCategories.map((category) => (
                    <DropdownMenuItem key={category.id} onSelect={() => onMove(category.id)}>
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                  {displayableCategories.length > 0 && showUncategorizedOptionForMove && <DropdownMenuSeparator />}
                  {showUncategorizedOptionForMove && (
                    <DropdownMenuItem onSelect={() => onMove(null)}>
                      Uncategorized
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="sm" onClick={onDelete} className="gap-1.5" disabled={!hasSelection}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete selected items</p>
              </TooltipContent>
            </Tooltip>

          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

