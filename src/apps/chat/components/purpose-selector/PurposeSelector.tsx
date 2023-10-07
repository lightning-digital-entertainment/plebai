import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Avatar, Box, Button, Option, Checkbox, Divider, Grid, IconButton, Input, Select, Stack, Switch, Textarea, Typography, useTheme, Alert, CircularProgress, Badge } from '@mui/joy';
import ClearIcon from '@mui/icons-material/Clear';
import ForumIcon from '@mui/icons-material/Forum';
import StarRateIcon from '@mui/icons-material/StarRate';
import SearchIcon from '@mui/icons-material/Search';
import Image from "next/image";
import { useChatStore } from '~/common/state/store-chats';
import { useUIPreferencesStore } from '~/common/state/store-ui';

import { SystemPurposeId, SystemPurposes } from '../../../../apps/chat/components/composer/Composer';
import { useModelsStore } from '~/modules/llms/store-llms';
import { usePurposeStore } from './store-purposes';
import { WelcomeModal } from '~/common/components/WelcomeModal';
import { useUIStateStore } from '~/common/state/store-ui';
import { DetailModal } from '~/common/components/DetailModal';
import AddIcon from '@mui/icons-material/Add';
import { useDropzone } from "react-dropzone";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useCallback } from 'react';

// Constants for tile sizes / grid width - breakpoints need to be computed here to work around
// the "flex box cannot shrink over wrapped content" issue
//
// Absolutely dislike this workaround, but it's the only way I found to make it work

const bpTileSize = { xs: 128, md: 180, xl: 180 };
const tileCols = [3, 5, 6];
const tileSpacing = 2;
const tileSx = { xs: 42, md: 96, xl: 96 };
const detailAvatarSx = { xs: 62, md: 122, xl: 130 };
const searchWidthSx = { xs: 220, md: 422, xl: 630 };
const addModalWidthSx = { xs: 220, md: 422, xl: 630 };
const bpMaxWidth = Object.entries(bpTileSize).reduce((acc, [key, value], index) => {
  acc[key] = tileCols[index] * (value + 8 * tileSpacing) - 8 * tileSpacing;
  return acc;
}, {} as Record<string, number>);
const bpTileGap = { xs: 2, md: 3 };




// Add this utility function to get a random array element
const getRandomElement = <T, >(array: T[]): T | undefined =>
  array.length > 0 ? array[Math.floor(Math.random() * array.length)] : undefined;

type Image = {
    imageFile: Blob;
};  


/**
 * Purpose selector for the current chat. Clicking on any item activates it for the current chat.
 */
