
import { z } from 'zod';

const accessSchema = z.object({
    oaiKey: z.string().trim(),
    oaiOrg: z.string().trim(),
    oaiHost: z.string().trim(),
    heliKey: z.string().trim(),
    moderationCheck: z.boolean(),
  });

type AccessSchema = z.infer<typeof accessSchema>;

export function gpt4allAccess(access: AccessSchema, apiPath: string): { headers: HeadersInit, url: string } {
    // API key
    const oaiKey = access.oaiKey || process.env.OPENAI_API_KEY || '';
  
    // API host
    let oaiHost = process.env.GPT4ALL_API_HOST || 'https://api.openai.com';
    if (!oaiHost.startsWith('http'))
      oaiHost = `https://${oaiHost}`;
    if (oaiHost.endsWith('/') && apiPath.startsWith('/'))
      oaiHost = oaiHost.slice(0, -1);
  
    // Helicone key
    const heliKey = access.heliKey || process.env.HELICONE_API_KEY || '';
  
    return {
      headers: {
        Authorization: `Bearer ${oaiKey}`,
        'Content-Type': 'application/json',
        //'Content-Encoding': 'none',
        ...(heliKey && { 'Helicone-Auth': `Bearer ${heliKey}` }),
      },
      url: oaiHost + apiPath,
    };
  }

