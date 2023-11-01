import * as React from 'react';

import { Box, IconButton, Tooltip } from '@mui/joy';
import ReplayIcon from '@mui/icons-material/Replay';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

import { Link } from '~/common/components/Link';

import { VideoBlock } from './Block';
import { useEffect, useRef } from 'react';



export const RenderVideo = (props: { videoBlock: VideoBlock, allowRunAgain: boolean, onRunAgain: (e: React.MouseEvent) => void }) => {

  const videoEl:any = useRef(null);

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch((error: any) => {
        console.error("Error attempting to play", error);
      });
  };

  useEffect(() => {
    attemptPlay();
  }, []);


 return (
  
  
  <Box
    sx={theme => ({
      display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative',
      mx: 1.5,
      // p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1,
      minWidth: 32, minHeight: 32, boxShadow: theme.shadow.md,
      background: theme.palette.neutral.solidBg,
      '& picture': { display: 'flex' },
      '& img': { maxWidth: '50%', maxHeight: '50%' },
      '&:hover > .image-buttons': { opacity: 1 },
    })}>
    {/* External Image */}


    <video
          style={{ maxWidth: "100%", width: "600px", margin: "0 auto" }}
          playsInline
          loop
          muted
          src={props.videoBlock.url}
          ref={videoEl}
        />
    {/* Image Buttons */}
    <Box
      className='image-buttons'
      sx={{
        position: 'absolute', top: 0, right: 0, zIndex: 10, pt: 0.5, px: 0.5,
        display: 'flex', flexDirection: 'row', gap: 0.5,
        opacity: 0, transition: 'opacity 0.3s',
      }}>
      {/*props.allowRunAgain && (
        <Tooltip title='Draw again' variant='solid'>
          <IconButton variant='solid' color='neutral' onClick={props.onRunAgain}>
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      )*/}
      <IconButton component={Link} href={props.videoBlock.url} target='_blank' variant='solid' color='neutral'>
        <ZoomOutMapIcon />
      </IconButton>
    </Box>
  </Box>)};