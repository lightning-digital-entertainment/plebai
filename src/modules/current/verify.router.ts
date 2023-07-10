import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/modules/trpc/trpc.server';

export const verifyInputSchema = z.object({
    verifyUrl: z.string()
  });

  export const verifyOutputSchema = z.object({
    status: z.string(),
    settled: z.boolean(),
    preimage: z.string()
  });

  export type verifyInputSchema = z.infer<typeof verifyInputSchema>;  
  export type verifyOutputSchema = z.infer<typeof verifyOutputSchema>;  


  export function verifyApiAccess(apiPath: string): { headers: HeadersInit, url: string } {
    
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      url: apiPath,
    };
  }

  