import { Avatar, Button, CircularProgress, Divider, Select, Switch, Option, Textarea, Typography, Box } from "@mui/joy"
import React from "react";
import { useCallback } from "react";
import { DetailModal } from "~/common/components/DetailModal"
import { theme } from "~/common/theme"
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type Image = {
  imageFile: Blob;
}; 


const detailAvatarSx = { xs: 62, md: 122, xl: 130 };
const addModalWidthSx = { xs: 220, md: 422, xl: 630 };

const usernameRegex = /^[a-zA-Z0-9 ]{4,32}$/;

export function AddTextmodal(props: { agentId: string, open: boolean,  onClose: () => void }) {

    const [addImageUrl, setAddImageUrl] =React.useState('');
    const [imageProgress, setImageProgress] = React.useState(false);
    const [addAgentName, setAddAgentName] =React.useState('');
    const [checked, setChecked] = React.useState<boolean>(false);
    const [addAgentDescription, setAddAgentDescription] =React.useState('');
    const [addAgentPrompt, setAddAgentPrompt] =React.useState('');
    const [addCategory, setAddCatagory] = React.useState('Assistant');
    const [addPrice, setAddPrice] = React.useState<string>('50');
    const [addConvoCount, setAddConvoCount] = React.useState<string>('3');
    const [addllmRouter, setAddLlmRouter] = React.useState('meta-llama/llama-2-13b-chat');

    const [addAgentCommissionAddress, setaddAgentCommissionAddress] =React.useState('');
    const [errorAlert, setErrorAlert] = React.useState(false);

    const appFingerPrint = localStorage.getItem('appFingerPrint');

    const loadAgentData = React.useCallback(async () => {
      
        const response = await fetch('/api/data/getagent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props.agentId})
        });
        const jsonData = await response.json();
        const agentData = jsonData.SystemPurposes[props.agentId];
        console.log('agentData: ', agentData);
        setAddImageUrl(agentData.symbol)
        setAddAgentName(agentData.title)
        setChecked(agentData.private?false:true)
        setAddAgentDescription(agentData.placeHolder)
        setAddAgentPrompt(agentData.systemMessage)
        setAddCatagory(agentData.category)
        setAddPrice(agentData.satsPay+'')
        setAddConvoCount(agentData.convoCount+'')
        setAddLlmRouter(agentData.llmRouter)
        setaddAgentCommissionAddress(agentData.commissionAddress)

    }, [props.agentId]);

    

    React.useEffect(() => {
        console.log(props.agentId);
        if (props.agentId && props.agentId !== 'new') loadAgentData();

    },[loadAgentData, props.agentId])

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
        noClick: false,
        noKeyboard: true,
        onDrop,
      });

      const handleCategory = (
        
        event: React.SyntheticEvent | null,
        newValue: string | null,
      ) => {
        setAddCatagory(newValue?newValue:'');
        console.log(`You chose "${newValue}"`);
        if (newValue ==='Role Play')setAddLlmRouter('undi95/remm-slerp-l2-13b');
        if (newValue ==='Technical')setAddLlmRouter('meta-llama/codellama-34b-instruct');
        if (newValue ==='Assistant')setAddLlmRouter('meta-llama/llama-2-13b-chat');

        console.log(addCategory);
        console.log('llmrouter: ', addllmRouter);
      };

      const handlePrice = (
        event: React.SyntheticEvent | null,
        newValue: string | null,
      ) => {
        if (event) setAddPrice(newValue?newValue:'50');
        console.log(`You chose price "${newValue}"`);
      };

      const handleConvocount = (
        event: React.SyntheticEvent | null,
        newValue: string | null,
      ) => {
        setAddConvoCount(newValue?newValue:'3');
        console.log(`You chose "${newValue}"`);
      };

      const handleAddAgent = async (name: string) => {

        if (name.length >= 5 && !name.match(usernameRegex)) {

          const response = await fetch('/api/data/agentName', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentName: name})
          });
  
          const jsonData = await response.json();
          console.log(jsonData);
  
          if (!jsonData?.status) {
                setAddAgentName(name);
                setErrorAlert(false);
          } else {
                setErrorAlert(true);
  
          }


        } else {
          setAddAgentName(name);

        }
        



      }


      const handleCreateAgent = async () => {

        

        if (props.agentId !== 'new') {
            const agentDetails = {
              title: addAgentName,
              description: addAgentDescription,
              systemmessage: addAgentPrompt,
              symbol: addImageUrl,         
              placeholder: addAgentDescription,
              chatllm: 'llama-2-7b-chat-hf',
              private: checked?false:true,
              status: 'active',
              createdby: appFingerPrint ,
              updatedby: appFingerPrint,
              commissionaddress: addAgentCommissionAddress,
              paid: false,
              convocount: parseInt(addConvoCount),
              satspay: parseInt(addPrice),
              category: addCategory,
              llmrouter:addllmRouter,
              id:props.agentId
    
            }
        

            const result = await fetch('/api/data/agent-update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(agentDetails)
            })
    
            props.onClose();
            
    
            setAddImageUrl('');
            setAddAgentName('');
            setChecked(false);
            setAddAgentDescription('');
            setAddAgentPrompt('');

          
        }
    
        else  {

          if (addAgentName === '' || !addAgentName.match(usernameRegex) || addImageUrl.length < 2 || addAgentName.length < 5 || countWordsInString(addAgentDescription) < 25 || 
                countWordsInString(addAgentPrompt) <25 || addCategory === '' )
                {
                  setErrorAlert(true) 
          
                } else {
                  setErrorAlert(false);

                  const agentDetails = {
                    title: addAgentName,
                    description: addAgentDescription,
                    systemMessage: addAgentPrompt,
                    symbol: addImageUrl,         
                    placeHolder: addAgentDescription,
                    chatLLM: 'llama-2-7b-chat-hf',
                    private: checked?false:true,
                    status: 'active',
                    createdBy: appFingerPrint ,
                    updatedBy: appFingerPrint,
                    commissionAddress: addAgentCommissionAddress,
                    paid: false,
                    convoCount: addConvoCount,
                    satsPay: addPrice,
                    category: addCategory,
                    llmRouter:addllmRouter
          
                  }
                
                  console.log('creating agent...');
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
        
        
        
  
        
  
    }  

    return (
        <DetailModal title={props.agentId==='new'?'Create New Agent':'Update Agent'} open={props.open} onClose={props.onClose}><Divider />
    
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


                <Select indicator={<KeyboardArrowDownIcon />} value={addCategory} onChange={handleCategory}>
                      <Option value="Assistant">
                              Assistant
                      </Option>
                      <Option value="Role Play">
                              Role Play
                      </Option>
                      <Option value="Technical">
                              Technical
                      </Option>

                </Select>

              <Textarea variant='outlined' color={'neutral'}
                autoFocus
                minRows={1} maxRows={1}
                placeholder={"Name (Agent Smith) ..max 15 chars"}
                value={addAgentName}
                onChange={(e) => {e.target.value.length<16?handleAddAgent(e.target.value):''}}
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
                        

              <Box sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,
                    
                 
                    display: 'flex', flexDirection: 'row', gap: 1,
                    justifyContent: 'left',alignItems: 'left'
                  }}>
                <Typography sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,}}>

                  Price: 
                </Typography>
              <Select indicator={<KeyboardArrowDownIcon />} value={addPrice} onChange={handlePrice}>
                      <Option value="50">
                              50
                      </Option>
                      <Option value="60">
                              60
                      </Option>
                      <Option value="70">
                              70
                      </Option>
                      <Option value="100">
                              100
                      </Option>
                </Select>
                <Typography sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,}}>

                  SATS per
                </Typography>   

                <Select indicator={<KeyboardArrowDownIcon />} value={addConvoCount} onChange={handleConvocount}>
                    <Option value="3">
                             3
                      </Option>
                      <Option value="4">
                             4
                      </Option>
                      <Option value="5">
                              5
                      </Option>
                      <Option value="6">
                              6
                      </Option>
                </Select>
                <Typography sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,}}>

                  Conversations
                </Typography>   

              </Box>

              {errorAlert && < Typography level='body-sm' color='danger' sx={{
                       
                      }} >
                      Agent Name should be unique without special characters. Description and System prompt should have minimum 25 words. Please complete all inputs. 
              </Typography>}

              <Button onClick={handleCreateAgent} sx={{position: 'center'}} variant="solid"  color='neutral' > {props.agentId==='new'? 'Create Agent':'Update'} </Button>

              <Typography level='body-sm' color='neutral' sx={{
                       
                      }} >
                      * All fields are mandatory except lightning address
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
