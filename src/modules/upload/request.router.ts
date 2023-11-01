import { z } from 'zod';

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
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${process.env.CURRENT_TOKEN}`,
      },
      url: host + apiPath,
    };
  }