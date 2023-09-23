import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Avatar, Box, Button, Checkbox, Divider, Grid, IconButton, Input, Stack, Textarea, Typography, useTheme } from '@mui/joy';
import ClearIcon from '@mui/icons-material/Clear';
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


// Constants for tile sizes / grid width - breakpoints need to be computed here to work around
// the "flex box cannot shrink over wrapped content" issue
//
// Absolutely dislike this workaround, but it's the only way I found to make it work

const bpTileSize = { xs: 116, md: 150, xl: 150 };
const tileCols = [3, 5, 6];
const tileSpacing = 2;
const tileSx = { xs: 42, md: 96, xl: 96 };
const detailAvatarSx = { xs: 62, md: 122, xl: 130 };
const searchWidthSx = { xs: 162, md: 322, xl: 430 };
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

  const { setChatLLMId } = useModelsStore(state => ({
    setChatLLMId: state.setChatLLMId,
  }), shallow);

  console.log('System purposes: ', Object.keys(SystemPurposes).length);

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

  

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (!query)
      return handleSearchClear();
    setSearchQuery(query);

    // Filter results based on search term
    const ids = Object.keys(SystemPurposes)
      .filter(key => SystemPurposes.hasOwnProperty(key))
      .filter(key => {
        const purpose = SystemPurposes[key as SystemPurposeId];
        return purpose.title.toLowerCase().includes(query.toLowerCase())
          || (typeof purpose.description === 'string' && purpose.description.toLowerCase().includes(query.toLowerCase()));
      });
    setFilteredIDs(ids as SystemPurposeId[]);

    console.log("fileter: ", filteredIDs)


    // If there's a search term, activate the first item
    if (ids.length && !ids.includes(systemPurposeId))
      handlePurposeChanged(ids[0] as SystemPurposeId);
  };

  const handleSearchOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Escape')
      handleSearchClear();
  };


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

    {Object.keys(SystemPurposes).length<2? <WelcomeModal title={<>Welcome to  <b>PlebAI</b> <br></br></>} open={true} onClose={closeModelsSetup} ><Divider /></WelcomeModal>:''}
    {detailModal? <DetailModal title={SystemPurposes[systemPurposeId as SystemPurposeId]?.title} open={detailModal} onClose={onDetailClose}>
      
       <Divider />
    
       <Avatar  alt=""
                        src={SystemPurposes[systemPurposeId as SystemPurposeId]?.symbol} 
                        sx={{ width: detailAvatarSx, height: detailAvatarSx, mt: 1, }}/>

      <Typography level='body1' color='neutral' sx={{
              mt: 0,
            }} >
        {selectedPurpose? <div style={{ fontSize: '1rem' }}>  LLM Type:  {selectedPurpose.llmRouter}  </div> : ''}
        {selectedPurpose? <div style={{ fontSize: '1rem' }}>  Price:  {selectedPurpose.satsPay} SATS for {selectedPurpose.convoCount} conversations   </div> : ''}
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

       

      <Box sx={{ maxWidth: bpMaxWidth }}>

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 1, mt:4 }}>
           <Button onClick={function (){}} sx={{position: 'left'}} variant="outlined"  color='neutral'> <AddIcon/> Create Agent</Button>
    
          <Button variant="outlined" color='neutral' size='sm' onClick={toggleEditMode}>
            {editMode ? 'Done' : 'Edit'}
          </Button>
          
        </Box>
        
        <Grid container spacing={tileSpacing} sx={{ justifyContent: 'center' }}>
          {SystemPurposes && purposeIDs.map((spId) => (
            <Grid key={spId}>
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
                
                <Avatar  alt=""
                        src={SystemPurposes[spId as SystemPurposeId]?.symbol} 
                        sx={{ width: tileSx, height: tileSx,  }}/>

                  {SystemPurposes[spId as SystemPurposeId]?.title}
                  
              
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

NOTE: PlebAI exclusively utilizes open-source large language models and is not biased to any particular ideology. We do not use closed source OpenAI or Anthropic models. You can have unprotected and unfiltered conversations without bias.
            </Typography>

        

      </Box>

    </Stack>

  </>;
}