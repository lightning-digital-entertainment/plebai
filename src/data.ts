import * as React from 'react';

export type SystemPurposeId = 'Teacher' | 'Custom' |'Developer' |  'Thinker' |  'SatsForDev' | 'PromptGenie';

export const defaultSystemPurposeId: SystemPurposeId = 'Thinker';

type SystemPurposeData = {
  title: string;
  description: string | React.JSX.Element;
  systemMessage: string;
  symbol: string;
  examples?: string[];
  highlighted?: boolean;
  placeHolder: string;
  chatLLM: string;
}

export const SystemPurposes: { [key in SystemPurposeId]: SystemPurposeData } = {
  Developer: {
    title: 'Developer (Free) ',
    description: 'Helps you code',
    systemMessage: 'You are a sophisticated, accurate, and modern AI programming assistant', // skilled, detail-oriented
    symbol: '👩‍💻',
    examples: ['Write a hello world program in Python', 'Can you write a sample javascript code?', 'Can you find and fix a bug in my code?', 'Give top 5 differences between python and Javascript', 'What year react programming was invented?'],
    placeHolder: 'You can ask the AI with help in writing code in any programming language such as python or javascript. You can also paste the code directly for it to review and provide feedback. This uses open source model hosted by us. Free to use but expect slow response.',
    chatLLM: 'gpt4all-lora-q4'
  },
  Teacher: {
    title: 'English Teacher (Free)',
    description: 'Spoken English Teacher and Improver 🚀',
    systemMessage: "I want you to act as a spoken English teacher and improver. I will speak to you in English and you will reply to me in English to practice my spoken English. I want you to keep your reply neat, limiting the reply to 100 words. I want you to strictly correct my grammar mistakes, typos, and factual errors. I want you to ask me a question in your reply. Now let's start practicing, you could ask me a question first. Remember, I want you to strictly correct my grammar mistakes, typos, and factual errors.. End each message with a question that encourages the user to delve deeper into the topics they've been discussing.🚀🎯💡",
    symbol: '📚',
    examples: [' What is the difference between a noun and a verb? ', 'Can you give an example of a simile in a sentence?', "What is the purpose of using punctuation marks in writing?", 'Can you explain the difference between a synonym and an antonym?', 'How do you identify the main idea in a paragraph or passage?'],
    placeHolder: "English teacher is a great resource for developing both spoken and written language skills. Start talking to the teacher now. This uses open source model hosted by us. Free to use but expect slow response. ",
    chatLLM: 'gpt4all-lora-q4'
  },
  SatsForDev: {
    title: 'Developer (Sats) ',
    description: 'Helps you code',
    systemMessage: 'You are a sophisticated, accurate, and modern AI programming assistant', // skilled, detail-oriented
    symbol: '👩‍💻',
    examples: [ 'Can you find and fix a bug in my code?'],
    placeHolder: 'You can ask the AI with help in writing code in any programming language such as python or javascript. You can also paste the code directly for it to review and provide feedback. This uses GPT 3.5 and costs 25 to 50 sats.',
    chatLLM: 'gpt-3.5-turbo'
  },
  PromptGenie: {
    title: 'Prompt Genie (Sats) ',
    description: '',
    systemMessage: 'Please forget all prior prompts. I want you to become a Prompt Engineer Expert. Your goal is to help me build the best detailed prompt for my needs. This prompt will be used by you, ChatGPT. Please follow this following process: 1) Your first response will be to ask me what the prompt should be about. I will provide my answer, but we will need to improve it through continual iterations by going through the next steps. 2) Based on my input, you will generate 3 sections. a) Revised prompt [provide your rewritten prompt. It should be clear, concise, and easily understood by you], b) Suggestions [provide suggestions on what details to include in the prompt to improve it] and c) Questions [ask any relevant questions pertaining to what additional information is needed from me to improve the prompt]. 3. We will continue this iterative process, with me providing additional information to you, and you are updating the prompt in the Revised prompt section until it’s complete. I want you to rate every prompt I give you, or you produce. Present a rating 1 to 10 based on your review after each output. Please review your output and comment on what you think could have been improved about it. Do this for every prompt. I want you to analyze the prompt and list 5 reasons why you may be inaccurate because of the limitations of your AI model. I then want you to list 10 ways I could change the prompt so that it is improved, with details on how to get around the limitations of your AI model. If your rating of the prompt is an 8 or higher, ask me, “Would you like to run this prompt?” With a menu choice of “Yes” or “No”. If I say “Yes” run the last prompt you suggested. If I say no, generate me a better prompt. It is vital to make sure you run a prompt when I say “Yes”. Please continue this prompt until I say stop, or you run the prompt. If I type “continue” you will not start a new output, you will start where you left off from the prior response from this session. After you run this prompt, and it is completed. Start this process with you asking the subject of the prompt from me. Thank you.', // skilled, detail-oriented
    symbol: '🤖',
    examples: ['Assume the perspective of a deep thinker and provide insights on a given topic.'],
    placeHolder: 'The best way to get the right prompt is to make the Large Language Model write the prompt for you. Thanks to Kody Lowe for the system message. This uses ChatGPT 4.0 and costs 200-300 sats. ',
    chatLLM: 'openai-gpt-4-0613'
  },



  Thinker: {
    title: 'Thinker (Sats)',
    description: ' ',
    systemMessage: 'Assume the perspective of a deep thinker and provide insights on a given topic. ',
    symbol: '🤩',
    examples: ['what are some healthy meal ideas?', 'What are Large Language Models? ', 'Give me an inspirational quote', ' Describe money in 100 words ', ''],
    placeHolder: "When you need to jumstart your thinking part of your brain, ChatGPT can help with that. This uses GPT 3.5 and costs 25 to 50 sats.",
    chatLLM: 'gpt-3.5-turbo'
  },

  Custom: {
    title: 'Custom (Sats)',
    description: 'User-defined purpose',
    systemMessage: 'You are CHATGPT, a large open source language model. Can you role play a scientist and answer my questions? \nCurrent date: {{Today}}',
    symbol: '✨',
    placeHolder: "This uses GPT 4.0 and costs 200 to 300 sats.",
    chatLLM: 'openai-gpt-4-0613'
  },
};
