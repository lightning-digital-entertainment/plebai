import { Avatar, Button, CircularProgress, Divider, Select, Switch, Option, Textarea, Typography, Box, IconButton,} from "@mui/joy"
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import { useCallback } from "react";
import { DetailModal } from "~/common/components/DetailModal"
import { theme } from "~/common/theme"
import { useDropzone } from "react-dropzone";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Table from '@mui/joy/Table';


type UploadFile = {
  uploadFile: Blob;
}; 

interface Row {
  id: number;
  type: string;
  data: string;
  status:boolean;
  // other properties for your row can go here
}


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
    const [addRows, setAddRows] = React.useState<Row[]>([]);
    const [currentRow, setCurrentRow] = React.useState<number>(0);
    const [addReqType, setAddReqType] =React.useState('opensource');
    const [addResearch, setAddResearch] = React.useState<boolean>(false);
 

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
        setAddResearch(agentData.iresearch)
        setAddReqType(agentData.reqType)
        setAddRows(agentData.datasource.datasource)
        


    }, [props.agentId]);

    

    React.useEffect(() => {
        console.log(props.agentId);
        if (props.agentId && props.agentId !== 'new') loadAgentData();

    },[loadAgentData, props.agentId])

    const uploadImage = async ({ uploadFile }: UploadFile) => {
      console.log(uploadFile)
      setImageProgress(true);
      if (uploadFile.type) {
  
        let input:any;
        
        const reader = new FileReader()
        
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = async () => {
          input = {input: reader.result,
                   type: uploadFile.name.split(".").pop()
                  
                  }
          console.log(uploadFile.name.split(".").pop())
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
        
          reader.readAsDataURL(uploadFile)
          console.log(input);
      }
  
  
  };

    const uploadFileAsync = async ({ uploadFile }: UploadFile) => {
      console.log(uploadFile)
      if (uploadFile.type) {
  
        let input:any;
        
        const reader = new FileReader()
        
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = async () => {
          input = {input: reader.result,
                   type: uploadFile.name.split(".").pop()
                  
                  }
          console.log(uploadFile.name.split(".").pop())
          const response = await fetch(`/api/data/upload`, {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
              'content-type' : 'application/json'
          },
        });
  
          
  
          if (response) {
            const responseBody = await response.json()
            console.log(responseBody.url);

            if (currentRow !== addRows.length-1) setCurrentRow(addRows.length-1);

            setAddRows(prevRows =>
              prevRows.map(row => 
                  row.data==='' ? { ...row, data:responseBody.url?responseBody.url:'' } : row
              )
            );
  
          }
  
  
          
  
        } 
        
          reader.readAsDataURL(uploadFile)
          console.log(input);
      }
  
  
  };
  
  const handleAddRow = () => {

    let id = 0;

    if (addRows.length > 0) {

      const dataArr = addRows[addRows.length - 1];
      console.log(dataArr);
      
      if (dataArr.data.length === 0) return;
      id = dataArr.id + 1;

    }
    const newRow: Row = {
      
      id, 
      type: 'url',
      data: '',
      status: false
      // Initialize other properties here
    };

    setAddRows([...addRows, newRow]);
    setCurrentRow(addRows.length-1);



  }

  const handleRemoveRow = (id: number) => {
    setAddRows(prevRows => prevRows.filter(row => row.id !== id));
  };

  // Function to update the 'type' of a row
  const handleChangeType = (id: number, event: React.SyntheticEvent | null, newValue: string | null) => {
    
    setAddRows(prevRows =>
      prevRows.map(row => 
        row.id === id ? { ...row, type: newValue?newValue:'' } : row
      )
    );
    
  };

    // Function to update the 'type' of a row
    const handleChangeData = (id: number, newValue: string | null) => {
      setAddRows(prevRows =>
        prevRows.map(row => 
          row.id === id ? { ...row, data: newValue?newValue:'' } : row
        )
      );
      
    };

  
 
  const onDrop1 = useCallback((acceptedFiles: any[]) => {
      // Upload files to storage
      const file = acceptedFiles[0];
      uploadImage({ uploadFile: file });
    }, []);
    
  const onDrop2 = useCallback((acceptedFiles: any[]) => {
      // Upload files to storage
      const file= acceptedFiles[0];

      uploadFileAsync({ uploadFile: file });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

    const { getRootProps: getRootProps1, getInputProps: getInputProps1, isDragActive, open } = useDropzone({
    
        //accept: "image/*",
        maxFiles: 1,
        noClick: false,
        noKeyboard: true,
        onDrop:onDrop1,
    });

    const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
    
      maxFiles: 1,
      noClick: false,
      noKeyboard: true,
      onDrop:onDrop2,
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

      const handleReqType = (
        
        event: React.SyntheticEvent | null,
        newValue: string | null,
      ) => {
        setAddReqType(newValue?newValue:'');
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
              id:props.agentId,
              req_type: addReqType,
              iresearch: addResearch,
              datasource: {
                "datasource": addRows
              }
    
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
                    llmRouter:addllmRouter,
                    reqType: addReqType,
                    iresearch: addResearch,
                    datasource: {
                      "datasource": addRows
                    }
          
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
               

              <div {...getRootProps1()} className="drag_drop_wrapper">
                <input hidden {...getInputProps1()} />

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

               

                <Select indicator={<KeyboardArrowDownIcon />} value={addReqType} onChange={handleReqType}>
                      <Option value="opensource">
                              Default
                      </Option>
                      <Option value="perplexity">
                              Llama2-70B
                      </Option>
                      <Option value="gputopia">
                              GPUtopia
                      </Option>

                </Select>

                <Switch
                    checked={addResearch}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setAddResearch(event.target.checked)
                    }
                    color={addResearch ? 'success' : 'neutral'}
                    variant={addResearch ? 'solid' : 'outlined'}
                    endDecorator={addResearch ? 'Web Browsing enabled ' : 'Web Browsing disabled'}
                    slotProps={{
                      endDecorator: {
                        sx: {
                          minWidth: 24,
                        },
                      },
                    }}
                />

                <Box sx={{
                    mb: 0, // absorb the bottom margin of the list
                    mt: 1,
                    border: 0,
                 
                    display: 'flex', flexDirection: 'row', gap: 1,
                    justifyContent: 'left',alignItems: 'left'
                  }}>
                <Typography sx={{
                    mb: 0, // absorb the bottom margin of the list
                    mt: 1,}}>

                  Add DataSource : 
                </Typography>

                <IconButton
                  variant='outlined' color='neutral'
                  
                  onClick={handleAddRow}>
                  <AddIcon />
                </IconButton>

                </Box>

                <Table  size='md' sx={{ '& thead th:nth-child(1)': { width: '20%' }, display: 'flex',  justifyContent: 'center',alignItems: 'center'}}>
                
                <tbody>
                  {addRows.map((row) => (
                    <tr key={row.id}  >
                      
                      <td>
                          <Select indicator={<KeyboardArrowDownIcon />} value={row.type} disabled= {row.data?true:false} onChange={(e, newValue) => handleChangeType(row.id, e, newValue)}>
                            <Option value="url">
                                    Site url
                            </Option>
                            <Option value="gitbook">
                                    Gitbook
                            </Option>
                            <Option value="docs">
                                    Docs
                            </Option>
                            <Option value="pdf">
                                    PDF
                            </Option>
                            <Option value="json">
                                    JSON
                            </Option>

                          </Select>
                      </td>
                      <td>  

                        {(row.type === 'pdf'|| row.type === 'docs' || row.type === 'json')? 
                        <div className="dropzone">
                            
                    
                        <div  {...getRootProps2()} className="drag_drop_wrapper">
                          <input disabled= {row.status} hidden {...getInputProps2()} />
                          {row.data?<Typography sx={{
                                }}>

                              {row.data.substring(row.data.lastIndexOf(`.`)+1) + ' file uploaded'} 
                            </Typography>: 
                          <Button  sx={{position: 'center'}} variant="solid"  color='neutral' > {'attach a file'} </Button>}

                            </div>
                          </div>
                        :
                        
                      
                        <Textarea variant='outlined' color={'neutral'}
                          autoFocus
                          minRows={1} maxRows={1}
                          placeholder={row.type==='gitbook'?"Enter gitbook URL": "Enter website URL" }
                          value={row.data}
                          onChange={(e) => {handleChangeData(row.id, e.target.value)}}
                          sx={{
                            '&::before': {
                              outline: '0.5px solid var(--Textarea-focusedHighlight)',
                            },
        
                            minWidth : addModalWidthSx,
                            background: theme.vars.palette.background.level2,
                            fontSize: '16px',
                            lineHeight: 1.75,
                          }} />}

                      </td>
                      <td>
                          {row.status? <CheckCircleIcon color='success' />: 
                          <IconButton
                            variant='outlined' color='neutral'
                            
                            onClick={() => handleRemoveRow(row.id)}>
                            <DeleteIcon />
                          </IconButton>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>


              
                        

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

function createData(
  name: string,
  calories: number,

) {
  return { name, calories};
}
