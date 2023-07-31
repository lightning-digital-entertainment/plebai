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


export interface SourceSetupGpt4allAI {
  oaiKey: string;
  oaiOrg: string;
  oaiHost: string;  // use OpenAI-compatible non-default hosts (full origin path)
  heliKey: string;  // helicone key (works in conjunction with oaiHost)
  moderationCheck: boolean;
  hostUrl: string;
}

export function normalizeOAIOptions(partialOptions?: Partial<LLMOptionsOpenAI>): LLMOptionsOpenAI {
  return {
    llmRef: 'llama-2-7b-chat-hf',
    llmTemperature: 0.2,
    llmResponseTokens: 256,
    llmPresence_penalty:0,
    ...partialOptions,
  };
}


export interface LLMOptionsOpenAI {
  llmRef: string;
  llmTemperature: number;
  llmResponseTokens: number;
  llmPresence_penalty:0;

}

export function normalizeSetup(partialSetup?: Partial<SourceSetupGpt4allAI>): SourceSetupGpt4allAI {
  return {
    oaiKey: '',
    oaiOrg: '',
    oaiHost: '',
    heliKey: '',
    moderationCheck: false,
    hostUrl: process.env.GPT4ALL_API_HOST + '/v1/models' || 'https://api.openai.com/v1/models',
    ...partialSetup,
  };
}