import * as React from 'react';

import { Box, FormControl, FormHelperText, FormLabel, Slider } from '@mui/joy';
import { settingsCol1Width, settingsGap } from '~/common/theme';

import { DLLM } from '../llm.types';
import { LLMOptionsOpenAI, normalizeOAIOptions } from './gpt4all.vendor';
import { useModelsStore } from '../store-llms';


export function GPT4LLMOptions(props: { llm: DLLM }) {

  // external state
  const updateLLMOptions = useModelsStore(state => state.updateLLMOptions<LLMOptionsOpenAI>);

  const { id: llmId } = props.llm;
  const { llmResponseTokens, llmTemperature } = normalizeOAIOptions(props.llm.options);

  const maxValue = props.llm.contextTokens > 1024 ? Math.round(props.llm.contextTokens / 2) : 4096;

  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: settingsGap }}>

    <FormControl orientation='horizontal' sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ minWidth: settingsCol1Width }}>
        <FormLabel>Temperature</FormLabel>
        <FormHelperText>{llmTemperature < 0.33 ? 'More strict' : llmTemperature > 0.67 ? 'Larger freedom' : 'Creativity'}</FormHelperText>
      </Box>
      <Slider
        aria-label='Model Temperature' color='neutral'
        min={0} max={1} step={0.1} defaultValue={0.5}
        value={llmTemperature} onChange={(event, value) => updateLLMOptions(llmId, { llmTemperature: value as number })}
        valueLabelDisplay='auto'
        sx={{ py: 1, mt: 1.1 }}
      />
    </FormControl>

    <FormControl orientation='horizontal' sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ minWidth: settingsCol1Width }}>
        <FormLabel>Output Tokens</FormLabel>
        <FormHelperText>Reduces input</FormHelperText>
      </Box>
      <Slider
        aria-label='Model Max Tokens' color='neutral'
        min={0} max={maxValue} step={256} defaultValue={256}
        value={llmResponseTokens} onChange={(event, value) => updateLLMOptions(llmId, { llmResponseTokens: value as number })}
        valueLabelDisplay='on'
        sx={{ py: 1, mt: 1.1 }}
      />
    </FormControl>

  </Box>;
}