
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import type { FormEvent, ChangeEvent, SVGProps } from 'react';
import ContentGrid from '@/components/BentoLink/ContentGrid';
import BulkActionsBar from '@/components/BentoLink/BulkActionsBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { BlockItem, Category, SyncPayload } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link2, PlusCircle, Trash2, ListFilter, Columns, CheckCheck, ListX, Upload, Download as DownloadIcon, Info, Globe, Dribbble, Github, Instagram, Linkedin, Settings, Pencil } from 'lucide-react';
import { getLinkMetadata } from './actions';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogTitleComponent,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle as SheetTitleComponent,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader as CardHeaderUI } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger as SidebarToggleTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import lzString from 'lz-string';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';


const UNCATEGORIZED_ID = "__UNCATEGORIZED__";

const SelinkLogo = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 focus:outline-none rounded-md"
    aria-label="Scroll to top"
  >
    <svg width="28" height="27" viewBox="0 0 162 243" fill="hsl(var(--primary))" xmlns="http://www.w3.org/2000/svg">
      <path d="M86.7826 161.935C85.7016 163.014 84.8918 163.854 84.0549 164.666C76.8707 171.636 70.3241 171.808 63.1482 164.82C50.7373 152.735 38.4937 140.479 26.1618 128.312C21.8857 124.094 17.6622 119.833 14.6495 114.568C3.84262 95.6823 6.36194 73.0432 22.0256 56.4571C35.8582 41.81 50.1038 27.5144 64.7654 13.6984C84.7123 -5.09795 114.947 -4.36432 134.723 14.7515C138.556 18.4562 142.298 22.255 146.065 26.0277C165.147 45.1413 166.789 71.5898 150.221 92.8694C143.157 101.942 143.039 101.979 134.977 94.0243C131.778 90.8674 128.788 87.4987 125.618 84.3107C123.433 82.1127 123.527 80.3669 125.622 77.9418C135.198 66.8572 134.730 56.0111 124.481 45.6982C120.958 42.1531 117.478 38.5608 113.851 35.1246C105.366 27.0859 92.8911 26.8261 84.5248 34.9544C70.9061 48.1857 57.4544 61.5956 44.178 75.1706C35.0986 84.4542 35.2257 95.9666 44.4471 105.392C58.4251 119.68 72.6542 133.722 86.7757 147.869C93.0069 154.111 93.0290 155.313 86.7826 161.935Z" />
      <path d="M99.7846 183.979C105.587 178.206 111.206 172.748 116.678 167.146C126.818 156.766 126.686 145.921 116.324 135.67C102.939 122.428 89.4945 109.246 76.107 96.0067C74.455 94.373 72.9301 92.5979 71.4638 90.7928C69.9738 88.9588 69.5077 86.5053 70.5898 84.6594C73.9945 78.8514 78.218 73.6204 85.0621 71.7078C88.8685 70.6442 92.5503 72.1493 95.2063 74.7669C111.577 90.9004 128.962 106.110 143.742 123.721C157.406 140.002 156.597 166.056 142.424 181.796C127.485 198.386 111.714 214.278 94.9481 229.008C73.736 247.645 45.1663 246.142 25.0828 226.327C20.813 222.114 16.3811 218.044 12.361 213.603C-5.24871 194.149 -4.08626 163.972 16.1254 144.226C18.245 142.155 20.0664 142.241 22.1166 144.274C27.085 149.202 32.0632 154.123 37.1528 158.925C39.7542 161.379 38.0732 162.925 36.3759 164.697C30.2001 171.143 27.4379 178.588 29.9337 187.486C30.7089 190.249 31.9918 192.804 34.0004 194.858C38.4263 199.384 42.7753 204.010 47.4835 208.229C56.4013 216.221 67.4616 215.912 76.1476 207.499C84.0461 199.848 91.7469 191.994 99.7846 183.979Z" />
    </svg>
    <span
      aria-label="Selink Logo"
      role="img"
      className="font-sans text-xl font-bold text-foreground"
    >
      Selink
    </span>
  </button>
);

const ProductHuntIconSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} className={props.className}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
  </svg>
);


const socialLinksData = [
  { name: 'Website', url: 'https://bento.me/uiirfan', IconComponent: Globe, iconColor: 'group-hover:text-sky-500' },
  { name: 'Dribbble', url: 'https://dribbble.com/uiirfan', IconComponent: Dribbble, iconColor: 'group-hover:text-pink-500' },
  { name: 'GitHub', url: 'https://github.com/irfan7o', IconComponent: Github, iconColor: 'group-hover:text-neutral-800 dark:group-hover:text-neutral-300' },
  { name: 'Instagram', url: 'https://instagram.com/irfan.0z', IconComponent: Instagram, iconColor: 'group-hover:text-rose-500' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/uiirfan', IconComponent: Linkedin, iconColor: 'group-hover:text-blue-600' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/@uiirfan', IconComponent: ProductHuntIconSVG, iconColor: 'group-hover:text-orange-500' },
];


export default function BentoLinkPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null);
  const [categoryToDeleteName, setCategoryToDeleteName] = useState<string | null>(null);

  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const [sharedLinkProcessed, setSharedLinkProcessed] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<BlockItem | null>(null);
  const [newThumbnailUrl, setNewThumbnailUrl] = useState('');

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedBlocks = localStorage.getItem('bentoLinkBlocks');
      if (storedBlocks) {
        setBlocks(JSON.parse(storedBlocks));
      }
      const storedCategories = localStorage.getItem('bentoLinkCategories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      localStorage.removeItem('bentoLinkBlocks');
      localStorage.removeItem('bentoLinkCategories');
      toast({
        title: "Data Load Error",
        description: "Could not load data from local storage. It might be corrupted.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (!sharedLinkProcessed) {
      const shareDataFromUrl = new URLSearchParams(window.location.search).get('share');

      if (shareDataFromUrl) {
        try {
          const decompressed = lzString.decompressFromEncodedURIComponent(shareDataFromUrl);
          if (decompressed) {
            const parsedData: SyncPayload = JSON.parse(decompressed);
            if (parsedData && Array.isArray(parsedData.blocks) && Array.isArray(parsedData.categories)) {
              setBlocks(parsedData.blocks);
              setCategories(parsedData.categories);
              localStorage.setItem('bentoLinkBlocks', JSON.stringify(parsedData.blocks));
              localStorage.setItem('bentoLinkCategories', JSON.stringify(parsedData.categories));
              toast({
                title: "Shared Link Loaded!",
                description: "Blocks and categories have been imported from the shared link.",
              });
            } else {
              throw new Error("Invalid shared data structure.");
            }
          } else {
            throw new Error("Failed to decompress shared data.");
          }
        } catch (error: any) {
          console.error("Error processing share link:", error);
          toast({
            title: "Share Link Error",
            description: error.message || "Could not load data from the share link. It might be invalid or corrupted.",
            variant: "destructive",
          });
        } finally {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('share');
          router.replace(newUrl.pathname + newUrl.search, { scroll: false });
        }
      }
      setSharedLinkProcessed(true); 
    }
  }, [router, sharedLinkProcessed, toast]);


  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('bentoLinkBlocks', JSON.stringify(blocks));
    }
  }, [blocks, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('bentoLinkCategories', JSON.stringify(categories));
    }
  }, [categories, isMounted]);


  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Empty Category Name",
        description: "Please enter a name for the category.",
        variant: "destructive",
      });
      return;
    }
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
    };
    setCategories(prevCategories => [...prevCategories, newCategory]);
    setNewCategoryName('');
    toast({
      title: "Category Added",
      description: `Category "${newCategory.name}" has been added.`,
    });
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDeleteId(category.id);
    setCategoryToDeleteName(category.name);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteCategory = () => {
    if (categoryToDeleteId) {
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryToDeleteId));
      setBlocks(prevBlocks =>
        prevBlocks.map(block =>
          block.categoryId === categoryToDeleteId ? { ...block, categoryId: null } : block
        )
      );
      if (selectedCategoryId === categoryToDeleteId) {
        setSelectedCategoryId(null);
      }
      toast({
        title: "Category Deleted",
        description: `Category "${categoryToDeleteName}" has been deleted. Links within it are now uncategorized.`,
      });
    }
    setIsDeleteDialogOpen(false);
    setCategoryToDeleteId(null);
    setCategoryToDeleteName(null);
  };

  const handleAddLink = async () => {
    if (!newLinkUrl.trim()) {
      toast({
        title: "Empty Link",
        description: "Please enter a URL.",
        variant: "destructive",
      });
      return;
    }

    let normalizedUrl = newLinkUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      new URL(normalizedUrl);
    } catch (_) {
      toast({
        title: "Invalid Link",
        description: "Please enter a valid URL (e.g., https://example.com).",
        variant: "destructive",
      });
      return;
    }

    setIsAddingLink(true);
    try {
      const {
        thumbnailUrl: fetchedThumbnailUrl,
        pageTitle: fetchedPageTitle,
        faviconUrl: fetchedFaviconUrl
      } = await getLinkMetadata(normalizedUrl);

      const newBlock: BlockItem = {
        id: crypto.randomUUID(),
        type: 'link',
        title: fetchedPageTitle, 
        content: normalizedUrl,
        linkUrl: normalizedUrl,
        colSpan: 1,
        thumbnailUrl: fetchedThumbnailUrl ?? undefined,
        faviconUrl: fetchedFaviconUrl ?? undefined,
        categoryId: selectedCategoryId === UNCATEGORIZED_ID ? null : selectedCategoryId,
      };

      setBlocks(prevBlocks => [newBlock, ...prevBlocks]);
      setNewLinkUrl('');
    } catch (error: any) {
        console.error("Failed to add link or fetch metadata:", error);
        toast({
          title: "Error Adding Link",
          description: error.message || "Could not fetch link metadata. Please try again.",
          variant: "destructive",
        });
    } finally {
      setIsAddingLink(false);
    }
  };

  const handleDeleteBlock = (idToDelete: string) => {
    setBlocks(currentBlocks => currentBlocks.filter(block => block && block.id !== idToDelete));
    setSelectedBlockIds(prev => prev.filter(id => id !== idToDelete));
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    setBlocks(currentBlocks => {
      const items = Array.from(currentBlocks);
      const [reorderedItem] = items.splice(source.index, 1);
      if (reorderedItem === undefined) {
        return currentBlocks;
      }
      items.splice(destination.index, 0, reorderedItem);
      return items;
    });
  };

  const handleAssignCategoryToBlock = (blockId: string, categoryId: string | null) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId ? { ...block, categoryId: categoryId } : block
      )
    );
    const block = blocks.find(b => b.id === blockId);
    const category = categories.find(c => c.id === categoryId);
    if (block) {
      toast({
        title: "Link Category Updated",
        description: `Link "${block.title}" moved to ${category ? `"${category.name}"` : 'Uncategorized'}.`,
      });
    }
  };

  const handleToggleBlockSelection = (blockId: string) => {
    setSelectedBlockIds(prevSelectedIds =>
      prevSelectedIds.includes(blockId)
        ? prevSelectedIds.filter(id => id !== blockId) 
        : [...prevSelectedIds, blockId]
    );
  };

  const handleDeleteSelectedBlocks = () => {
    setBlocks(prevBlocks => prevBlocks.filter(block => !selectedBlockIds.includes(block.id)));
    const numDeleted = selectedBlockIds.length;
    setSelectedBlockIds([]);
    toast({
      title: "Links Deleted",
      description: `${numDeleted} link(s) have been deleted.`,
    });
  };

  const handleMoveSelectedBlocksToCategory = (newCategoryId: string | null) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        selectedBlockIds.includes(block.id) ? { ...block, categoryId: newCategoryId } : block
      )
    );
    const categoryName = newCategoryId ? categories.find(c => c.id === newCategoryId)?.name : 'Uncategorized';
    const numMoved = selectedBlockIds.length;
    setSelectedBlockIds([]);
    toast({
      title: "Links Moved",
      description: `${numMoved} link(s) moved to ${categoryName || 'Uncategorized'}.`,
    });
  };

  const handleOpenEditModal = (block: BlockItem) => {
    setEditingBlock(block);
    setNewThumbnailUrl(block.thumbnailUrl || '');
    setIsEditModalOpen(true);
  };

  const handleUpdateBlockThumbnail = () => {
    if (!editingBlock) return;
    
    setBlocks(prevBlocks => 
      prevBlocks.map(b => 
        b.id === editingBlock.id 
          ? { ...b, thumbnailUrl: newThumbnailUrl }
          : b
      )
    );
    
    toast({
      title: "Thumbnail Updated",
      description: `Thumbnail for "${editingBlock.title}" has been changed.`,
    });

    setIsEditModalOpen(false);
    setEditingBlock(null);
    setNewThumbnailUrl('');
  };

  const filteredBlocks = useMemo(() => {
    if (selectedCategoryId === null) {
      return blocks;
    }
    if (selectedCategoryId === UNCATEGORIZED_ID) {
      return blocks.filter(block => !block.categoryId);
    }
    return blocks.filter(block => block.categoryId === selectedCategoryId);
  }, [blocks, selectedCategoryId]);

  const isSelectionModeActive = selectedBlockIds.length > 0;

  const allFilteredBlockIds = useMemo(() => filteredBlocks.map(b => b.id), [filteredBlocks]);

  const canSelectAnyMoreInView = useMemo(() => {
    if (filteredBlocks.length === 0) return false;
    return allFilteredBlockIds.some(id => !selectedBlockIds.includes(id));
  }, [allFilteredBlockIds, selectedBlockIds, filteredBlocks.length]);

  const handleSelectAllFilteredBlocks = () => {
    if (filteredBlocks.length === 0) return;
    setSelectedBlockIds(allFilteredBlockIds);
  };

  const handleClearSelection = () => {
    setSelectedBlockIds([]);
  };

  const handleExportData = () => {
    const syncData: SyncPayload = { blocks, categories };
    const jsonString = JSON.stringify(syncData);
    const compressedString = lzString.compressToUTF16(jsonString);
    const blob = new Blob([compressedString], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const currentDate = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    link.href = url;
    link.download = `selink_data_${currentDate}.selink`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
        title: "Data Exported",
        description: "Your data has been exported to a unique .selink file.",
    });
  };

  const triggerImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const compressedString = e.target?.result as string;
        const jsonString = lzString.decompressFromUTF16(compressedString);
        
        if (!jsonString) {
          throw new Error("Invalid or corrupted .selink file. Could not be decompressed.");
        }

        const parsedData = JSON.parse(jsonString) as SyncPayload;

        if (parsedData && Array.isArray(parsedData.blocks) && Array.isArray(parsedData.categories)) {
          setBlocks(parsedData.blocks);
          setCategories(parsedData.categories);
          localStorage.setItem('bentoLinkBlocks', JSON.stringify(parsedData.blocks));
          localStorage.setItem('bentoLinkCategories', JSON.stringify(parsedData.categories));
          toast({
            title: "Data Imported Successfully!",
            description: "Your links and categories have been imported.",
          });
        } else {
          throw new Error("Invalid file structure. The file should contain 'blocks' and 'categories' arrays.");
        }
      } catch (error: any) {
        console.error("Error importing file:", error);
        toast({
          title: "Import Failed",
          description: error.message || "Could not import data. Please check the file format.",
          variant: "destructive",
        });
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  const SettingsTriggerButton = (
      <Button variant="ghost" size="icon" aria-label="Settings">
        <Settings className="h-5 w-5" />
      </Button>
  );

  const SettingsContent = () => (
    <>
      <div className="py-4 space-y-3">
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800">
          <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            We don’t store your data, because your data is your right. Keep it safe by exporting it regularly. You can later import the .selink file to restore your settings on any device.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button variant="outline" onClick={triggerImportClick} className="w-full gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="default" onClick={handleExportData} className="w-full gap-2">
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </>
  );

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <SidebarProvider defaultOpen={false}>
           <Sidebar side="left" variant="sidebar" collapsible="offcanvas" mobileTitle="Categories">
            <SidebarContent className="px-2">
              {isMobile === false && (
                <h2 className="text-lg font-semibold text-foreground mb-3 px-2 pt-2">Categories</h2>
              )}
              <div className="py-2">
                <Input
                  placeholder="New Category"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                  className="h-9 text-sm"
                />
                <Button onClick={handleAddCategory} size="sm" className="w-full gap-1 mt-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setSelectedCategoryId(null)}
                    isActive={selectedCategoryId === null}
                    className="w-full justify-start px-3"
                    tooltip="Show all links"
                  >
                    <Columns className="h-4 w-4" /> All Links
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setSelectedCategoryId(UNCATEGORIZED_ID)}
                    isActive={selectedCategoryId === UNCATEGORIZED_ID}
                    className="w-full justify-start px-3"
                    tooltip="Show uncategorized links"
                  >
                    <ListFilter className="h-4 w-4" /> Uncategorized
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {categories.length > 0 && <SidebarSeparator className="my-2" />}

                {categories.length === 0 && (
                  <SidebarMenuItem className="text-muted-foreground text-xs px-3 py-2 text-center">
                    No categories yet.
                  </SidebarMenuItem>
                )}
                {categories.map((category) => (
                  <SidebarMenuItem key={category.id} className="flex items-center justify-between pr-1 hover:bg-accent/50 rounded-md">
                    <SidebarMenuButton
                      tooltip={category.name}
                      onClick={() => setSelectedCategoryId(category.id)}
                      isActive={selectedCategoryId === category.id}
                      className="flex-grow justify-start px-3"
                    >
                      <span className="truncate">{category.name}</span>
                    </SidebarMenuButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => { e.stopPropagation(); openDeleteDialog(category);}}
                      aria-label={`Delete category ${category.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-2 bg-card px-4 sm:px-6">
                <SidebarToggleTrigger className="h-8 w-8" />
                <div className="flex-1 flex items-center justify-center">
                  <SelinkLogo onClick={handleLogoClick} />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <ThemeToggle />
                  {isMobile ? (
                    <Sheet open={isSyncModalOpen} onOpenChange={setIsSyncModalOpen}>
                      <SheetTrigger asChild>{SettingsTriggerButton}</SheetTrigger>
                      <SheetContent side="bottom" className="rounded-t-lg pb-6">
                        <SheetHeader className="text-left pt-4 pb-2">
                          <SheetTitleComponent>Settings</SheetTitleComponent>
                           <SheetDescription>
                            Backup or restore your link and category data.
                          </SheetDescription>
                        </SheetHeader>
                        <SettingsContent />
                      </SheetContent>
                    </Sheet>
                  ) : (
                    <Dialog open={isSyncModalOpen} onOpenChange={setIsSyncModalOpen}>
                      <DialogTrigger asChild>{SettingsTriggerButton}</DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Settings</DialogTitle>
                          <DialogDescription className="mt-2">
                            Backup or restore your link and category data.
                          </DialogDescription>
                        </DialogHeader>
                        <SettingsContent />
                      </DialogContent>
                    </Dialog>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportFileChange}
                    style={{ display: 'none' }}
                    accept=".selink"
                  />
                </div>
              </header>

              <main className={cn(
                "container mx-auto px-4 py-8 md:py-12 max-w-5xl w-full animate-fadeInUp flex-grow transition-all duration-300 ease-in-out",
                isSelectionModeActive ? "pb-24 sm:pb-16" : "pb-8 md:pb-12" 
              )}>
                <div className="my-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl mx-auto p-4 rounded-lg shadow-sm bg-card">
                  <Input
                    type="url"
                    placeholder="Paste Link"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !isAddingLink) handleAddLink(); }}
                    className="flex-grow text-sm"
                    aria-label="Paste link URL to add"
                    disabled={isAddingLink}
                  />
                  <Button onClick={handleAddLink} className="sm:w-auto w-full gap-1" disabled={isAddingLink}>
                    <Link2 className="h-4 w-4" />
                    {isAddingLink ? 'Adding...' : 'Add Link'}
                  </Button>
                </div>

                <ContentGrid
                  blocks={filteredBlocks}
                  onDeleteBlock={handleDeleteBlock}
                  isDndEnabled={!isSelectionModeActive}
                  categories={categories}
                  onAssignCategoryToBlock={handleAssignCategoryToBlock}
                  selectedBlockIds={selectedBlockIds}
                  onToggleBlockSelection={handleToggleBlockSelection}
                  isSelectionModeActive={isSelectionModeActive}
                  isMobileView={isMobile}
                  onOpenEditModal={handleOpenEditModal}
                />
              </main>
              
            </div>
          </SidebarInset>
        </SidebarProvider>
      </DragDropContext>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitleComponent>Are you sure you want to delete this category?</AlertDialogTitleComponent>
            <AlertDialogDescription>
              This action cannot be undone. Deleting the category "{categoryToDeleteName}" will permanently remove it. Links previously in this category will become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteCategory}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Thumbnail</DialogTitle>
            <DialogDescription>
              Enter a new image URL for the link: "{editingBlock?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="url"
              placeholder="https://example.com/image.png"
              value={newThumbnailUrl}
              onChange={(e) => setNewThumbnailUrl(e.target.value)}
              className="text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateBlockThumbnail}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {isSelectionModeActive && (
        <BulkActionsBar
          count={selectedBlockIds.length}
          categories={categories}
          onDelete={handleDeleteSelectedBlocks}
          onMove={handleMoveSelectedBlocksToCategory}
          onSelectAll={handleSelectAllFilteredBlocks}
          onClearSelection={handleClearSelection}
          canSelectAnyMore={canSelectAnyMoreInView}
          hasSelection={selectedBlockIds.length > 0}
          currentFilterCategoryId={selectedCategoryId}
          uncategorizedIdConstant={UNCATEGORIZED_ID}
        />
      )}

      {isMobile === false && (
        <div className={cn(
          "fixed right-6 z-50 transition-all duration-300 ease-in-out",
          isSelectionModeActive ? "bottom-24" : "bottom-6"
        )}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="default"
                            size="icon"
                            className="rounded-full h-10 w-10 shadow-lg"
                            onClick={() => setIsSocialModalOpen(true)}
                            aria-label="Show social media links"
                        >
                            <Info className="h-7 w-7" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Connect with me</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        )}

        <Dialog open={isSocialModalOpen} onOpenChange={setIsSocialModalOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Connect with Me</DialogTitle>
                    <DialogDescription>
                        Check out my profiles on various platforms.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    {socialLinksData.map((social) => {
                        const Icon = social.IconComponent;
                        return (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                            >
                                <Card className="hover:shadow-md transition-shadow hover:border-primary/50">
                                    <CardHeaderUI className="flex flex-col items-start space-y-2 p-4">
                                        <Icon className={`h-5 w-5 text-muted-foreground ${social.iconColor}`} />
                                        <h3 className="text-sm font-medium">{social.name}</h3>
                                    </CardHeaderUI>
                                </Card>
                            </a>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    </>
  );
}
