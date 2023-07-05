import { apiAsync } from '~/modules/trpc/trpc.client';

import { DLLM } from '../llm.types';
import { OpenAI } from '../openai/openai.types';
import { normalizeSetup, SourceSetupGpt4allAI } from './gpt4all.vendor';


export const hasServerKeyOpenAI = !!process.env.HAS_SERVER_KEY_OPENAI;

export const isValidOpenAIApiKey = (apiKey?: string) => !!apiKey && apiKey.startsWith('sk-') && apiKey.length > 40;


/**
 * This function either returns the LLM response, or throws a descriptive error string
 */
export async function callChat(llm: DLLM, messages: OpenAI.Wire.ChatCompletion.RequestMessage[], maxTokens?: number): Promise<OpenAI.API.Chat.Response> {
  // access params (source)
  const partialSetup = llm._source.setup as Partial<SourceSetupGpt4allAI>;
  const sourceSetupOpenAI = normalizeSetup(partialSetup);

  // model params (llm)
  const openaiLlmRef = llm.options.llmRef!;
  const modelTemperature = llm.options.llmTemperature || 0.5;
  // const maxTokens = llm.options.llmResponseTokens || 1024; // <- note: this would be for chat answers, not programmatic chat calls

  console.log('LLML %o', llm )  
  try {
    return await apiAsync.openai.chatGenerate.mutate({
      access: sourceSetupOpenAI,
      model: { id: openaiLlmRef, temperature: modelTemperature, ...(maxTokens && { maxTokens }) },
      history: messages,
    });
    // errorMessage = `issue fetching: ${response.status} · ${response.statusText}${errorPayload ? ' · ' + JSON.stringify(errorPayload) : ''}`;
  } catch (error: any) {
    const errorMessage = error?.message || error?.toString() || 'OpenAI Chat Fetch Error';
    
    console.error(`callChat: ${errorMessage}`);
    throw new Error(errorMessage);
  }
}