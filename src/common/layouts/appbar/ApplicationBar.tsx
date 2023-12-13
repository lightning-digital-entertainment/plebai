import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Avatar, Badge, Box, Button, IconButton, Link, ListDivider, ListItemDecorator, Menu, MenuItem, Sheet, SvgIcon, Switch, Typography, useColorScheme } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { CloseableMenu } from '~/common/components/CloseableMenu';
import { useUIStateStore } from '~/common/state/store-ui';
import { NDKNip07Signer} from "@nostr-dev-kit/ndk";
import { SupportMenuItem } from './SupportMenuItem';
import { useApplicationBarStore } from './store-applicationbar';
import { SubscriptionModal } from 'src/apps/chat/components/appbar/SubscriptionModal';
import { SimplePool, generatePrivateKey, getPublicKey } from 'nostr-tools';

function DiscordIcon(props: { sx?: SxProps }) {
  return <SvgIcon viewBox='0 0 24 24' width='24' height='24' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
    <path d='M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.94 0 -2.257 -1.596 -2.777 -2.969l-.02 .005c.838 -.131 1.69 -.323 2.572 -.574a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.725 .207 1.431 .373 2.126 .499l.444 .074c-.477 1.37 -1.695 2.965 -2.627 2.965c-1.743 0 -3.276 -1.555 -4.267 -3.644c-.841 -2.206 -.369 -6.868 1.414 -12.174a1 1 0 0 1 .358 -.49c1.392 -1.016 2.807 -1.475 4.717 -1.685a1 1 0 0 1 .938 .435l.063 .107l.652 1.288l.16 -.019c.877 -.09 1.718 -.09 2.595 0l.158 .019l.65 -1.287a1 1 0 0 1 .754 -.54l.123 -.01zm-5.983 6a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z' strokeWidth='0' fill='currentColor'></path>
  </SvgIcon>;
}

const explicitRelayUrls = [
        'wss://relay.current.fyi',
        'wss://nostr1.current.fyi',
        'wss://nostr-pub.wellorder.net',
        'wss://relay.damus.io',
        'wss://nos.lol',
        'wss://relay.primal.net',
        "wss://relay.nostr.band",
        "wss://purplepag.es",
        "wss://filter.nostr.wine",

];



function CommonContextItems(props: { onClose: () => void }) {
  // external state
  const { mode: colorMode, setMode: setColorMode } = useColorScheme();

  const handleToggleDarkMode = () => setColorMode(colorMode === 'dark' ? 'light' : 'dark');

  const handleShowSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    useUIStateStore.getState().openSettings();
    props.onClose();
  };

 

  return <>

    <MenuItem onClick={handleToggleDarkMode}>
      <ListItemDecorator><DarkModeIcon /></ListItemDecorator>
      Dark
      <Switch checked={colorMode === 'dark'} onChange={handleToggleDarkMode} sx={{ ml: 'auto' }} />
    </MenuItem>

    <MenuItem onClick={handleShowSettings}>
      <ListItemDecorator><SettingsOutlinedIcon /></ListItemDecorator>
      Preferences
    </MenuItem>

  </>;
}





/**
 * The top bar of the application, with the model and purpose selection, and menu/settings icons
 */
