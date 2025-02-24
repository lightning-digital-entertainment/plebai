import * as React from 'react';

import { Box, Button, ListItem, SvgIcon, useTheme, Divider } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import HomeIcon from '@mui/icons-material/TempleBuddhist';
import ShareIcon from '@mui/icons-material/Share';
import { Brand } from '../../brand';
import { Link } from '../../components/Link';
import { cssRainbowColorKeyframes } from '../../theme';

import { EmailIcon, EmailShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";


// missing from MUI, using Tabler for Discord
function DiscordIcon(props: { sx?: SxProps }) {
  return <SvgIcon viewBox='0 0 24 24' width='24' height='24' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
    <path d='M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.94 0 -2.257 -1.596 -2.777 -2.969l-.02 .005c.838 -.131 1.69 -.323 2.572 -.574a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.725 .207 1.431 .373 2.126 .499l.444 .074c-.477 1.37 -1.695 2.965 -2.627 2.965c-1.743 0 -3.276 -1.555 -4.267 -3.644c-.841 -2.206 -.369 -6.868 1.414 -12.174a1 1 0 0 1 .358 -.49c1.392 -1.016 2.807 -1.475 4.717 -1.685a1 1 0 0 1 .938 .435l.063 .107l.652 1.288l.16 -.019c.877 -.09 1.718 -.09 2.595 0l.158 .019l.65 -1.287a1 1 0 0 1 .754 -.54l.123 -.01zm-5.983 6a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z' strokeWidth='0' fill='currentColor'></path>
  </SvgIcon>;
}

function BringTheLove(props: { text: string, link: string, icon: React.JSX.Element }) {
  const [loved, setLoved] = React.useState(false);
  const icon = loved ? '❤️' : props.icon; // '❤️' : '🤍';
  return <Button
    color='neutral'
    component={Link} noLinkStyle href={props.link} target='_blank'
    onClick={() => setLoved(true)}
    endDecorator={icon}
    sx={{
      background: 'transparent',
      // '&:hover': { background: props.theme.palette.neutral.solidBg },
      '&:hover': { animation: `${cssRainbowColorKeyframes} 5s linear infinite` },
    }}>
    {props.text}
  </Button>;
}


export function SupportMenuItem() {
  const theme = useTheme();
  const fadedColor = theme.palette.neutral.plainDisabledColor;
  const iconColor = '';
  return (
    <ListItem
      variant='solid' color='neutral'
      sx={{
        mb: -1, // absorb the bottom margin of the list
        mt: 1,
        // background: theme.palette.neutral.solidActiveBg,
        display: 'flex', flexDirection: 'column', gap: 1,
        justifyContent: 'space-between',
      }}>

    <BringTheLove text='Share' icon={<ShareIcon sx={{ color: iconColor }} />} link={'https://chat.plebai.com/'} />
    <Box sx={{ display: 'flex' , justifyContent: 'center',gap: 2, }}>
  
      <EmailShareButton
            url={Brand.URIs.Home}
            subject={Brand.Meta.Title}
            body={Brand.Meta.Description}
            className="Demo__some-network__share-button"
          >
            <EmailIcon size={32} round />
      </EmailShareButton>
      <LinkedinShareButton url={Brand.URIs.Home} summary= {Brand.Meta.Description} className="Demo__some-network__share-button">
            <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <TwitterShareButton
            url={Brand.URIs.Home}
            title={Brand.Meta.Description}
            className="Demo__some-network__share-button"
          >
            <TwitterIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton
            url={Brand.URIs.Home}
            title={Brand.Meta.Description}
            separator=":: "
            className="Demo__some-network__share-button"
          >
            <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      </Box>
      <Divider />

      <Box sx={{ display: 'flex'   }}>
      
          <BringTheLove text='PlebAI' icon={<HomeIcon sx={{ color: iconColor }} />} link={'https://plebai.com'} />
          <BringTheLove text='Discord' icon={<DiscordIcon sx={{ color: iconColor }} />} link={Brand.URIs.SupportInvite} />
          <BringTheLove text='GitHub' icon={<GitHubIcon sx={{ color: iconColor }} />} link={Brand.URIs.OpenRepo} />
      </Box>
    </ListItem>

    
  );
}