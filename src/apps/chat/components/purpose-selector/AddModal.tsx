import { Avatar, Button, CircularProgress, Divider, Switch, Textarea, Typography } from "@mui/joy"
import React from "react";
import { useCallback } from "react";
import { DetailModal } from "~/common/components/DetailModal"
import { theme } from "~/common/theme"
import { useDropzone } from "react-dropzone";
import Image from "next/image";

type Image = {
    imageFile: Blob;
}; 


const detailAvatarSx = { xs: 62, md: 122, xl: 130 };
const addModalWidthSx = { xs: 220, md: 422, xl: 630 };

export function Addmodal(props: { agentId: string, open: boolean,  onClose: () => void }) {

    const [addImageUrl, setAddImageUrl] =React.useState('');
    const [imageProgress, setImageProgress] = React.useState(false);
    const [addAgentName, setAddAgentName] =React.useState('');
    const [checked, setChecked] = React.useState<boolean>(false);
    const [addAgentDescription, setAddAgentDescription] =React.useState('');
    const [addAgentPrompt, setAddAgentPrompt] =React.useState('');

    const [addAgentCommissionAddress, setaddAgentCommissionAddress] =React.useState('');
    const [errorAlert, setErrorAlert] = React.useState(false);

    const appFingerPrint = localStorage.getItem('appFingerPrint');

    const uploadImage = async ({ imageFile }: Image) => {
        console.log(imageFile)
        setImageProgress(true);
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
              setAddImageUrl(responseBody.url);
              setImageProgress(false);
    
            }
    
    
            
    
          } 
          
            reader.readAsDataURL(imageFile)
            console.log(input);
        }
    
    
    };
    

    const onDrop = useCallback((acceptedFiles: any[]) => {
        // Upload files to storage
        const file = acceptedFiles[0];
        uploadImage({ imageFile: file });
      }, []);
    

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    
        //accept: "image/*",
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
        onDrop,
      });


      const handleCreateAgent = async () => {
    
        if (addImageUrl.length < 2 || addAgentName.length < 5 || countWordsInString(addAgentDescription) < 25 || 
        countWordsInString(addAgentPrompt) <25 )
        {
          setErrorAlert(true) 
  
        } else {
          setErrorAlert(false) 
          //setAgentUpdate(Math.floor(Date.now() / 1000));
          const agentDetails = {
            title: addAgentName,
            description: addAgentDescription,
            systemMessage: addAgentPrompt,
            symbol: addImageUrl,
           
            placeHolder: addAgentDescription,
            chatLLM: "llama-2-7b-chat-hf",
            private: checked?false:true,
            status: 'active',
            createdBy: appFingerPrint ,
            updatedBy: appFingerPrint,
            commissionAddress: addAgentCommissionAddress
          }
  
          console.log(agentDetails);
  
          const idData = (appFingerPrint ? appFingerPrint : '') + Math.floor(Date.now() / 1000).toString();
  
  
          const result = await fetch('/api/data/agent-create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({[idData]: agentDetails})
          })
  
          const jsonResult = await result.json();
  
          console.log(jsonResult.result);
          
          props.onClose();
          
  
          setAddImageUrl('');
          setAddAgentName('');
          setChecked(false);
          setAddAgentDescription('');
          setAddAgentPrompt('');

          
          
          
        }
        
  
        
  
    }  

    return (
        <DetailModal title={'Create New Agent'} open={props.open} onClose={props.onClose}><Divider />
    
          <div className="dropzone">
               

              <div {...getRootProps()} className="drag_drop_wrapper">
                <input hidden {...getInputProps()} />

                {imageProgress? <CircularProgress variant="solid" />:
    
                <Avatar  alt=""
                        src={addImageUrl?addImageUrl:'/icons/drag-and-drop2.png'} 
                        sx={{ width: detailAvatarSx, height: detailAvatarSx, mt: 1, }}></Avatar>}

       
                
              </div>
          </div>     

              <Switch
                    checked={checked}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setChecked(event.target.checked)
                    }
                    color={checked ? 'success' : 'neutral'}
                    variant={checked ? 'solid' : 'outlined'}
                    endDecorator={checked ? 'Public (Anyone can use) ' : 'Private (Only you can use)'}
                    slotProps={{
                      endDecorator: {
                        sx: {
                          minWidth: 24,
                        },
                      },
                    }}
                />
                 

              <Textarea variant='outlined' color={'neutral'}
                autoFocus
                minRows={1} maxRows={1}
                placeholder={"Name (Agent Smith) ..max 15 chars"}
                value={addAgentName}
                onChange={(e) => {e.target.value.length<16?setAddAgentName(e.target.value):''}}
                sx={{
                  '&::before': {
                    outline: '0.5px solid var(--Textarea-focusedHighlight)',
                  },
                  mt: 2,
                  minWidth : addModalWidthSx,
                  background: theme.vars.palette.background.level2,
                  fontSize: '16px',
                  lineHeight: 1.75,
                }} >

                        

              </Textarea>

            

              <Textarea variant='outlined' color={'neutral'}
                autoFocus
                minRows={3} maxRows={10}
                placeholder={"Description (Agent Smith is a travel agent who expertly guides users to the best travel destinations tailored to their preferences.) ..min 25 words"}
                value={addAgentDescription}
                onChange={(e) => setAddAgentDescription(e.target.value)}
                sx={{
                  '&::before': {
                    outline: '0.5px solid var(--Textarea-focusedHighlight)',
                  },
                  mt: 0.5,
                  minWidth : addModalWidthSx,
                  background: theme.vars.palette.background.level2,
                  fontSize: '16px',
                  lineHeight: 1.75,
                }} >

                        

              </Textarea>

              <Textarea variant='outlined' color={'neutral'}
                autoFocus
                minRows={3} maxRows={10}
                placeholder={"System Prompt (Hello traveler! I'm Agent Smith, your virtual travel assistant. Share your travel desires, and I'll craft the ideal journey for you. Where do you wish to explore next?) ..min 25 words"}
                value={addAgentPrompt}
                onChange={(e) => setAddAgentPrompt(e.target.value)}
                sx={{
                  '&::before': {
                    outline: '0.5px solid var(--Textarea-focusedHighlight)',
                  },
                  mt: 0.5,
                  minWidth : addModalWidthSx,
                  background: theme.vars.palette.background.level2,
                  fontSize: '16px',
                  lineHeight: 1.75,
                }} >

                        

              </Textarea>

             
                <Textarea variant='outlined' color={'neutral'}
                        autoFocus
                        minRows={1} maxRows={10}
                        placeholder={"Input lightning address for 10% commission split. ..john@getalby.com"}
                        value={addAgentCommissionAddress}
                        onChange={(e) => setaddAgentCommissionAddress(e.target.value)}
                        sx={{
                          '&::before': {
                            outline: '0.5px solid var(--Textarea-focusedHighlight)',
                          },
                        
                          minWidth : addModalWidthSx,
                          background: theme.vars.palette.background.level2,
                          fontSize: '16px',
                          lineHeight: 1.75,
                        }} >
                  </Textarea>
                        

           

              {errorAlert && < Typography level='body2' color='danger' sx={{
                       
                      }} >
                      Description and System prompt should have minimum 25 words. Starter prompts should have 10 words each. Please complete all inputs. 
              </Typography>}

              <Button onClick={handleCreateAgent} sx={{position: 'center'}} variant="outlined"  color='neutral' >  Create Agent</Button>

              <Typography level='body2' color='neutral' sx={{
                       
                      }} >
                      * All fields are mandatory
              </Typography>

             
    
    
    </DetailModal>



    )

}

function countWordsInString(content: string): number {
    // Read the file content
  
    // Split content by spaces and filter out non-words
    const words = content.split(/\s+/).filter(word => /\S/.test(word));
  
    return words.length;
  }
