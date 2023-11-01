import { z } from 'zod';


export const requestInputSchema = z.object({
    amtinsats: z.number(),
    nip05: z.string()

  });

  export const requestOutputSchema = z.object({
    pr: z.string(),
    verify: z.string()
  });

  export type requestInputSchema = z.infer<typeof requestInputSchema>;  
  export type requestOutputSchema = z.infer<typeof requestOutputSchema>;  


  export function requestApiAccess(amtinsats: number, nip05:string): { headers: HeadersInit, url: string } {
    // API key

    const [username, hostname] = nip05.split('@');
   
    const apiPath = `/process-static-charges/${username}?amount=${amtinsats}`
  
    // API host
    let host = ('https://' +hostname).trim();
    
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      url: host + apiPath,
    };
  }