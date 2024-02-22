import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Avatar, Box, Button, Option, Checkbox, Divider, Grid, IconButton, Input, Select, Stack, Switch, Textarea, Typography, useTheme, Alert, CircularProgress, Badge, Link, ListItem } from '@mui/joy';
import ClearIcon from '@mui/icons-material/Clear';
import ForumIcon from '@mui/icons-material/Forum';
import StarRateIcon from '@mui/icons-material/StarRate';
import SearchIcon from '@mui/icons-material/Search';

import { useChatStore } from '~/common/state/store-chats';
import { useUIPreferencesStore } from '~/common/state/store-ui';

import { SystemPurposeId, SystemPurposes } from '../../../../apps/chat/components/composer/Composer';
import { useModelsStore } from '~/modules/llms/store-llms';
import { usePurposeStore } from './store-purposes';
import { WelcomeModal } from '~/common/components/WelcomeModal';
import { useUIStateStore } from '~/common/state/store-ui';
import { DetailModal } from '~/common/components/DetailModal';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useCallback } from 'react';
import { useComposerStore } from '../composer/store-composer';
import { SamplePrompts } from './SamplePrompts';
import { AddTextmodal } from './AddTextModal';
import { AddImagemodal } from './AddImageModal';
import { CardMedia } from '@mui/material';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import EditIcon from '@mui/icons-material/Edit';
import { copyToClipboard } from '~/common/util/copyToClipboard';



// Constants for tile sizes / grid width - breakpoints need to be computed here to work around
// the "flex box cannot shrink over wrapped content" issue
//
// Absolutely dislike this workaround, but it's the only way I found to make it work

const bpTileSize = { xs: 96, md: 160, xl: 160 };
const tileCols = [3, 5, 6];
const tileSpacing = 2;
const tileSx = { xs: 42, md: 96, xl: 96 };
const detailAvatarSx = { xs: 62, md: 122, xl: 130 };
const searchWidthSx = { xs: 220, md: 422, xl: 630 };
const tileHSx = { xs: 42, md: 126, xl: 156 };
const tileWSx =  { xs: 42, md: 126, xl: 156 };

const bpMaxWidth = Object.entries(bpTileSize).reduce((acc, [key, value], index) => {
  acc[key] = tileCols[index] * (value + 8 * tileSpacing) - 8 * tileSpacing;
  return acc;
}, {} as Record<string, number>);
const bpTileGap = { xs: 2, md: 3 };




// Add this utility function to get a random array element
const getRandomElement = <T, >(array: T[]): T | undefined =>
  array.length > 0 ? array[Math.floor(Math.random() * array.length)] : undefined;

 


/**
 * Purpose selector for the current chat. Clicking on any item activates it for the current chat.
 */
