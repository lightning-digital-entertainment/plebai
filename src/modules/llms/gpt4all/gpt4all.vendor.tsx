import DevicesIcon from '@mui/icons-material/Devices';

import { GPT4ALLAISourceSetup } from './GPT4ALLSourceSetup';
import { ModelVendor } from '../llm.types';
import { GPT4LLMOptions } from './GPT4LLMOptions';
import { callChat } from '../openai/openai.client';



export const ModelVendorGpt4AllAI: ModelVendor = {
  id: 'gpt4allloraq4',
  name: 'GPT4ALL Lora Q4',
  rank: 20,
  location: 'local',
  instanceLimit: 1,

  // components
  Icon: DevicesIcon,
  SourceSetupComponent: GPT4ALLAISourceSetup,
  LLMOptionsComponent: GPT4LLMOptions,

  // functions
  //callChat: () => Promise.reject(new Error('LocalAI is not implemented')),
  callChat: callChat,
};


export interface SourceSetupLocalAI {
  hostUrl: string;
}

export function normalizeOAIOptions(partialOptions?: Partial<LLMOptionsOpenAI>): LLMOptionsOpenAI {
  return {
    llmRef: 'gpt4all-lora-q4',
    llmTemperature: 0.5,
    llmResponseTokens: 128,
    ...partialOptions,
  };
}

export interface LLMOptionsOpenAI {
  llmRef: string;
  llmTemperature: number;
  llmResponseTokens: number;
}

export function normalizeSetup(partialSetup?: Partial<SourceSetupLocalAI>): SourceSetupLocalAI {
  return {
    hostUrl: 'https://api.openai.com/v1/models',
    ...partialSetup,
  };
}