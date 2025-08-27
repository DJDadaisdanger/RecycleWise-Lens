'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Recycle,
  Trash2,
  Leaf,
  Package,
  Info,
  Link as LinkIcon,
  RefreshCcw,
  Lightbulb,
  Save,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import type { DisposalAction, ScannedItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FeedbackDialog } from './feedback-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRecyclingStore } from '@/hooks/use-recycling-store';
import { useToast } from '@/hooks/use-toast';

interface ResultCardProps {
  item: ScannedItem;
  onReset: () => void;
  diyIdeas: string[];
}

const actionIcons: Record<DisposalAction, React.ElementType> = {
  Recycle: Recycle,
  Landfill: Trash2,
  Compost: Leaf,
  'Special Drop-off': Package,
};

const actionColors: Record<DisposalAction, string> = {
  Recycle: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Landfill: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  Compost: 'bg-green-500/20 text-green-400 border-green-500/30',
  'Special Drop-off': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export function ResultCard({ item, onReset, diyIdeas }: ResultCardProps) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const { updateWeight, recordCorrectIdentification, recordIncorrectIdentification } = useRecyclingStore();
  const { toast } = useToast();

  const { rule } = item;

  if (!rule) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rule not found</CardTitle>
          <CardDescription>We don't have recycling information for "{item.name}" yet.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onReset}>Scan another item</Button>
        </CardFooter>
      </Card>
    );
  }

  const handleWeightSave = () => {
    const weightInGrams = parseFloat(weight);
    if (!isNaN(weightInGrams) && weightInGrams > 0) {
      updateWeight(item.id, weightInGrams / 1000); // Convert g to kg
      toast({
        title: 'Weight Saved',
        description: `The weight for ${item.name} has been updated.`,
      });
      setWeight('');
    } else {
      toast({
        title: 'Invalid Weight',
        description: 'Please enter a valid positive number for the weight.',
        variant: 'destructive',
      });
    }
  };

  const handleCorrect = () => {
    recordCorrectIdentification();
    setFeedbackGiven(true);
    toast({ title: 'Thanks for your feedback!' });
  }

  const handleIncorrect = () => {
    recordIncorrectIdentification();
    setFeedbackGiven(true);
    setIsFeedbackOpen(true);
  }

  const Icon = actionIcons[rule.action];

  return (
    <>
      <Card className="w-full overflow-hidden shadow-2xl shadow-primary/10">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square md:aspect-auto">
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" data-ai-hint="waste item" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="font-headline text-3xl font-bold">{item.name}</h2>
            </div>
          </div>
          <div className="flex flex-col p-6">
            <div className="flex-grow">
              <Badge className={`mb-4 inline-flex items-center gap-2 border text-base ${actionColors[rule.action]}`}>
                <Icon className="h-5 w-5" />
                <span>{rule.action}</span>
              </Badge>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Preparation</h4>
                  <p className="text-secondary-foreground">{rule.preparation}</p>
                </div>
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" /> Notes & Exceptions
                  </h4>
                  <p className="text-secondary-foreground">{rule.notes}</p>
                </div>
                {diyIdeas.length > 0 && (
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" /> Reuse & DIY Ideas
                    </h4>
                    <ul className="list-disc list-inside text-secondary-foreground space-y-1 mt-1">
                      {diyIdeas.map((idea, index) => (
                        <li key={index}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                )}
                 <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    Improve your Impact
                  </h4>
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="weight-input">Enter item weight (optional, in grams)</Label>
                       <div className="flex gap-2">
                        <Input
                          id="weight-input"
                          type="number"
                          placeholder="e.g., 25"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                        <Button onClick={handleWeightSave} size="icon" variant="outline">
                          <Save className="h-4 w-4" />
                          <span className="sr-only">Save weight</span>
                        </Button>
                      </div>
                      <p className="text-xs text-secondary-foreground">
                        Adding a weight helps make your dashboard stats more accurate.
                      </p>
                    </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
                {feedbackGiven ? (
                    <div className="text-sm text-center text-secondary-foreground p-2 rounded-md bg-accent">
                        Thank you for your feedback!
                    </div>
                ) : (
                    <div className="text-center space-y-2">
                        <p className="text-sm font-medium">Was this correct?</p>
                        <div className="flex justify-center gap-2">
                            <Button onClick={handleCorrect} variant="outline" size="sm"><ThumbsUp className="mr-2" /> Yes</Button>
                            <Button onClick={handleIncorrect} variant="outline" size="sm"><ThumbsDown className="mr-2" /> No</Button>
                        </div>
                    </div>
                )}
              
               <div className="flex flex-wrap gap-2 pt-4 border-t">
                 <Button onClick={onReset} className="flex-1"><RefreshCcw className="mr-2" />Scan Another</Button>
               </div>

               <a href={rule.source} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary-foreground hover:text-primary transition-colors flex items-center gap-2 justify-center pt-2">
                 <LinkIcon className="h-3 w-3" />
                 Source: Official Recycling Guidelines
               </a>
            </div>
          </div>
        </div>
      </Card>
      <FeedbackDialog
        isOpen={isFeedbackOpen}
        setIsOpen={setIsFeedbackOpen}
        incorrectClassification={item.name}
        photoDataUri={item.imageUrl}
      />
    </>
  );
}
