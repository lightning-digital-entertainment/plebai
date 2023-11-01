import { Avatar, Button, CircularProgress, Divider, Select, Switch, Option, Textarea, Typography, Box } from "@mui/joy"
import React from "react";
import { useCallback } from "react";
import { DetailModal } from "~/common/components/DetailModal"
import { theme } from "~/common/theme"
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Link from "next/link";

type Image = {
    imageFile: Blob;
}; 

type Model = {
    model_name: string;
    model_type: string;
};


const detailAvatarSx = { xs: 62, md: 122, xl: 130 };
const addModalWidthSx = { xs: 220, md: 422, xl: 630 };

const usernameRegex = /^[a-zA-Z0-9 ]{4,32}$/;



export function AddImagemodal(props: { agentId: string, open: boolean,  onClose: () => void }) {

    const [addImageUrl, setAddImageUrl] =React.useState('');
    const [imageProgress, setImageProgress] = React.useState(false);
    const [addAgentName, setAddAgentName] =React.useState('');
    const [checked, setChecked] = React.useState<boolean>(false);
    const [addAgentDescription, setAddAgentDescription] =React.useState('');
    const [addAgentPrompt, setAddAgentPrompt] =React.useState('');
    const [addImageHeight, setAddImageheight] = React.useState(1024);
    const [addImageWidth, setAddImageWidth] = React.useState(1024);
    const [addImageSize, setAddImageSize] = React.useState('Square');
    const [addModelId, setAddModelId] = React.useState('epiCPhotoGasm');
    const [addLora, setAddLora] = React.useState('');
    const [addModels, setAddModels] = React.useState<Model[]>([]);
    const [addLoraStrength, setAddLoraStrength] = React.useState('0.5');

    const [addCategory, setAddCatagory] = React.useState('Assistant');
    const [addPrice, setAddPrice] = React.useState<string>('50');
   
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
        console.log(agentData);
        setAddImageUrl(agentData.symbol)
        setAddAgentName(agentData.title)
        setChecked(agentData.private?false:true)
        setAddAgentDescription(agentData.placeHolder)
        setAddCatagory(agentData.category)
        setAddPrice(agentData.satsPay+'')
        setAddLlmRouter(agentData.llmRouter)
        setaddAgentCommissionAddress(agentData.commissionAddress)
        if (parseInt(agentData.image_height) === parseInt(agentData.iamge_width)) setAddImageSize('Square')
        if (parseInt(agentData.image_height) > parseInt(agentData.image_width)) setAddImageSize('Portrait')
        if (parseInt(agentData.image_height) < parseInt(agentData.image_width)) setAddImageSize('Landscape')
        if (agentData.lora) {
            const { value, strength } = parseLoraString(agentData.lora);
            console.log(value,strength);
            setAddLora(value?value:'');
            setAddLoraStrength(strength?strength+'':'0.5');
        }
        setAddModelId(agentData.modelid);


    }, [props.agentId]);

   
    const loadModels = React.useCallback(async () => {

        const response = await fetch('/api/data/getmodels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props.agentId})
        });
    
        const jsonData = await response.json();
        setAddModels(jsonData.getModelData);
    
    }, [props.agentId]);
    

    React.useEffect(() => {
        console.log(props.agentId);
        if (props.agentId && props.agentId !== 'new') loadAgentData();
        
        loadModels();

    },[loadAgentData, loadModels, props.agentId])

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

      
      const handlePrice = (
        event: React.SyntheticEvent | null,
        newValue: string| null,
      ) => {
        setAddPrice(newValue?newValue:'50');
        console.log(`You chose "${newValue}"`);
      };

      const handleModelIdChange = (
        event: React.SyntheticEvent | null,
        newValue: string| null,
      ) => {
        setAddModelId(newValue?newValue:'');
        console.log(`You chose "${newValue}"`);
      };

      const handleLoraChange = (
        event: React.SyntheticEvent | null,
        newValue: string| null,
      ) => {
        setAddLora(newValue?newValue:'');
        console.log(`You chose "${newValue}"`);
      };

      const handleLoraStrength = (
        event: React.SyntheticEvent | null,
        newValue: string| null,
      ) => {
        setAddLoraStrength(newValue?newValue:'');
        console.log(`You chose "${newValue}"`);
      };

      const handleSize = (
        event: React.SyntheticEvent | null,
        newValue: string | null,
      ) => {
        if (newValue === 'Portrait') {setAddImageheight(1024); setAddImageWidth(768)}
        if (newValue === 'Landscape') {setAddImageheight(768); setAddImageWidth(1024)}
        setAddImageSize(newValue?newValue:'');
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
                updatedby: appFingerPrint,
                commissionaddress: addAgentCommissionAddress,
                paid: true,
                convoCount: 0,
                satsPay: parseInt(addPrice),
                category: 'Image Generation',
                llmRouter:addModelId,
                genimage:true,
                modelid: addModelId,
                image_width: addImageWidth,
                image_height: addImageHeight,
                lora: (addLora?'<lora:'+addLora+':'+addLoraStrength+'>':' '),
                id:props.agentId,
                req_type:'randomseed'
      
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
            

          
        }
    
        else  {

          if (addAgentName === '' || !addAgentName.match(usernameRegex) || addImageUrl.length < 2 || addAgentName.length < 5 || countWordsInString(addAgentDescription) < 25 )
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
                    paid: true,
                    convoCount: 0,
                    satsPay: addPrice,
                    llmRouter:addllmRouter,
                    genimage:true,
                    modelid: addModelId,
                    category: 'Image Generation',
                    image_width: addImageWidth,
                    image_height: addImageHeight,
                    lora: (addLora?'<lora:'+addLora+':'+addLoraStrength+'>':' '),
                    reqType:'randomseed'
          
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
                placeholder={"Description (Image generation to the next level with simple prompts such as superman, readhead woman, and get realistic images. Elevate image generation with simple prompts like superman, readhead woman, and more.) ..min 25 words"}
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
                        minRows={1} maxRows={10}
                        placeholder={"System Prompt: Optional data such as sunny and beach"}
                        value={addAgentPrompt}
                        onChange={(e) => setAddAgentPrompt(e.target.value)}
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

                  Size: 
                </Typography>

                <Select value={addImageSize} onChange={handleSize}>
                            <Option value="Square">
                                    Square
                            </Option>
                            <Option value="Portrait">
                                    Portrait
                            </Option>
                            <Option value="Landscape">
                                    Landscape
                            </Option>
                </Select>
                </Box>

                <Box sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,
                    
                 
                    display: 'flex', flexDirection: 'row', gap: 1,
                    justifyContent: 'left',alignItems: 'left'
                  }}>
                <Typography sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,}}>

                  Model: 
                </Typography>
                <Select placeholder="Pick a Model..." value={addModelId} onChange={handleModelIdChange} sx={{ minWidth: 140 }}>
                    {addModels && addModels.map((model: Model) => (
                       model.model_type==='Checkpoint' && <Option key={model.model_name} value={model.model_name}>
                            {model.model_name}
                        </Option>
                    ))}
                </Select>
                   
                </Box>

                <Box sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,
                    
                 
                    display: 'flex', flexDirection: 'row', gap: 1,
                    justifyContent: 'left',alignItems: 'left'
                  }}>
                <Typography sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,}}>

                  Lora: 
                </Typography>

                <Select placeholder="Pick a Lora..." value={addLora} onChange={handleLoraChange} sx={{ minWidth: 140 }}>
                    {addModels && addModels.map((model: Model) => (
                       model.model_type==='Lora' && <Option key={model.model_name} value={model.model_name}>
                            {model.model_name}
                        </Option>
                    ))}
                </Select>

                <Typography sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,}}>

                  Strength: 
                </Typography>

                <Select value={addLoraStrength} onChange={handleLoraStrength}>
                            <Option value="0.5">
                                    0.5
                            </Option>
                            <Option value="0.7">
                                    0.6
                            </Option>
                            <Option value="0.7">
                                    0.7
                            </Option>
                            <Option value="0.8">
                                    0.8
                            </Option>
                            <Option value="1.0">
                                   1.0
                            </Option>
                        </Select>


                </Box>
              
                        

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
              <Select value={addPrice} onChange={handlePrice}>
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

                  SATS per Image
                </Typography>   


              </Box>

              {errorAlert && < Typography level='body-sm' color='danger' sx={{
                       
                      }} >
                      Agent Name should be unique without special characters. Description and System prompt should have minimum 25 words. Please complete all inputs. 
              </Typography>}

              <Button onClick={handleCreateAgent} sx={{position: 'center'}} variant="solid"  color='neutral' > {props.agentId==='new'? 'Create Agent':'Update'} </Button>

              <Typography level='body-sm' color='neutral' sx={{
                       
                      }} >
                      For more info on Models & Lora, please go to <Link href={"https://civitai.com"}> Civitai.com </Link>
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

  interface LoraData {
    value: string | null;
    strength: number | null;
  }
  
  function parseLoraString(input: string): LoraData {
    const pattern = /<lora:([\w-]+):([\d.]+)>/;
    const match = input.match(pattern);
  
    if (match) {
        return {
          value: match[1],
          strength: parseFloat(match[2]),
        };
    } else {
      return {
        value: null,
        strength: 0,
      };
    }
  }