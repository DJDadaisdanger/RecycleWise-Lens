'use server';

/**
 * @fileOverview This flow allows users to provide feedback on incorrect item classifications to improve the AI model's accuracy over time.
 *
 * - improveRecognitionQuality - A function that handles the feedback process.
 * - ImproveRecognitionQualityInput - The input type for the improveRecognitionQuality function.
 * - ImproveRecognitionQualityOutput - The return type for the improveRecognitionQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveRecognitionQualityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  incorrectClassification: z.string().describe('The item classification that the AI incorrectly identified.'),
  correctClassification: z.string().describe('The correct classification of the item.'),
  userNotes: z.string().optional().describe('Any additional notes from the user about the item or classification.'),
});
export type ImproveRecognitionQualityInput = z.infer<typeof ImproveRecognitionQualityInputSchema>;

const ImproveRecognitionQualityOutputSchema = z.object({
  success: z.boolean().describe('Whether the feedback was successfully submitted.'),
  message: z.string().describe('A message indicating the status of the feedback submission.'),
});
export type ImproveRecognitionQualityOutput = z.infer<typeof ImproveRecognitionQualityOutputSchema>;

export async function improveRecognitionQuality(input: ImproveRecognitionQualityInput): Promise<ImproveRecognitionQualityOutput> {
  return improveRecognitionQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveRecognitionQualityPrompt',
  input: {schema: ImproveRecognitionQualityInputSchema},
  output: {schema: ImproveRecognitionQualityOutputSchema},
  prompt: `You are an AI model feedback system. A user has provided feedback on an item classification that your model incorrectly identified.

Here's the information:

Photo: {{media url=photoDataUri}}
Incorrect Classification: {{{incorrectClassification}}}
Correct Classification: {{{correctClassification}}}
User Notes: {{{userNotes}}}

Please acknowledge the feedback and thank the user for helping to improve the model. Indicate that the feedback has been successfully submitted.`,
});

const improveRecognitionQualityFlow = ai.defineFlow(
  {
    name: 'improveRecognitionQualityFlow',
    inputSchema: ImproveRecognitionQualityInputSchema,
    outputSchema: ImproveRecognitionQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