export function PurposeSelector(props: { conversationId: string, runExample: (example: string) => void }) {
  // state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredIDs, setFilteredIDs] = React.useState<SystemPurposeId[] | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [detailModal, setDetailModal] = React.useState(false);
  const [addModal, setaddModal] = React.useState(false);
  const [updateRefresh, setUpdaterefresh] = React.useState(true);
  const [addImageUrl, setAddImageUrl] =React.useState('');
  const [imageProgress, setImageProgress] = React.useState(false);
  const [addAgentName, setAddAgentName] =React.useState('');
  const [checked, setChecked] = React.useState<boolean>(false);
  const [addAgentDescription, setAddAgentDescription] =React.useState('');
  const [addAgentPrompt, setAddAgentPrompt] =React.useState('');
  const [addAgentStarterPrompt1, setAddAgentStarterPrompt1] =React.useState('');
  const [addAgentStarterPrompt2, setAddAgentStarterPrompt2] =React.useState('');
  const [addAgentStarterPrompt3, setAddAgentStarterPrompt3] =React.useState('');
  const [errorAlert, setErrorAlert] = React.useState(false);

  const { setChatLLMId } = useModelsStore(state => ({
    setChatLLMId: state.setChatLLMId,
  }), shallow);

  console.log('System purposes: ', Object.keys(SystemPurposes).length);

  const appFingerPrint = localStorage.getItem('appFingerPrint');
  const {agentUpdate, setAgentUpdate} = useUIPreferencesStore(state => ({agentUpdate: state.agentUpdate, setAgentUpdate: state.setAgentUpdate,}));
  

  React.useEffect(() => {
    if (updateRefresh || Object.keys(SystemPurposes).length<2) {
    
      setAgentUpdate(Math.floor(Date.now() / 1000))
      setUpdaterefresh(false)
    }
  }, [updateRefresh, setAgentUpdate]); 


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

  // external state
  const theme = useTheme();
  //const showPurposeFinder = useUIPreferencesStore(state => state.showPurposeFinder);
  const showPurposeFinder = true;
  const { systemPurposeId, setSystemPurposeId } = useChatStore(state => {
    const conversation = state.conversations.find(conversation => conversation.id === props.conversationId);
    return {
      systemPurposeId: conversation ? conversation.systemPurposeId : null,
      setSystemPurposeId: conversation ? state.setSystemPurposeId : null,
    };
  }, shallow);
  const { hiddenPurposeIDs, toggleHiddenPurposeId } = usePurposeStore(state => ({ hiddenPurposeIDs: state.hiddenPurposeIDs, toggleHiddenPurposeId: state.toggleHiddenPurposeId }), shallow);
  const {  openModelsSetup, closeModelsSetup} = useUIStateStore();
  
  // safety check - shouldn't happen
  if (!systemPurposeId || !setSystemPurposeId)
    return null;



  const handleSearchClear = () => {
    setSearchQuery('');
    setFilteredIDs(null);
  };

  

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

  const executeFilter = (data:string) => {
    const query = data;
    if (!query)
      return handleSearchClear();
    setSearchQuery(query);

    // Filter results based on search term
    const ids = Object.keys(SystemPurposes)
      .filter(key => SystemPurposes.hasOwnProperty(key))
      .filter(key => {
        const purpose = SystemPurposes[key as SystemPurposeId];
        return purpose.title.toLowerCase().includes(query.toLowerCase())
          || (typeof purpose.placeHolder === 'string' && purpose.placeHolder.toLowerCase().includes(query.toLowerCase()));
      });
    setFilteredIDs(ids as SystemPurposeId[]);

    console.log("fileter: ", filteredIDs)



  }

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    executeFilter(e.target.value);
  };

  const handleTagsImageOnChange = () => {
    executeFilter('image');
  };

  const handleTagsRolePlayOnChange = () => {
    executeFilter('RolePlay');
  };
  const handleTagsTechnicalOnChange = () => {
    executeFilter('technical');
  };
  const handleTagsAssistantOnChange = () => {
    executeFilter('assistant');
  };

  const handleSearchOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Escape')
      handleSearchClear();
  };

  const handleCreateAgent = async () => {
    
      if (addImageUrl.length < 2 || addAgentName.length < 5 || countWordsInString(addAgentDescription) < 25 || 
      countWordsInString(addAgentPrompt) <25 || countWordsInString(addAgentStarterPrompt1) < 10 ||
       countWordsInString(addAgentStarterPrompt2) <10 || countWordsInString(addAgentStarterPrompt3) <10)
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
          examples: [addAgentStarterPrompt1, addAgentStarterPrompt2, addAgentStarterPrompt3],
          placeHolder: addAgentDescription,
          chatLLM: "llama-2-7b-chat-hf",
          private: checked?false:true,
          status: 'active',
          createdBy: appFingerPrint ,
          updatedBy: appFingerPrint 
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

        setUpdaterefresh(true);

        setAddImageUrl('');
        setAddAgentName('');
        setChecked(false);
        setAddAgentDescription('');
        setAddAgentPrompt('');
        setAddAgentStarterPrompt1('');
        setAddAgentStarterPrompt2('');
        setAddAgentStarterPrompt3('');

        do {} while (agentUpdate != 0);

        setaddModal(false);
        
      }
      

      

  }


  const toggleEditMode = () => setEditMode(!editMode);

  const handlePurposeChanged = (purposeId: SystemPurposeId | null) => {
    if (purposeId) {
      setSystemPurposeId(props.conversationId, purposeId);
      console.log(SystemPurposes[purposeId as SystemPurposeId].chatLLM)
      setChatLLMId(SystemPurposes[purposeId as SystemPurposeId].chatLLM)
      setDetailModal(true);

    }  
  };

  const onDetailClose = () => {setDetailModal(false)};
  const onAddClose = () => {setaddModal(false); setErrorAlert(false)};
  const onAddOpen = () => {setaddModal(true)};
  const onStartupModalClose = () => {if (Object.keys(SystemPurposes).length<2) setUpdaterefresh(true); }


  const handleCustomSystemMessageChange = (v: React.ChangeEvent<HTMLTextAreaElement>): void => {
    // TODO: persist this change? Right now it's reset every time.
    //       maybe we shall have a "save" button just save on a state to persist between sessions
    // SystemPurposes['Custom'].systemMessage = v.target.value;
  };

  function truncateStringWithDots(input: string): string {
    const maxLength = 70;
    if (input.length > maxLength) {
      return input.slice(0, maxLength - 3) + '...';
    }
    return input;
  }


  // we show them all if the filter is clear (null)
  const unfilteredPurposeIDs = (filteredIDs && showPurposeFinder) ? filteredIDs : Object.keys(SystemPurposes);
  const purposeIDs = editMode ? unfilteredPurposeIDs : unfilteredPurposeIDs.filter(id => !hiddenPurposeIDs.includes(id));

  const selectedPurpose = purposeIDs.length ? (SystemPurposes[systemPurposeId] ?? null) : null;
  const selectedExample = selectedPurpose?.examples && getRandomElement(selectedPurpose.examples) || null;

  return <>

    {Object.keys(SystemPurposes).length<2? <WelcomeModal title={<>Welcome to  <b>PlebAI</b> <br></br></>} open={true} onClose={onStartupModalClose} ><Divider /></WelcomeModal>:''}
    {detailModal? <DetailModal title={SystemPurposes[systemPurposeId as SystemPurposeId]?.title} open={detailModal} onClose={onDetailClose}>
      
       <Divider />
    
       <Avatar  alt=""
                        src={SystemPurposes[systemPurposeId as SystemPurposeId]?.symbol} 
                        sx={{ width: detailAvatarSx, height: detailAvatarSx, mt: 1, }}/>

      <Typography level='body1' color='neutral' sx={{
              mt: 0,
            }} >
        {selectedPurpose? <div style={{ fontSize: '1rem' }}>  LLM Type:  {selectedPurpose.llmRouter}  </div> : ''}
        {selectedPurpose? <div style={{ fontSize: '1rem' }}>  Price: {selectedPurpose.paid?selectedPurpose.satsPay + ' SATS':  selectedPurpose.convoCount + ' conversations are FREE. Then ' + selectedPurpose.satsPay +  ' SATS' } </div> : ''}
        </Typography>

      <Typography level='body1' color='neutral' sx={{
              mt: 0,
            }} >
          {selectedPurpose? <div style={{ fontSize: '1rem' }}>  {selectedPurpose.placeHolder}  <br /> </div> : ''}
        </Typography>

        <Box sx={{ mb: -1, display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'left' }}>

                  <Typography level='body1' color='neutral' sx={{
                        mt: 2,
                        alignItems: 'left', gap: 1,
                      }} >
                      Start with these suggested prompts
                  </Typography>

                  <Typography level='body2' color='neutral' sx={{
                        mt: 2,
                        alignItems: 'left', gap: 1,
                        justifyContent: 'left',
                      '&:hover > button': { opacity: 1 },
                      }} >
                    
                    {selectedPurpose?.examples?.map((selectedExample) => (
                      
                        (selectedExample
                          ? <>
                            
                            <Button style={{justifyContent: "flex-start"}} variant='outlined'  color='neutral' size='md' onClick={() => props.runExample(selectedExample)}>{truncateStringWithDots(selectedExample) }</Button>
                          
                            <br></br>
                          
                          </>
                          : selectedPurpose.description
                        )
                    ))}
                    
                  </Typography>   

        </Box>              
   
    </DetailModal>:''}
   
    {addModal? <DetailModal title={'Create New Agent'} open={addModal} onClose={onAddClose}><Divider />
    
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

              <Typography level='body2' color='neutral' sx={{
                       
                      }} >
                      Starter Prompts
                  </Typography>

              <Textarea variant='outlined' color={'neutral'}
                autoFocus
                minRows={1} maxRows={10}
                placeholder={"(Agent Smith, what are the top trending destinations this year?) ..min 10 words" }
                value={addAgentStarterPrompt1}
                onChange={(e) => setAddAgentStarterPrompt1(e.target.value)}
                sx={{
                  '&::before': {
                    outline: '0.5px solid var(--Textarea-focusedHighlight)',
                  },
                  mt: 0.1,
                  minWidth : addModalWidthSx,
                  background: theme.vars.palette.background.level2,
                  fontSize: '16px',
                  lineHeight: 1.75,
                }} >

                        

              </Textarea>
              <Textarea variant='outlined' color={'neutral'}
                autoFocus
                minRows={1} maxRows={10}
                placeholder={"(Can you recommend a relaxing beach destination for a week-long vacation?) ..min 10 words"}
                value={addAgentStarterPrompt2}
                onChange={(e) => setAddAgentStarterPrompt2(e.target.value)}
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
                placeholder={"(I'm interested in historical sites; where should I consider traveling next?) ..min 10 words"}
                value={addAgentStarterPrompt3}
                onChange={(e) => setAddAgentStarterPrompt3(e.target.value)}
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

             
    
    
    </DetailModal>:''}
   

    <Stack direction='column' sx={{ minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>

        {showPurposeFinder && <Box sx={{  mt: 4, minWidth: searchWidthSx, justifyContent: 'center', alignItems: 'center' }}>
          <Input
            
            variant='outlined' color='neutral'
            value={searchQuery} onChange={handleSearchOnChange}
            onKeyDown={handleSearchOnKeyDown}
            placeholder='Search AI Agents'
            startDecorator={<SearchIcon />}
            endDecorator={searchQuery && (
              <IconButton variant='plain' color='neutral' onClick={handleSearchClear}>
                <ClearIcon />
              </IconButton>
            )}
            sx={{
              boxShadow: theme.shadow.sm,
            }}
          />

          
        </Box>}

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 1, mt:4 }}>
           

           <Button onClick={handleTagsImageOnChange} sx={{position: 'center'}} size="sm" variant="solid"  color='neutral' > Image Generation</Button>
           <Button onClick={handleTagsRolePlayOnChange} sx={{position: 'center'}} size="sm" variant="solid"  color='neutral' > RolePlay</Button>
           <Button onClick={handleTagsTechnicalOnChange} sx={{position: 'center'}} size="sm" variant="solid"  color='neutral' > Technical</Button>
           <Button onClick={handleTagsAssistantOnChange} sx={{position: 'center'}} size="sm" variant="solid"  color='neutral' > Assistant</Button>

          
        </Box>


      <Box sx={{ maxWidth: bpMaxWidth }}>

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 1, mt:4 }}>
           <Button onClick={onAddOpen} sx={{position: 'left'}} variant="outlined"  color='neutral' > <AddIcon/> Create Agent</Button>

          <Button variant="outlined" color='neutral' size='sm' onClick={toggleEditMode}>
            {editMode ? 'Done' : 'Edit'}
          </Button>
          
        </Box>
        
        <Grid container spacing={tileSpacing} rowSpacing={2} sx={{ justifyContent: 'center' }}>
          {SystemPurposes && purposeIDs.map((spId) => (
            <Grid key={spId} spacing={0.5}>
              
              <Button
                variant={(!editMode && systemPurposeId === spId) ? 'solid' : 'soft'}
                color={(!editMode && systemPurposeId === spId) ? 'info' : SystemPurposes[spId as SystemPurposeId]?.highlighted ? 'warning' : 'neutral'}
                onClick={() => !editMode && handlePurposeChanged(spId as SystemPurposeId)}
                sx={{
                  flexDirection: 'column',
                  fontWeight: 500,
                  gap: bpTileGap,
                  height: bpTileSize,
                  width: bpTileSize,
                  ...((editMode || systemPurposeId !== spId) ? {
                    boxShadow: theme.shadow.md,
                    ...(SystemPurposes[spId as SystemPurposeId]?.highlighted ? {} : { background: theme.vars.palette.background.level1 }),
                  } : {}),
                }}
              >
                {editMode && (
                  <Checkbox
                    label={<Typography level='body2'>show</Typography>}
                    checked={!hiddenPurposeIDs.includes(spId)} onChange={() => toggleHiddenPurposeId(spId)}
                    sx={{ alignSelf: 'flex-start', mb:-3 }}
                  />
                )}
                   <Badge  invisible = {SystemPurposes[spId as SystemPurposeId].newAgent === 'false'} badgeContent={'New'} color="primary">
                         <Avatar  alt=""
                        src={SystemPurposes[spId as SystemPurposeId]?.symbol} 
                        sx={{ width: tileSx, height: tileSx,  }}/>
                    </Badge>
              
                  {SystemPurposes[spId as SystemPurposeId]?.title} 
                
                  <Typography level='body3' color='neutral' sx={{
                        mt: -2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      '&:hover > button': { opacity: 1 },
                      }} >
                        {SystemPurposes[spId as SystemPurposeId]?.chatruns } <ForumIcon/> 
                       
                                       </Typography>



                       
              
              </Button>
              
                          </Grid>
          ))}
        </Grid>

      

        <Typography level='body2' color='neutral' sx={{
              mt: 2,
               alignItems: 'left', gap: 1,
              justifyContent: 'left',
            '&:hover > button': { opacity: 1 },
            }} >

{"NOTE: PlebAI exclusively utilizes open-source large language models and is not biased to any particular ideology. We do not use closed source OpenAI or Anthropic models. You can have unprotected and unfiltered conversations without bias. No terms and conditions to accept. Be civil and don't break the law. "}
            </Typography>

        

      </Box>

    </Stack>

  </>;
}


function countWordsInString(content: string): number {
  // Read the file content

  // Split content by spaces and filter out non-words
  const words = content.split(/\s+/).filter(word => /\S/.test(word));

  return words.length;
}
