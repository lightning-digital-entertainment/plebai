import * as React from 'react';

import { Box, Button, Divider, Link, Modal, ModalDialog, Typography } from '@mui/joy';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Image from 'next/image';


/**
 * A confirmation dialog (Joy Modal)
 * Pass the question and the positive answer, and get called when it's time to close the dialog, or when the positive action is taken
 */
export function NoWebLnModal(props: { open: boolean, onClose: () => void, confirmationText: string }) {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalDialog variant='outlined' color='neutral'  sx={{
            minWidth: { xs: 180, sm: 250, md: 300, lg: 350 },
            maxWidth: 700,
            alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 3,
          }}>

        <Typography component='h2' startDecorator={<WarningRoundedIcon />}>
          Error
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography>
          {'To pay using SATS, you need to enable lightning wallet on your browser.'} 
          
        </Typography>

        <Image src='/icons/alby-logo.png' alt='App Logo' width={250} height={88} />
     
        <Link href='https://getalby.com/'> https://getalby.com/ </Link> 
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