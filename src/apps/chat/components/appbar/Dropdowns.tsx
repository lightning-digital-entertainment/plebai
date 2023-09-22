import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Avatar, Box, Button,ListItemButton, ListItemDecorator, Typography } from '@mui/joy';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import SettingsIcon from '@mui/icons-material/Settings';

import { DLLMId } from '~/modules/llms/llm.types';
import { SystemPurposeId, SystemPurposes } from '../../../../apps/chat/components/composer/Composer';
import { useModelsStore } from '~/modules/llms/store-llms';

import { AppBarDropdown, DropdownItems } from '~/common/layouts/appbar/AppBarDropdown';
import { useChatStore } from '~/common/state/store-chats';
import { useUIPreferencesStore, useUIStateStore } from '~/common/state/store-ui';
import { Link } from '~/common/components/Link';


export function Dropdowns(props: {
  conversationId: string | null
}) {

  // external state
  const { chatLLMId, setChatLLMId, llms } = useModelsStore(state => ({
    chatLLMId: state.chatLLMId,
    setChatLLMId: state.setChatLLMId,
    llms: state.llms,
  }), shallow);

  const { zenMode } = useUIPreferencesStore(state => ({ zenMode: state.zenMode }), shallow);
  const { topNewConversationId, setActiveConversationId, createConversation } = useChatStore(state => {
    const conversation = state.conversations.find(conversation => conversation.id === props.conversationId);
    return {
      systemPurposeId: conversation?.systemPurposeId ?? null,
      setSystemPurposeId: state.setSystemPurposeId,
      topNewConversationId: state.conversations.length ? state.conversations[0].messages.length === 0 ? state.conversations[0].id : null : null,
       setActiveConversationId: state.setActiveConversationId,
       createConversation: state.createConversation,
    };
  }, shallow);
  const { openLLMOptions, openModelsSetup } = useUIStateStore(state => ({
    openLLMOptions: state.openLLMOptions, openModelsSetup: state.openModelsSetup,
  }), shallow);

  const handleChatModelChange = (event: any, value: DLLMId | null) =>
    value && props.conversationId && setChatLLMId(value);

  const handleNew = () => {
    // if the first in the stack is a new conversation, just activate it
    if (topNewConversationId)
      setActiveConversationId(topNewConversationId);
    else
      createConversation();

  };  

  const handleOpenLLMOptions = () => chatLLMId && openLLMOptions(chatLLMId);

  // filter-out hidden models
  const llmItems: DropdownItems = {};
  for (const llm of llms)
    if (!llm.hidden || llm.id === chatLLMId)
      llmItems[llm.id] = { title: llm.label };

  return <>
           <Button  variant='plain' disabled={!!topNewConversationId && topNewConversationId === props.conversationId}  onClick={handleNew}  sx={{
               mt: 0,
               fontSize: 24,
               fontWeight: 500,
               color:'white', 

                alignItems: 'center', gap: 0,
               justifyContent: 'center',
             }} >  
                PlebAI
            
                </Button>  
            
  
  </>;
}
