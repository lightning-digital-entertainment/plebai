import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/modules/trpc/trpc.server';

export const requestInputSchema = z.object({
    amtinsats: z.number()
  });

  export const requestOutputSchema = z.object({
    pr: z.string(),
    verify: z.string()
  });

  export type requestInputSchema = z.infer<typeof requestInputSchema>;  
  export type requestOutputSchema = z.infer<typeof requestOutputSchema>;  


  export function requestApiAccess(apiPath: string): { headers: HeadersInit, url: string } {
    // API key
   
  
    // API host
    let host = (process.env.CURRENT_API_HOST || '').trim();
    
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      url: host + apiPath,
    };
  }

  export interface payResponse {
    "disposable": null,
    "verify": string,
    "routes": [],  
    "pr": string,
    "memo": string
  };