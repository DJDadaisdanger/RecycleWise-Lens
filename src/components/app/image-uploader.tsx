'use client';
import { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      onImageUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 p-8 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Camera className="h-8 w-8" />
        </div>
        <h3 className="font-headline text-2xl font-semibold">Scan Your Item</h3>
        <p className="text-secondary-foreground">
          Use your camera or upload a photo to identify your item.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        <Button size="lg" onClick={handleUploadClick}>
          <Upload className="mr-2 h-5 w-5" />
          Upload Image
        </Button>
        <Button size="lg" variant="secondary" onClick={() => toast({ title: 'Camera feature coming soon!' })}>
          <Camera className="mr-2 h-5 w-5" />
          Use Camera
        </Button>
      </div>
    </div>
  );
}
