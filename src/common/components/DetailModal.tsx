import * as React from 'react';

import { Box, Button, Modal, ModalClose, ModalDialog, ModalOverflow, Typography } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';


/**
 * Base for out Modal components (Preferences, Models Setup, etc.)
 */
export function DetailModal(props: { title: string | React.JSX.Element, open: boolean, onClose: () => void, startButton?: React.JSX.Element, sx?: SxProps, children: React.ReactNode }) {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <ModalOverflow>
        <ModalDialog
            sx={{
              minWidth: { xs: 360, sm: 500, md: 600, lg: 700 },
              maxWidth: 700,
              alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 3,
              ...props.sx,
            }}>

          <Box sx={{ mb: -1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography level='body-lg'>
              {props.title}
              <ModalClose sx={{ position: 'right', mr: -1 }} />
            </Typography>
            
          </Box>

          {props.children}

          <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
          </Box>


        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
