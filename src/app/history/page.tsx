'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { History, Recycle, Trash2, Leaf, Package, Trash } from 'lucide-react';
import { useRecyclingStore } from '@/hooks/use-recycling-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { DisposalAction, ScannedItem } from '@/lib/types';

const actionIcons: Record<DisposalAction, React.ElementType> = {
  Recycle: Recycle,
  Landfill: Trash2,
  Compost: Leaf,
  'Special Drop-off': Package,
};

export default function HistoryPage() {
  const { history, clearHistory, setActiveItem } = useRecyclingStore();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleHistoryItemClick = (item: ScannedItem) => {
    setActiveItem(item);
    router.push('/');
  };

  const displayedHistory = isClient ? history : [];

  return (
    <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">Scan History</h2>
            <p className="text-secondary-foreground">A log of all your scanned items. Click one to view details.</p>
        </div>
        {displayedHistory.length > 0 && (
            <Button variant="destructive" onClick={() => {
                clearHistory();
                // also clear active item when clearing history
                setActiveItem(null);
            }}>
                <Trash className="mr-2 h-4 w-4" />
                Clear History
            </Button>
        )}
      </div>

      {!isClient ? (
         <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-muted rounded-md animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
                        <div className="h-3 w-32 bg-muted rounded-md animate-pulse" />
                    </div>
                </div>
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
            </div>
             <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-muted rounded-md animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
                        <div className="h-3 w-28 bg-muted rounded-md animate-pulse" />
                    </div>
                </div>
                <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
            </div>
         </div>
      ) : displayedHistory.length === 0 ? (
        <Alert className="mt-8">
            <History className="h-4 w-4" />
            <AlertTitle>No History Yet</AlertTitle>
            <AlertDescription>
                Your scanned items will appear here. Go to the "Scan Item" tab to get started.
            </AlertDescription>
        </Alert>
      ) : (
        <Card>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                    <ul className="divide-y divide-border">
                        {displayedHistory.map((item: ScannedItem) => {
                            const Icon = actionIcons[item.rule.action];
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleHistoryItemClick(item)}
                                        className="flex w-full items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint="waste item" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-xs text-secondary-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            {item.rule.action}
                                        </Badge>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </ScrollArea>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
