import React from "react";
import { DetailModal } from "~/common/components/DetailModal";
import { responsePromptSchema, ResponsePromptData } from "~/modules/data/request.router";
import { Avatar, Badge, Box, Button,CircularProgress, Grid, Typography } from "@mui/joy";
import CardMedia  from '@mui/material/CardMedia';
import Image from 'next/image';
import { useComposerStore } from "../composer/store-composer";

const tileSpacing = 2;
const tileHSx = { xs: 42, md: 126, xl: 156 };
const tileWSx = { xs: 28, md: 92, xl: 120 };
const limit=12;

export function SamplePrompts(props: { agentId: string, open: boolean, total: number, genImage:boolean, onClose: () => void }) {

    
    const responsePromptData:ResponsePromptData[] = [];
    const [isLoading, setLoading] = React.useState(false);
    const [offsetCount, setOffsetCount] = React.useState(0);
    const [loadPromptData, setLoadPromptData] = React.useState(responsePromptData);
    const { setStartupText } = useComposerStore();

    const handleNext  = () => {

        promptData(limit,offsetCount, true)

    }

    const handlePrevious  = () => {

        promptData(limit,offsetCount, false)

    }

    const handlePickPrompt = (prompt: string) => {
        props.onClose();
        setStartupText(prompt);
        
    }

    const promptData = React.useCallback(async (limit:number, offset:number, next:boolean) => {

        setLoading(true);

        offset<=0?offset=0:'';

       

        const response = await fetch('/api/data/prompts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props.agentId, limit, offset})
          });

        const jsonData = await response.json();
        console.log(jsonData);

        setLoadPromptData(jsonData);
        
        setLoading(false);

        next?setOffsetCount(offsetCount + limit):setOffsetCount(offsetCount - limit);
       

    }, [offsetCount, props.agentId]);



    React.useEffect(() => {
        if (offsetCount === 0) {
          promptData(limit,offsetCount, true)
        }
        
    },[loadPromptData, offsetCount, promptData]);

      
        
return (


    <DetailModal title='Sample Prompts' open={props.open} onClose={props.onClose}>
            {isLoading? (<CircularProgress />):

            <Box sx={{ mb: -1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',  gap: 2, mt:4 }}>
        

                <Grid container spacing={tileSpacing} rowSpacing={2} sx={{ justifyContent: 'center' }}>

                    {loadPromptData.map((promptId) => (

                  
                    
                   
                    (promptId.response?.endsWith(".mp4")?

                        <Grid key={promptId.message_id} spacing={0.5}>     

                            <Button onClick={() => handlePickPrompt(promptId.user_message)} sx={{position: 'center'}} variant="soft"  color='neutral'>

                            <CardMedia 

                                        component="video"    
                                        height="128"
                                        image={promptId.response} 
                                        sx={{ width: tileWSx, height: tileHSx}}
                                        muted
                                        autoPlay
                                        controls
                                        />                    
                                     
                           
                        
                                
                                
                            </Button>

                            
                        </Grid>:

                        (promptId.response?.startsWith("https:")? 
                                            
                        <Grid key={promptId.message_id} spacing={0.5}>     

                                <Button onClick={() => handlePickPrompt(promptId.user_message)} sx={{position: 'center'}} variant="soft"  color='neutral'>

                                
                                


                                 <CardMedia alt=""

                                    component="img"
                                    height="128"
                                    src={promptId.response} 
                                    sx={{ width: tileWSx, height: tileHSx  }}/>

                                </Button>

                                
                        </Grid>:
                         
                        (!props.genImage && <Button onClick={() => handlePickPrompt(promptId.user_message)} sx={{position: 'center', mb: 1, ml:1}} variant="soft"  color='neutral'>{promptId.user_message} </Button>))
                
                    
                        )
                       
                        
                        
                    ))}

               

                </Grid>

                <Box sx={{ mb: -1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between',  gap: 2, mt:4 }}>
                            <Button disabled={offsetCount<=12}  onClick={handlePrevious} sx={{ mr: -1}} variant="soft"  color='primary'> {'<'} </Button>
                            <Typography level='body-sm' color='neutral' sx={{
                                            mt: 2,
                                            alignItems: 'left', gap: 1,
                                            justifyContent: 'left',
                                            '&:hover > button': { opacity: 1 },
                                            }} >

                                {"Click to use prompt.  "}
                            </Typography>
                            <Button disabled={offsetCount>=props.total} onClick={handleNext} sx={{ mr: -1}} variant="soft"  color='primary'> {'>'} </Button>

                </Box>

           

            </Box>

            }

        
    </DetailModal>



)

};