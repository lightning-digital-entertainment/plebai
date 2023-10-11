import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Badge, Box, IconButton, Link, ListDivider, ListItemDecorator, Menu, MenuItem, Sheet, SvgIcon, Switch, Typography, useColorScheme } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { useUIStateStore } from '~/common/state/store-ui';

import { SupportMenuItem } from './SupportMenuItem';
import { useApplicationBarStore } from './store-applicationbar';
import { M_PLUS_1 } from 'next/font/google';

function DiscordIcon(props: { sx?: SxProps }) {
  return <SvgIcon viewBox='0 0 24 24' width='24' height='24' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
    <path d='M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.94 0 -2.257 -1.596 -2.777 -2.969l-.02 .005c.838 -.131 1.69 -.323 2.572 -.574a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.725 .207 1.431 .373 2.126 .499l.444 .074c-.477 1.37 -1.695 2.965 -2.627 2.965c-1.743 0 -3.276 -1.555 -4.267 -3.644c-.841 -2.206 -.369 -6.868 1.414 -12.174a1 1 0 0 1 .358 -.49c1.392 -1.016 2.807 -1.475 4.717 -1.685a1 1 0 0 1 .938 .435l.063 .107l.652 1.288l.16 -.019c.877 -.09 1.718 -.09 2.595 0l.158 .019l.65 -1.287a1 1 0 0 1 .754 -.54l.123 -.01zm-5.983 6a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z' strokeWidth='0' fill='currentColor'></path>
  </SvgIcon>;
}

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

  const closeContextMenu = React.useCallback(() => setContextMenuAnchor(null), [setContextMenuAnchor]);

  const commonContextItems = React.useMemo(() =>
      <CommonContextItems onClose={closeContextMenu} />
    , [closeContextMenu]);

  return <>

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
            <Typography level='body1' color='primary' sx={{
                            flexDirection: 'row', flexWrap: 'wrap'
                            }} >
                            Join our community on 
                            <Link color='primary' sx={{ml:1}} href='https://discord.gg/DfSZpqUKYG'> Discord <DiscordIcon sx={{ ml: 1, color: '' }} /> </Link> 
            </Typography>
         
            

      </Box>
     
      {/* Context-Menu Button */}
      <IconButton disabled={!!contextMenuAnchor || !contextMenuItems} variant='plain' onClick={event => setContextMenuAnchor(event.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
    </Sheet>


    {/* Application-Menu Items */}
    {!!appMenuItems && <Menu
      variant='plain' color='neutral' size='lg' sx={{ minWidth: 320, maxHeight: 'calc(100dvh - 56px)', overflowY: 'auto' }}
      open={!!applicationMenuAnchor} anchorEl={applicationMenuAnchor} onClose={closeApplicationMenu}
      placement='bottom-start' disablePortal={false}
    >
      {appMenuItems}
    </Menu>}

    {/* Context-Menu Items */}
    <Menu
      variant='plain' color='neutral' size='lg' sx={{ minWidth: 280, maxHeight: 'calc(100dvh - 56px)', overflowY: 'auto' }}
      open={!!contextMenuAnchor} anchorEl={contextMenuAnchor} onClose={closeContextMenu}
      placement='bottom-end' disablePortal={false}
    >
      {commonContextItems}
      <ListDivider />
      {contextMenuItems}
      
       <SupportMenuItem /> 
    </Menu>

  </>;
}