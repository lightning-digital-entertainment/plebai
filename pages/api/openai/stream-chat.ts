import { NextRequest, NextResponse } from 'next/server';
import { createParser } from 'eventsource-parser';

import { ChatGenerateSchema, chatGenerateSchema, openAIAccess, openAICompletionRequest } from '~/modules/llms/openai/openai.router';
import { OpenAI } from '~/modules/llms/openai/openai.types';
import { gpt4allAccess } from '~/modules/llms/gpt4all/gpt4all.router';


async function rethrowOpenAIError(response: Response) {
  if (!response.ok) {
    let errorPayload: object | null = null;
    try {
      errorPayload = await response.json();
    } catch (e) {
      // ignore
    }
    throw new Error(`${response.status} · ${response.statusText}${errorPayload ? ' · ' + JSON.stringify(errorPayload) : ''}`);
  }
}


async function chatStreamRepeater(access: ChatGenerateSchema['access'], model: ChatGenerateSchema['model'], history: ChatGenerateSchema['history'], signal: AbortSignal): Promise<ReadableStream> {

  // Handle the abort event when the connection is closed by the client
  signal.addEventListener('abort', () => {
    console.log('Client closed the connection.');
  });

  // begin event streaming from the OpenAI API
  let upstreamResponse: Response;
  try {

    // prepare request objects

    
   
    const { headers, url } = llmAccess(model.id, access, '/v1/chat/completions')

    console.log('Model: %o', model)

    const body: OpenAI.Wire.ChatCompletion.Request = openAICompletionRequest(model, history, true);

    console.log('oAI url %o', url)
    console.log('oAI headers %o', headers)
    console.log('oAI body %o', JSON.stringify(body))

    // perform the request
    upstreamResponse = await fetch(url, { headers, method: 'POST', body: JSON.stringify(body), signal });
    await rethrowOpenAIError(upstreamResponse);

  } catch (error: any) {
    console.log(error);
    const message = '[OpenAI Issue] ' + (error?.message || typeof error === 'string' ? error : JSON.stringify(error)) + (error?.cause ? ' · ' + error.cause : '');
    
    throw new Error(message);
  }

  function llmAccess(modelId: string, access: ChatGenerateSchema['access'], link: string): any {

        console.log('model ID: %o', modelId)
        if (modelId === 'llama-2-7b-chat-hf') {
            return gpt4allAccess(access, link)

        }
        else {
            return openAIAccess(access, link)

        }

  }


  // decoding and re-encoding loop
  async function onReadableStreamStart(controller: ReadableStreamDefaultController) {

    let hasBegun = false;
    const textEncoder = new TextEncoder();

    // stream response (SSE) from OpenAI is split into multiple chunks. this function
    // will parse the event into a text stream, and re-emit it to the client
    const upstreamParser = createParser(event => {

      // ignore reconnect interval
      if (event.type !== 'event')
        return;

      // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
      if (event.data === '[DONE]') {
        controller.close();
        return;
      }

      try {
        const json: OpenAI.Wire.ChatCompletion.ResponseStreamingChunk = JSON.parse(event.data);

        // handle errors here
        if (json.error) {
          // suppress this new error that popped up on 2023-06-19
          if (json.error.message !== 'The server had an error while processing your request. Sorry about that!')
            console.error('stream-chat: unexpected error from upstream', json.error);
          controller.enqueue(textEncoder.encode(`[OpenAI Issue] ${json.error.message}`));
          controller.close();
          return;
        }

        // ignore any 'role' delta update
        if (json.choices[0].delta?.role && !json.choices[0].delta?.content)
          return;

        // stringify and send the first packet as a JSON object
        if (!hasBegun) {
          hasBegun = true;
          const firstPacket: OpenAI.API.Chat.StreamingFirstResponse = {
            model: json.model,
          };
          controller.enqueue(textEncoder.encode(JSON.stringify(firstPacket)));
        }

        // transmit the text stream
        const text = json.choices[0].delta?.content || '';
        controller.enqueue(textEncoder.encode(text));

        // Workaround: LocalAI doesn't send the [DONE] event, but similarly to OpenAI, it sends a "finish_reason" delta update
        if (json.choices[0].finish_reason) {
          controller.close();
          return;
        }

      } catch (error) {
        // maybe parse error
        console.error('stream-chat: error parsing chunked response', error, event);
        controller.error(error);
      }
    });

    // https://web.dev/streams/#asynchronous-iteration
    const decoder = new TextDecoder();
    for await (const upstreamChunk of upstreamResponse.body as any)
      upstreamParser.feed(decoder.decode(upstreamChunk, { stream: true }));
  }

  return new ReadableStream({
    start: onReadableStreamStart,
    cancel: (reason) => console.log('chatStreamRepeater cancelled', reason),
  });
}


export default async function handler(req: NextRequest): Promise<Response> {
  try {
    const { access, model, history } = chatGenerateSchema.parse(await req.json());
    console.log('history: %o', history)

    const chatResponseStream: ReadableStream = await chatStreamRepeater(access, model, history, req.signal);
    return new NextResponse(chatResponseStream);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Fetch request aborted in handler');
      return new NextResponse('Request aborted by the user.', { status: 499 }); // Use 499 status code for client closed request
    } else if (error.code === 'ECONNRESET') {
      console.log('Connection reset by the client in handler');
      return new NextResponse('Connection reset by the client.', { status: 499 }); // Use 499 status code for client closed request
    } else {
      console.error('api/openai/stream-chat error:', error);
      return new NextResponse(`[Issue] ${error}`, { status: 400 });
    }
  }
}

// noinspection JSUnusedGlobalSymbols
export const config = { runtime: 'edge' };