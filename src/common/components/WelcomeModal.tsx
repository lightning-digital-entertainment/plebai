import * as React from 'react';

import { Box, Button, Modal, ModalClose, ModalDialog, ModalOverflow, Typography } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';


/**
 * Base for out Modal components (Preferences, Models Setup, etc.)
 */
export function WelcomeModal(props: { title: string | React.JSX.Element, open: boolean, onClose: () => void, startButton?: React.JSX.Element, sx?: SxProps, children: React.ReactNode }) {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalOverflow>
        <ModalDialog
          sx={{
            minWidth: { xs: 180, sm: 250, md: 300, lg: 350 },
            maxWidth: 700,
            alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 3,
            ...props.sx,
          }}>

          <Box sx={{ mb: -1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography level='body-lg'>
              {props.title}
            </Typography>
            
          </Box>

          {props.children}

          <Box sx={{ mb: -1, display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'space-between' }}>
              <Typography level='body-lg' color='neutral' sx={{mb: 2}} ><CheckCircleRoundedIcon />  {' No Email or Signups Required'} </Typography>
              <Typography level='body-lg' color='neutral' sx={{mb: 2}} ><CheckCircleRoundedIcon sx={{ }}  />  {' Only use Open source LLMs'}</Typography>
              <Typography level='body-lg' color='neutral' sx={{mb: 2}} ><CheckCircleRoundedIcon sx={{ }}  />  {' No Ads or trackers'}</Typography>
              <Typography level='body-lg' color='neutral' sx={{mb: 2}} ><CheckCircleRoundedIcon sx={{ }}  />  {' Chat history stored on the browser'}</Typography>
              <Typography level='body-lg' color='neutral' sx={{mb: 2}} ><CheckCircleRoundedIcon sx={{ }}  />  {' Free to try any agent'}</Typography>
              <Typography level='body-lg' color='neutral' sx={{mb: 2}} ><CheckCircleRoundedIcon sx={{ }}  />  {' Pay with SATS using Alby Wallet'}</Typography>
              <Typography level='body-lg' color='neutral' sx={{mb: 2}} ><CheckCircleRoundedIcon sx={{ }}  />  {" No T&C to accept.But don't spam "}</Typography>
           </Box>
        

          <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
            {props.startButton}
            <Button variant='solid' color='neutral' onClick={props.onClose} sx={{ display: 'flex', justifyContent: 'space-between' , alignItems: 'center' }}>
              Start
            </Button>
          </Box>

        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