export function PurposeSelector(props: { conversationId: string, runExample: (example: string) => void }) {
  // state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredIDs, setFilteredIDs] = React.useState<SystemPurposeId[] | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [detailModal, setDetailModal] = React.useState(false);
  const [samplePromptModal, setsamplePromptModal] = React.useState(false);
  const [addTextModal, setaddTextModal] = React.useState(false);
  const [addImageModal, setaddImageModal] = React.useState(false);
  const [updateRefresh, setUpdaterefresh] = React.useState(true);
  const [showCreateSelect, setShowCreateSelect] = React.useState(false);
  const [agentId, setAgentId] = React.useState<string>('new');
  const [restricted, setRestricted] = React.useState(localStorage.getItem('restricted')==='true'?true:false)
  const [privateAgent, setPrivateAgent] = React.useState(localStorage.getItem('private')==='true'?true:false)
  const [agentPubKey, setAgentPubKey] = React.useState('')
  
  const {  startupText, setStartupText } = useComposerStore();

  const { setChatLLMId } = useModelsStore(state => ({
    setChatLLMId: state.setChatLLMId,
  }), shallow);

  console.log('System purposes: ', Object.keys(SystemPurposes).length);

  const appFingerPrint = localStorage.getItem('appFingerPrint');
  const {agentUpdate, setAgentUpdate} = useUIPreferencesStore(state => ({agentUpdate: state.agentUpdate, setAgentUpdate: state.setAgentUpdate,}));
  
  const getNostrPubkey = React.useCallback(async (nip05:string) => {
    
        
    try {

      const [user, domain] = nip05.split('@');
      const input = {user, domain}

      const response = await fetch(`/api/current/pubkey`, {
        method: 'POST',
        body: JSON.stringify(input),
        headers: {
          'content-type' : 'application/json'
        }
  
      });
  
      const result = await response?.json();
      
  
      setAgentPubKey(result?.names[user]);
      
    } catch (error) {
      console.log(error);
    }

   


  },[]);


  React.useEffect(() => {
    if (updateRefresh || Object.keys(SystemPurposes).length<2) {
    
      setAgentUpdate(Math.floor(Date.now() / 1000))
      setUpdaterefresh(false)
    }
  }, [updateRefresh, setAgentUpdate]); 


  
  

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

  
  const handleRestrictChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
        console.log(event.target.checked);
        if (event.target.checked) {
          setRestricted(true);
          localStorage.setItem('restricted', "true")
        } else {
          setRestricted(false);
          localStorage.setItem('restricted', "false")
        } 
        executeFilter('');
  };

  const handlePrivateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    console.log(event.target.checked);
    if (event.target.checked) {
      setPrivateAgent(true);
      localStorage.setItem('private', "true")
    } else {
      setPrivateAgent(false);
      localStorage.setItem('private', "false")
    } 
    executeFilter('');
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
        return  (purpose.private === privateAgent) && ( purpose.restricted === null || purpose.restricted === restricted) && (purpose.title.toLowerCase().includes(query.toLowerCase())
          || (typeof purpose.placeHolder === 'string' && purpose.placeHolder.toLowerCase().includes(query.toLowerCase()))
          || (typeof purpose.category === 'string' && purpose.category.toLowerCase().includes(query.toLowerCase())));
      });
    setFilteredIDs(ids as SystemPurposeId[]);

    //console.log("fileter: ", filteredIDs)



  }

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    executeFilter(e.target.value);
  };

  const handleTagsImageOnChange = () => {
    executeFilter('Image Generation');
  };

  const handleTagsRolePlayOnChange = () => {
    executeFilter('Role Play');
  };
  const handleTagsTechnicalOnChange = () => {
    executeFilter('Technical');
  };
  const handleTagsAssistantOnChange = () => {
    executeFilter('Assistant');
  };

  const handleSearchOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Escape')
      handleSearchClear();
  };

  
  const handleIdCopy = (text:string) => {copyToClipboard(text); }

  const toggleEditMode = () => setEditMode(!editMode);

  const handlePurposeChanged = (purposeId: SystemPurposeId | null) => {
    if (purposeId) {
      setSystemPurposeId(props.conversationId, purposeId);
      console.log(SystemPurposes[purposeId as SystemPurposeId].chatLLM)
      setChatLLMId(SystemPurposes[purposeId as SystemPurposeId].chatLLM)
      setDetailModal(true);
      getNostrPubkey(SystemPurposes[purposeId as SystemPurposeId].nip05);
    }  
  };

  

  const onSetExample = (messageText: string) => {

    setStartupText(messageText);
    setDetailModal(false);

  }

  const onDetailClose = () => {setDetailModal(false)};
  const onAddTextOpen = () => {setaddTextModal(true)};
  const onAddImageOpen = () => {setaddImageModal(true)};
  const onStartupModalClose = () => {if (Object.keys(SystemPurposes).length<2) setUpdaterefresh(true); }
  const onClosePromptView = () => {setsamplePromptModal(false);};
  const handlePromptView  = () => {

    setDetailModal(false);
    setsamplePromptModal(true);
    
  } 

  const handleEditButton = (agentId: string, category: string) => {

        if (category === 'Image Generation') {
          handleEditImageButton(agentId);
        } else {
          handleEditTextButton(agentId);
        }
  }

  const handleEditImageButton = (agentId: string) => {

        setAgentId(agentId);
        setaddImageModal(true);


  }

  const handleEditTextButton = (agentId: string) => {

    setAgentId(agentId);
    setaddTextModal(true);


}

  const onCloseAddImageModal = () => {
    setUpdaterefresh(true);
    do {} while (agentUpdate != 0);
  
    setaddImageModal(false);
    setAgentId('new');
    setPrivateAgent(true);
    
  }

  const onCloseAddTextModal = () => {
    setUpdaterefresh(true);
    do {} while (agentUpdate != 0);
  
    setaddTextModal(false);
    setAgentId('new');
    setPrivateAgent(true);
    
  }

  const createSelect = () => {
    return ["Create Text Agent", "Create Image Agent"];
  };

  const createSelection = (city: string): void => {
    console.log(city);
  };


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

  const toggleDropDown = () => {
    setShowCreateSelect(!showCreateSelect);
  };

  // we show them all if the filter is clear (null)
  const unfilteredPurposeIDs = (filteredIDs && showPurposeFinder) ? filteredIDs : Object.keys(SystemPurposes);
  const purposeIDs = editMode ? unfilteredPurposeIDs : unfilteredPurposeIDs.filter(id => !hiddenPurposeIDs.includes(id)).filter(key => {
    const purpose = SystemPurposes[key as SystemPurposeId];
    return  ( purpose.restricted === null || purpose.restricted === restricted) && (purpose.private === privateAgent)});

  const selectedPurpose = purposeIDs.length ? (SystemPurposes[systemPurposeId] ?? null) : null;
  const selectedExample = selectedPurpose?.examples && getRandomElement(selectedPurpose.examples) || null;

  return <>

    {Object.keys(SystemPurposes).length<2? <WelcomeModal title={<>Welcome to  <b>PlebAI</b> <br></br></>} open={true} onClose={onStartupModalClose} ><Divider /></WelcomeModal>:''}
    {detailModal? <DetailModal title='' open={detailModal} onClose={onDetailClose}>
      
      <Avatar  alt=""
                        src={SystemPurposes[systemPurposeId as SystemPurposeId]?.symbol} 
                        sx={{ width: detailAvatarSx, height: detailAvatarSx, mt: 1, }}/>
      <Box sx={{
               display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, justifyContent: 'center',
            }}>
        <Typography level='body-lg' color='neutral' sx={{
              mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, justifyContent: 'center',
            }} ></Typography>
        {selectedPurpose? <div style={{ fontSize: '1.5rem' }}>   {selectedPurpose.title}  </div> : ''}

       {SystemPurposes[systemPurposeId as SystemPurposeId]?.createdBy===appFingerPrint && <Button sx={{mt: 0}} onClick={() => handleEditButton(systemPurposeId, SystemPurposes[systemPurposeId as SystemPurposeId]?.category)} variant="soft"  color='neutral'> <EditIcon/> </Button>}                 
      </Box>
      <Typography level='body-lg' color='neutral' sx={{
              mt: 0, ml:10, mr:10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, justifyContent: 'center',
            }} >
       
       {selectedPurpose?  <div style={{ fontSize: '1rem' }}>  ID: {agentPubKey.substring(0,8) + '...'}      
            <IconButton variant='plain' color='neutral' onClick={() => handleIdCopy(agentPubKey)}  sx={{}}><ContentCopyIcon /> </IconButton> </div> : ''}
        
        {selectedPurpose? <div style={{ fontSize: '1rem' }}>  Price: {selectedPurpose.paid?selectedPurpose.satsPay + ' SATS':  selectedPurpose.convoCount + ' conversations are FREE. Then ' + selectedPurpose.satsPay +  ' SATS' } </div> : ''}
        {selectedPurpose? <Link href={'https://plebai.com/nostr/' + selectedPurpose.nip05} > {'Nostr profile: ' + selectedPurpose.nip05}  </Link> : ''}
               {selectedPurpose? <div style={{ fontSize: '1rem' }}>  {selectedPurpose.placeHolder}   </div> : ''}
        </Typography>

         <Button onClick={handlePromptView} sx={{position: 'center'}} variant="soft"  color='neutral' >  {selectedPurpose?.paid?'View  Sample Images':'View Sample Prompts'}</Button>


        
              
   
    </DetailModal>:''}

    {samplePromptModal && <SamplePrompts agentId={systemPurposeId} open={samplePromptModal} onClose={onClosePromptView} total={selectedPurpose?.chatruns?selectedPurpose?.chatruns:0} genImage={selectedPurpose?.paid?selectedPurpose?.paid:false} />}
   
    {addTextModal && <AddTextmodal agentId={agentId} open={addTextModal} onClose={onCloseAddTextModal}  ></AddTextmodal>}
    {addImageModal && <AddImagemodal agentId={agentId} open={addImageModal} onClose={onCloseAddImageModal}  ></AddImagemodal>}
   

    <Stack direction='column' sx={{ minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>

        {showPurposeFinder && <Box sx={{  mt: 2, minWidth: searchWidthSx, justifyContent: 'center', alignItems: 'center' }}>
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

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 0, mt:4 }}>
           

           <Button onClick={handleTagsImageOnChange} sx={{position: 'center'}} size="sm" variant="solid"  color='neutral' > Image Generation</Button>
           <Button onClick={handleTagsRolePlayOnChange} sx={{position: 'center'}} size="sm" variant="solid"  color='neutral' > Role Play</Button>
           <Button onClick={handleTagsTechnicalOnChange} sx={{position: 'center'}} size="sm" variant="solid"  color='neutral' > Technical</Button>
           <Button onClick={handleTagsAssistantOnChange} sx={{position: 'center'}} size="sm" variant="solid"  color='neutral' > Assistant</Button>
           <Button onClick={handleTagsAssistantOnChange} sx={{position: 'center'}} size="sm" variant="solid"  color='neutral' > DVMs</Button>

          
        </Box>


      <Box sx={{ maxWidth: bpMaxWidth }}>

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',gap: 2, mb: 4, mt:0 }}>
           

           <Dropdown>
            <MenuButton sx={{ justifyContent: 'left'}}>
            <AddIcon/> Create Agent
            </MenuButton>
            <Menu>
              <MenuItem onClick={onAddTextOpen}>
                Text AI agent
              </MenuItem>
              <MenuItem onClick={onAddImageOpen}>
                Image AI agent
              </MenuItem>
            
            </Menu>
          </Dropdown>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'right', gap: 2, mb: 1, mt:4 }}>
          <Checkbox sx={{ justifyContent: 'right'}} checked={privateAgent} onChange = {handlePrivateChange} label="Private" size="sm" />
          <Checkbox sx={{ justifyContent: 'right'}} checked={restricted} onChange = {handleRestrictChange} label="Over 18+" size="sm" />
          <Button sx={{ justifyContent: 'right'}} variant="outlined" color='neutral' size='sm' onClick={toggleEditMode}>
            {editMode ? 'Done' : 'Hide'}
          </Button>
            </Box>
         
          
        </Box>

       
        {showCreateSelect && (
                  <ListItem
                  variant='solid' color='neutral'
                  sx={{
                    mb: -1, // absorb the bottom margin of the list
                    mt: 1,
                    
                    background: theme.palette.neutral.solidActiveBg,
                    display: 'flex', flexDirection: 'column', gap: 1,
                    justifyContent: 'left',alignItems: 'left'
                  }}>
                   <Button onClick={toggleDropDown} sx={{position: 'left'}} variant="outlined"  color='neutral' > <AddIcon/> Create Text Agent</Button>
                   <Button onClick={toggleDropDown} sx={{position: 'left'}} variant="outlined"  color='neutral' > <AddIcon/> Create Image Agent</Button>
                </ListItem>
              )}
        
        <Grid container spacing={tileSpacing} rowSpacing={2} sx={{ justifyContent: 'center' }}>
          {SystemPurposes && purposeIDs.map((spId) => (
            
            <Grid key={spId} spacing={0.5}>
              
               <Button
                variant={(!editMode && systemPurposeId === spId) ? 'solid' : 'soft'}
                color={(!editMode && systemPurposeId === spId) ? 'primary' : SystemPurposes[spId as SystemPurposeId]?.highlighted ? 'warning' : 'neutral'}
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
                    label={<Typography level='body-sm'>show</Typography>}
                    checked={!hiddenPurposeIDs.includes(spId)} onChange={() => toggleHiddenPurposeId(spId)}
                    sx={{ alignSelf: 'flex-start', mb:-3 }}
                  />
                )}
                  <Badge  invisible = {SystemPurposes[spId as SystemPurposeId].newAgent === 'false'} badgeContent={'New'} color="primary">
                        <Typography level='body-sm' color='neutral' sx={{
                              mt: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            '&:hover > button': { opacity: 1 },
                            }} > 
                            {SystemPurposes[spId as SystemPurposeId]?.title} 
                            
                            </Typography>
                      </Badge>
                   
                   <CardMedia alt=""
                              
                              component="img"
                              height="128"
                              src={SystemPurposes[spId as SystemPurposeId]?.symbol} 
                              sx={{ mt: -2, width: tileSx, height: tileSx  }}/>
                  
                
                  <Typography level='body-xs' color='neutral' sx={{
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

      

        <Typography level='body-sm' color='neutral' sx={{
              mt: 2,
               alignItems: 'left', gap: 1,
              justifyContent: 'left',
            '&:hover > button': { opacity: 1 },
            }} >

{"NOTE: PlebAI exclusively utilizes open-source large language models and does not favor any particular ideology. You can engage in unbiased conversations without filters. However, prompts are visible to other users. DO NOT input any private or personally identifiable information. There are no terms and conditions to accept. Remain civil and abide by the law. "}
            </Typography>

        

      </Box>

    </Stack>

  </>;
}