export function ApplicationBar(props: { sx?: SxProps }) {

  // external state
  const {
    centerItems, appMenuBadge, appMenuItems, contextMenuItems,
    appMenuAnchor: applicationMenuAnchor, setAppMenuAnchor: setApplicationMenuAnchor,
    contextMenuAnchor, setContextMenuAnchor,
  } = useApplicationBarStore(state => ({
    appMenuBadge: state.appMenuBadge,
    appMenuItems: state.appMenuItems,
    centerItems: state.centerItems,
    contextMenuItems: state.contextMenuItems,
    appMenuAnchor: state.appMenuAnchor, setAppMenuAnchor: state.setAppMenuAnchor,
    contextMenuAnchor: state.contextMenuAnchor, setContextMenuAnchor: state.setContextMenuAnchor,
  }), shallow);

  const closeApplicationMenu = () => setApplicationMenuAnchor(null);
  const userPubkey:any = localStorage.getItem('userPubkey');

  const closeContextMenu = React.useCallback(() => setContextMenuAnchor(null), [setContextMenuAnchor]);

  const [subscribeModal, setSubscribeModal] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);
  const [userImage, setUserImage] = React.useState('');

  const commonContextItems = React.useMemo(() =>
      <CommonContextItems onClose={closeContextMenu} />
    , [closeContextMenu]);

  const onCloseAddSubscribeModal = () => {
      setSubscribeModal(false);
      
  }

  const verifySubscription = async (userPubkey:string) => {

    if (userPubkey==='') return;

    const url =  '/subscribers/' + userPubkey;

    const verifyResponse = await fetch('/api/current/subcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({url})
    });
    try {

        const result = await verifyResponse?.json();

        if (result?.active) {
            localStorage.setItem('subexpiry', result.expires);
            setSubscribed(true);
        } else {

          localStorage.setItem('subexpiry', '');
          setSubscribed(false);
        }
        
    } catch (error) {
        console.log(error);
        localStorage.setItem('subexpiry', '');
        setSubscribed(false);
    }
    


}



  const getProfile = (pubkey:string) => {
    return new Promise((resolve, reject) => {

      const pool = new SimplePool();

      pool.get(explicitRelayUrls, {
                kinds: [0],
                authors: [pubkey]
          }).then( function (event:any) {
            if (event?.content) {
              return resolve(event.content);

            } else {

              return resolve ('');
            }


          });
  });
}
  
  const getImage = React.useCallback(async () => {

    const nip07signer = new NDKNip07Signer();

    let pubkey = userPubkey;

    try {

      const nipok =  await nip07signer?.blockUntilReady();

      if (nipok) {

        
      
        nip07signer.user().then(async (user) => {
          console.log(user);
          if (!!user.npub) {
              console.log("Permission granted to read their public key:", user.npub);

              

            const profile:any = await (getProfile(user.pubkey));
            localStorage.setItem('userPubkey', user.pubkey);
            const data = JSON.parse(profile);
            console.log(data.picture);
            setUserImage(data.picture);

              
              
          }
        });
       

      }
      
    } catch (error) {

      console.log(error);
      setUserImage('/icons/user-defult.png');
      if (!userPubkey) {
          const privateKey = generatePrivateKey();
          pubkey = getPublicKey(privateKey);
          console.log(pubkey);
          localStorage.setItem('userPubkey', pubkey);

      }

    }

    verifySubscription(pubkey);

    

  }, [userPubkey]);



  React.useEffect(() => {

      if (userImage === '') {
        getImage();       

      }    
      
  }, [getImage,userImage]);

   
  return <>

    {subscribeModal && <SubscriptionModal open={subscribeModal} onClose={onCloseAddSubscribeModal}></SubscriptionModal>}

    <Sheet
      variant='solid' color='neutral' invertedColors
      sx={{
        p: 1,
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
        ...(props.sx || {}),
      }}>

        

      {/* Application-Menu Button */}
      <IconButton disabled={!!applicationMenuAnchor || !appMenuItems} variant='plain' onClick={event => setApplicationMenuAnchor(event.currentTarget)}>
        <Badge variant='solid' size='sm' badgeContent={appMenuBadge ? appMenuBadge : 0}>
          <MenuIcon />
        </Badge>
      </IconButton>

      <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', my: 'auto' }}>
            
            {centerItems}
            <Typography level='body-sm' color='primary' sx={{
                            flexDirection: 'row', flexWrap: 'wrap'
                            }} >
                            {subscribed? 
                            
                            'You are subscribed '
                            :
                            <Button  sx={{position: 'center'}} variant="solid"  onClick={() => setSubscribeModal(true)} color='neutral' > Subscribe </Button>}

                             {' for unlimited text and image AI. Join our' }
                            <Link color='primary' sx={{ml:1}} href='https://discord.gg/DfSZpqUKYG'> Discord <DiscordIcon sx={{ ml: 1, color: '' }} /> </Link> 
            </Typography>
         
            

      </Box>
     
      {/* Context-Menu Button */}
      <IconButton disabled={!!contextMenuAnchor || !contextMenuItems} variant='plain' onClick={event => setContextMenuAnchor(event.currentTarget)}>
       {<Avatar  alt="User profile."
      src={userImage}/> } 
      </IconButton>
    </Sheet>


    {/* Application-Menu Items */}
    {!!appMenuItems && <CloseableMenu
      variant='plain'  sx={{ minWidth: 320, maxHeight: 'calc(100dvh - 56px)', overflowY: 'auto' }}
      open={!!applicationMenuAnchor} anchorEl={applicationMenuAnchor} onClose={closeApplicationMenu}
      placement='bottom-start' 
    >
      {appMenuItems}
    </CloseableMenu>}

    {/* Context-Menu Items */}
    <CloseableMenu
      variant='plain'sx={{ minWidth: 280, maxHeight: 'calc(100dvh - 56px)', overflowY: 'auto' }}
      open={!!contextMenuAnchor} anchorEl={contextMenuAnchor} onClose={closeContextMenu}
      placement='bottom-end' 
    >
      {commonContextItems}
      <ListDivider />
      {contextMenuItems}
      
       <SupportMenuItem /> 
    </CloseableMenu>

  </>;
}