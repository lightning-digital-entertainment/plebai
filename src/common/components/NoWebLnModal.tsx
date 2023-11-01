import * as React from 'react';

import { Box, Button, Divider, Link, Modal, ModalDialog, Typography } from '@mui/joy';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useQRCode } from 'next-qrcode';
import { copyToClipboard } from '~/common/util/copyToClipboard';
import Image from 'next/image';


/**
 * A confirmation dialog (Joy Modal)
 * Pass the question and the positive answer, and get called when it's time to close the dialog, or when the positive action is taken
 */
export function NoWebLnModal(props: { open: boolean, onClose: () => void, qrText:string }) {
  const { Canvas } = useQRCode();

  const userAgent: string = navigator.userAgent
  const isMobile = /(iPad|iPhone|Android|Mobile)/i.test(userAgent) || false

  const handleQrCopy = () => {
    copyToClipboard(props.qrText);
    console.log('check mobile: ', isMobile)
  };
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalDialog variant='outlined' color='neutral'  sx={{
            minWidth: { xs: 180, sm: 250, md: 300, lg: 350 },
            maxWidth: 700,
            alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 3,
          }}>

        <Typography component='h2' startDecorator={<WarningRoundedIcon />}>
          Lightning Payment 
        </Typography>
        <Divider  />

        {isMobile?
        <Box sx={{
          alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 3,
        }}>
         <Typography>
         {'Please download Current App to use PlebAI on mobile. '} 
         
       </Typography>
         <Link sx={{ alignItems: 'center'}} href='https://apps.apple.com/us/app/current-nostr-bitcoin/id1668517032'> 
            <Image src='/icons/ios.svg' alt='App Logo' width={250} height={88} />
        </Link> 
        <Link sx={{ alignItems: 'center'}} href='https://play.google.com/store/apps/details?id=io.getcurrent.current'> 
          <Image src='/icons/adroid.svg' alt='App Logo' width={250} height={88} />
        </Link> 
        </Box>
       :
       <Box sx={{
        alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 3,
      }}>
        <Typography>
          {'Scan or click to copy this QR code to pay.'} 
          
        </Typography>
        <Button variant='plain' onClick={handleQrCopy}>
            <Canvas
                text={props.qrText}
                options={{
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 200,
                  
                }}
              />
          </Button>
        
        <Typography>
              {'Or create a lightning wallet by going to '} 
             <Link sx={{ alignItems: 'center'}} href='https://getalby.com/'> GetAlby.com </Link> 
        </Typography>    
        </Box>}
        <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>


          <Button variant='solid' color='danger' onClick={props.onClose}>
            Close
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

export interface ModalProps {
  onClose: () => void;
}