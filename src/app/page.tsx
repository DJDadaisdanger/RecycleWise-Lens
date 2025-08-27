'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageUploader } from '@/components/app/image-uploader';
import { ResultCard } from '@/components/app/result-card';
import type { WasteItem, ScannedItem } from '@/lib/types';
import { LoaderCircle, BookMarked } from 'lucide-react';
import { recognizeItem } from '@/ai/flows/recognize-item-flow';
import { useToast } from '@/hooks/use-toast';
import { useRecyclingStore } from '@/hooks/use-recycling-store';
import { rules } from '@/lib/recycling-rules';

export default function Home() {
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diyIdeas, setDiyIdeas] = useState<string[]>([]);
  const { toast } = useToast();
  const { addToHistory, activeItem, setActiveItem } = useRecyclingStore();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs when the component mounts or activeItem changes.
    // If there's an activeItem from the store, we display it.
    if (activeItem) {
      setScannedItem(activeItem);
      setImageUrl(activeItem.imageUrl);
      setDiyIdeas([]); // DIY ideas will be re-fetched if needed, or we can store them too.
      setIsLoading(false);
    }
  }, [activeItem]);

  useEffect(() => {
    if (pathname === '/') {
      // Don't reset if there's an active item from history
      if (!activeItem) {
        handleReset();
      }
    }
  }, [pathname]);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setScannedItem(null);
    setImageUrl(null);
    setDiyIdeas([]);
    setActiveItem(null); // Clear any active item from history

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        setImageUrl(dataUrl);

        const result = await recognizeItem({ photoDataUri: dataUrl });
        if (result.item) {
          const rule = rules[result.item];
          if (rule) {
            const itemToSave: ScannedItem = {
              id: `${result.item}-${Date.now()}`,
              name: result.item,
              imageUrl: dataUrl,
              rule,
              timestamp: Date.now(),
            };
            setScannedItem(itemToSave);
            addToHistory(itemToSave);
            setDiyIdeas(result.diyIdeas || []);
            
            toast({
              title: 'Saved to History',
              description: `"${result.item}" has been added to your scan history.`,
              action: <BookMarked className="h-5 w-5 text-primary" />,
            });
          }

        } else {
            throw new Error('Could not identify the item.');
        }
      } catch (error) {
        console.error(error);
        toast({
            title: 'Recognition Failed',
            description: error instanceof Error ? error.message : 'An unknown error occurred while trying to recognize the item.',
            variant: 'destructive',
        });
        handleReset();
      } finally {
        setIsLoading(false);
      }
    };
     reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast({
        title: 'File Read Error',
        description: 'Could not read the uploaded file.',
        variant: 'destructive',
      });
      setIsLoading(false);
    };
  };

  const handleReset = () => {
    setScannedItem(null);
    setImageUrl(null);
    setIsLoading(false);
    setDiyIdeas([]);
    setActiveItem(null); // Also clear the active item from the store
  };

  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            What are you recycling?
          </h1>
          <p className="mt-4 text-lg text-secondary-foreground">
            Snap a photo or upload an image to get instant disposal instructions.
          </p>
        </div>

        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-border bg-card/50 p-8 text-center"
              >
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                <p className="font-semibold text-primary">Analyzing your item...</p>
                <p className="text-sm text-secondary-foreground">This may take a moment.</p>
              </motion.div>
            ) : !scannedItem ? (
              <motion.div
                key="uploader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ImageUploader onImageUpload={handleImageUpload} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ResultCard
                  item={scannedItem}
                  onReset={handleReset}
                  diyIdeas={diyIdeas}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
