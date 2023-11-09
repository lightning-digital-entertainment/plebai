
import { z } from 'zod';

export const requestInputSchema = z.object({
    fingerPrint: z.string()
  });

export const requestPromptSchema = z.object({
    id: z.string(),
    limit: z.number(),
    offset: z.number()

});  

export const responsePromptSchema = z.object({
  message_id: z.string(),
  agent_type: z.string(),
  user_message: z.string(),
  response: z.string()

}); 

export type ResponsePromptData = {

  message_id: string;
  agent_type: string;
  user_message:string;
  response: string;

}

export type Image = {
  imageFile: Blob;
}; 

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
    nip05:string;
    category:string;
    createdBy:string;
    commissionAddress:string;
    restricted:boolean
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

  export const uploadImage = async ({ imageFile }: Image):Promise<string> => {
    console.log(imageFile)
    if (imageFile.type === 'image/png' || imageFile.type === 'image/jpg' || imageFile.type === 'image/jpeg') {

      let input:any;
      
      const reader = new FileReader()
      
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async () => {
        input = {input: reader.result,
                 type: imageFile.name.split(".").pop()
                
                }
        console.log(imageFile.name.split(".").pop())
        const response = await fetch(`/api/data/upload`, {
          method: 'POST',
          body: JSON.stringify(input),
          headers: {
            'content-type' : 'application/json'
        },
      });

        

        if (response) {
          const responseBody = await response.json()
          return responseBody.url;

        }

      
        

      } 
      

      reader.readAsDataURL(imageFile)
      console.log(input);
      
    }

    return '';
};