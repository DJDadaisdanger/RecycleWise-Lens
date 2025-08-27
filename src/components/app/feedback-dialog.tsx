'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { improveRecognitionQuality } from '@/ai/flows/improve-recognition-quality';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

interface FeedbackDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  incorrectClassification: string;
  photoDataUri: string;
}

const feedbackSchema = z.object({
  correctClassification: z.string().min(2, {
    message: 'Please enter a valid classification.',
  }),
  userNotes: z.string().optional(),
});

export function FeedbackDialog({ isOpen, setIsOpen, incorrectClassification, photoDataUri }: FeedbackDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      correctClassification: '',
      userNotes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    setIsSubmitting(true);
    try {
      const result = await improveRecognitionQuality({
        photoDataUri,
        incorrectClassification,
        correctClassification: values.correctClassification,
        userNotes: values.userNotes,
      });

      if (result.success) {
        toast({
          title: 'Feedback Submitted',
          description: result.message,
        });
        setIsOpen(false);
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Improve Recognition Quality</DialogTitle>
          <DialogDescription>
            Help us improve our AI by providing the correct classification for this item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>Incorrect Classification</Label>
                <Input disabled value={incorrectClassification} />
            </div>
            <FormField
              control={form.control}
              name="correctClassification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Classification</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Aluminum Can" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., This is a can for sparkling water, not soda." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Submit Feedback
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
