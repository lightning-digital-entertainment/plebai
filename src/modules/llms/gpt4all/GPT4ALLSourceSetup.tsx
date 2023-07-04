import * as React from 'react';
import { z } from 'zod';

import { Box, Button } from '@mui/joy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SyncIcon from '@mui/icons-material/Sync';

import { apiQuery } from '~/modules/trpc/trpc.client';

import { FormInputKey } from '~/common/components/FormInputKey';
import { Link } from '~/common/components/Link';
import { settingsGap } from '~/common/theme';

import { DLLM, DModelSource, DModelSourceId } from '../llm.types';
import { normalizeSetup, SourceSetupLocalAI } from './gpt4all.vendor';
import { useModelsStore, useSourceSetup } from '../store-llms';


const urlSchema = z.string().url().startsWith('http');


export function GPT4ALLAISourceSetup(props: { sourceId: DModelSourceId }) {

  // external state
  const { normSetup: { hostUrl }, updateSetup, sourceLLMs, source } = useSourceSetup<SourceSetupLocalAI>(props.sourceId, normalizeSetup);

  // validate if url is a well formed proper url with zod
  const { success: isValidHost } = urlSchema.safeParse(hostUrl);
  const shallFetchSucceed = isValidHost;

  const hasModels = !!sourceLLMs.length;

  // fetch models
  const { isFetching, refetch, isError } = apiQuery.openai.listModels.useQuery({ oaiKey: '', oaiHost: hostUrl, oaiOrg: '', heliKey: '', moderationCheck: false }, {
    enabled: true, //!sourceLLMs.length && shallFetchSucceed,
    onSuccess: models => {
      useModelsStore.getState().addLLMs(source?localAIToDLLM(source): []);
    },
    staleTime: Infinity,
  });

  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: settingsGap }}>

    <FormInputKey
      required noKey
      label='Server URL' rightLabel={<Link level='body2' href='https://github.com/go-skynet/LocalAI' target='_blank'>Learn more</Link>}
      placeholder='e.g., http://107.21.5.87:8222'
      value={hostUrl} onChange={value => updateSetup({ hostUrl: value })}
    />

    <Button
      variant='solid' color={isError ? 'warning' : 'primary'}
      disabled={!shallFetchSucceed || isFetching}
      endDecorator={hasModels ? <SyncIcon /> : <FileDownloadIcon />}
      onClick={() => refetch()}
      sx={{ minWidth: 120, ml: 'auto' }}
    >
      Models
    </Button>

  </Box>;
}


export function localAIToDLLM( source: DModelSource): DLLM[] {
  let label = 'gpt4all-lora-q4'
    .replace('ggml-', '')
    .replace('.bin', '')
    .replaceAll('-', ' ');
  // capitalize first letter of each word
  if (label.length)
    label = label.charAt(0).toUpperCase() + label.slice(1);
  // shall we do some heuristics
  const contextTokens = 4096; // FIXME
  return[{
    id: `gpt4all-lora-q4`,
    label,
    created: 0,
    description: 'Local model',
    tags: [], // ['stream', 'chat'],
    contextTokens,
    hidden: false,
    sId: source.id,
    _source: source,
    options: {
      llmRef: `gpt4all-lora-q4`,
      llmTemperature: 0.5,
      llmResponseTokens: 256
    },
  }];
}