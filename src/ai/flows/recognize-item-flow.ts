'use server';

/**
 * @fileOverview A flow for recognizing an item from a photo and determining its disposal instructions.
 *
 * - recognizeItem - A function that handles the item recognition process.
 * - RecognizeItemInput - The input type for the recognizeItem function.
 * - RecognizeItemOutput - The return type for the recognizeItem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { WasteItemSchema } from '@/lib/types';

const RecognizeItemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a waste item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizeItemInput = z.infer<typeof RecognizeItemInputSchema>;

const RecognizeItemOutputSchema = z.object({
    item: WasteItemSchema.describe('The identified waste item.'),
    diyIdeas: z.array(z.string()).describe('A list of creative DIY or reuse ideas for the item. For example, for a PET bottle, a good idea would be "Create a vertical garden for herbs or small plants."'),
});
export type RecognizeItemOutput = z.infer<typeof RecognizeItemOutputSchema>;

export async function recognizeItem(input: RecognizeItemInput): Promise<RecognizeItemOutput> {
  return recognizeItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recognizeItemPrompt',
  input: { schema: RecognizeItemInputSchema },
  output: { schema: RecognizeItemOutputSchema },
  prompt: `You are an expert in waste management and creative reuse. Your task is to identify the object in the provided image and suggest some DIY or reuse ideas for it.

  The object is in the following image: {{media url=photoDataUri}}
  
  Please identify the item, paying close attention to visual details. For example, distinguish between a 'PET Bottle' (usually transparent or colored plastic, flexible) and a 'Glass Bottle' (usually rigid, transparent, heavier). Select the most appropriate classification from the available options, and provide a few creative and practical DIY/reuse ideas.`,
});

const recognizeItemFlow = ai.defineFlow(
  {
    name: 'recognizeItemFlow',
    inputSchema: RecognizeItemInputSchema,
    outputSchema: RecognizeItemOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
