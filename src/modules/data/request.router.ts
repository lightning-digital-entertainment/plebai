
import { z } from 'zod';

export const requestInputSchema = z.object({
    fingerPrint: z.string()
  });

export const requestOutputSchema = z.object({
  SystemPurposes: z.string()
});

  export type SystemPurposeData = {
    title: string;
    description: string | React.JSX.Element;
    systemMessage: string;
    symbol: string;
    examples?: string[];
    highlighted?: boolean;
    placeHolder: string;
    chatLLM: string;
    llmRouter: string;
    convoCount: number;
    temperature:number,
    satsPay: number;
    maxToken: number;
    paid: boolean;
    chatruns: number;
    newAgent: string;
  }

  export type requestInputSchema = z.infer<typeof requestInputSchema>;  
  export type requestOutputSchema = z.infer<typeof requestOutputSchema>;  


  export function requestApiAccess(apiPath: string): { headers: HeadersInit, url: string } {
    // API key
   
  
    // API host
    let host = (process.env.GPT4ALL_API_HOST || '').trim();
    
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      url: host + apiPath,
    };
  }