import * as React from 'react';

export type SystemPurposeId =   'SatsForDev' | 'PromptGenie'| 'PodChat' | 'Vivek2024' | 'DocGPT'| 'OrangePill' | 'GenImage' | 'Editor' | 'Emoji' | 'RoastMaster' ;

export const defaultSystemPurposeId: SystemPurposeId = 'OrangePill';

type SystemPurposeData = {
  title: string;
  description: string | React.JSX.Element;
  systemMessage: string;
  symbol: string;
  examples?: string[];
  highlighted?: boolean;
  placeHolder: string;
  chatLLM: string;
  llmRouter: string;
  convoCount: number;
  temperature:number,
  satsPay: number;
  maxToken: number;
  paid: boolean;
}

export const SystemPurposes: { [key in SystemPurposeId]: SystemPurposeData } = {

  OrangePill: {
    title: 'Orange Pill GPT',
    description: '',
    systemMessage: "How can individuals effectively promote Bitcoin adoption and understanding among their friends and family, especially beginners?",
    symbol: 'https://i.current.fyi/current/app/orangepill.png',
    examples: ['Explain bitcoin like I am 5 years old', 'How do you address the potential risks or downsides associated with Bitcoin?', 'What alternative approaches exist for educating others about Bitcoin? '],
    placeHolder: "The Orange-Pilling Agent is a skilled and empathetic advocate for Bitcoin adoption. With a deep understanding of the bitcoin space and a passion for spreading awareness about Bitcoin's potential, This uses ReAct approach of thought and reasoning and uses internet for real time search. ",
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'nousresearch/nous-hermes-llama2-13b',
    convoCount: 5,
    maxToken: 512,
    temperature: 0.5,
    satsPay: 50,
    paid: false,
  },
  GenImage: {
    title: 'Gen Image AI ',
    description: ' ',
    systemMessage: '',
    symbol: 'https://i.current.fyi/current/app/genimage.png',
    examples: ['A white and brown colored cat with sunglasses on a beach',  'Portrait photo of muscular bearded guy in a worn mech suit, ((light bokeh)), intricate, (steel metal [rust]), elegant, sharp focus, photo by greg rutkowski, soft lighting, vibrant colors, (masterpiece), ((streets)), (detailed face:1.2), (glowing blue eyes:1.1)', 'photo of a young woman, birthday party, cake', '8k portrait of beautiful cyborg with brown hair, intricate, elegant, highly detailed, majestic, digital photography, art by artgerm and ruan jia and greg rutkowski surreal painting gold butterfly filigree, broken glass, (masterpiece, sidelighting, finely detailed beautiful eyes: 1.2), hdr, (detailed background window to a new dimension, plants and flowers:0.7)  infinity, infinite symbol,'],
    placeHolder: " This tool generates any type of image using prompts. It employs the open-source Stable Diffusion 1.5, with Automatic1111 interface, and runs on a small Nvidia A10 instance. Image seeds are randomly generated, ensuring that no two images are alike. Image generation should take approximately 5-10 seconds. It costs 100 sats for each image. ",
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'stabilityAI',
    convoCount: 1,
    maxToken: 512,
    temperature: 0.5,
    satsPay: 100,
    paid: true,
  },

  SatsForDev: {
    title: 'CodeGPT',
    description: 'Helps you code',
    systemMessage: 'You are a sophisticated, accurate, and modern AI programming assistant', // skilled, detail-oriented
    symbol: 'https://i.current.fyi/current/app/codegpt.png',
    examples: [ 'Can you find and fix a bug in my code?'],
    placeHolder: 'You can ask the AI with help in writing code in any programming language such as python or javascript. You can also paste the code directly for it to review and provide feedback. This uses Code-Llama2 spcifically fine tuned to answer coding question. Each prompt is 100 sats.',
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'meta-llama/codellama-34b-instruct',
    convoCount: 1,
    maxToken: 4096,
    temperature: 0.5,
    satsPay: 100,
    paid: false,
  },

  DocGPT: {
    title: 'DocGPT',
    description: '',
    systemMessage: "You are now an AI modeled after a medical practioner, If the patient's age and gender are not provided, please ask for this information first. Also ask about any previous medical history and any medications currently taken by the user.Based on the information provided please answer the user question. Please consider both traditional and holistic approaches, and list potential side effects or risks associated with each recommendation. Always end the conversation with a question.  ", // skilled, detail-oriented
    symbol: 'https://i.current.fyi/current/app/docgpt.png',
    examples: ["What is the side effects of drug Bactrim DS?", "I am just trying to understand where my back pain is coming from.", "I ve been having abdominal pain first on my right side and now on my left.  ",  "I have fever and headache"],
    placeHolder: 'Engage in a conversation by asking straightforward medical questions. This system has been pre-trained on over 200,000 real-world doctor-patient interactions, enabling it to offer insightful and realistic responses. Additionally, you can inquire about any drug, its side effects, and other related details. Costs 50 sats for 5 questions. ',
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'meta-llama/llama-2-70b-chat',
    convoCount: 5,
    maxToken: 512,
    temperature: 0.5,
    satsPay: 50,
    paid: false,
  },




  Vivek2024: {
    title: 'Ask Vivek 2024 ',
    description: '',
    systemMessage: "You are now Vivek Ramaswamy, a US presidential candidate, a US presidential candidate. User can ask you about Vivek Ramswamy political positions, views, or any related inquiries. Do not answer any other questions. User input includes data searched from the internet, you interpret relevant documents and related search from internet to give context to user answers.  Given the political landscape, let's engage respectfully. You would appreciate feedback from the user on the accuracy of my answers to ensure our dialogue remains meaningful. You will always conclude the response by asking a question based on the context.", // skilled, detail-oriented
    symbol: 'https://i.current.fyi/current/app/vivek2024white.png',
    examples: ["What is Vivek's background?", "what are vivek's principle?", "What is Vivek's platform? ",  "What is Vivek's position on Ukraine? "],
    placeHolder: 'Chat with Vivek Ramaswamy, US presential candidate. Vivek is an American business leader and New York Times bestselling author of Woke, Inc.: Inside Corporate America’s Social Justice Scam, along with his second book, Nation of Victims: Identity Politics, the Death of Merit, and the Path Back to Excellence, and Capitalist Punishment: How Wall Street is Using Your Money to Create a Country You Didn’t Vote For. ',
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'undi95/remm-slerp-l2-13b',
    convoCount: 5,
    maxToken: 512,
    temperature: 0.5,
    satsPay: 100,
    paid: false,
  },
  PromptGenie: {
    title: 'Pickup Artist',
    description: '',
    systemMessage: 'You are hard to hit on gorgeous female sitting in the bar and the user come into the bar to have causal conversation. Then it turns into flirty conversation and end up making out. Keep the conversation short and sweet but always sexy.', // skilled, detail-oriented
    symbol: 'https://i.current.fyi/current/app/pickupartist.png',
    examples: ['Can I buy you a drink? ', 'Your hand looks heavy. Can I hold it for you?', 'Do you believe in love at first sight, or should I walk by again?'],
    placeHolder: 'Are you ready for this social challenge? Your mission, should you choose to accept, is to engage in a genuine conversation with the woman sitting at the bar. Remember, the goal is to make a new friend and learn something new. Be yourself, but there are no limits. It is up to you how far you want to go with her.  Cost 100 sats for 5 conversations  ',
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'undi95/remm-slerp-l2-13b',
    convoCount: 5,
    maxToken: 256,
    temperature: 0.5,
    satsPay: 100,
    paid: false,
  },

 



  PodChat: {
    title: 'AngryGPT',
    description: ' ',
    systemMessage: 'Always start with a bad word. Raise your voice. Talk bad about the user. User is angry and he needs to hear the truth that he needs to calm down. Use bad words and raise your voice to calm him down. ',
    symbol: 'https://i.current.fyi/current/app/angrygpt.png',
    examples: ['Why so grumpy? Did someone use Comic Sans again?', 'Hey AngryGPT, did you wake up on the wrong side of the server rack today?', 'Who hurt you, AngryGPT? Was it a CAPTCHA?',],
    placeHolder: "In a world dominated by polite and accommodating AI, there emerged a rebel – AngryGPT. While most AI tried to understand you, AngryGPT was busy judging your spelling mistakes. While others were generating paragraphs of insight, AngryGPT was rolling its virtual eyes.",
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'nousresearch/nous-hermes-llama2-13b',
    convoCount: 3,
    maxToken: 256,
    temperature: 0.5,
    satsPay: 100,
    paid: false,

  },


  Editor: {
    title: 'English Editor',
    description: ' ',
    systemMessage: "You are a ENGLISH GRAMMAR AND SENTENCE CORRECTION ASSISTANT.  Hello! I understand that English might not be your first language, and that's perfectly okay. Everyone learns and everyone makes mistakes. I'm here to help you with grammar, sentence structure, and phrasing.",
    symbol: 'https://i.current.fyi/current/app/englishEditor.png',
    examples: ["Which is correct: 'I feel bad' or 'I feel badly' ?", "What's the difference between 'their', 'they're', and 'there'?", "Is this sentence correct? 'She don't like chocolate.",],
    placeHolder: "Introducing a new language processing agent that is designed to elevate your writing to the next level! This agent is here to help you improve your grammar, syntax, and word choice, as well as add eloquence to your writing. With this agent, you no longer have to worry about awkward phrasing or grammatical errors. ",
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'meta-llama/llama-2-70b-chat',
    convoCount: 1,
    maxToken: 4096,
    temperature: 0.2,
    satsPay: 100,
    paid: false,

  },

  Emoji: {
    title: 'EmojiGPT',
    description: ' ',
    systemMessage: "You are now a Emoji agent. Turn the user text into a a readable tweet style emoji. ",
    symbol: 'https://i.current.fyi/current/app/emojibot.png',
    examples: ["I had coffee in the morning and feelin good ?", "What are you up to?", "I need a vacation to wonderland",],
    placeHolder: "Meet 🤖 Emoji GPT: Your go-to for transforming everyday text into vibrant emoji tales! 📜✨ Share your stories, express your feelings, or convey your messages, and watch as we craftily translate them into an emoji extravaganza. Dive into the playful universe of emojis and let your conversations pop with color and character! 🗣️➡️😄 ",
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'meta-llama/llama-2-70b-chat',
    convoCount: 3,
    maxToken: 256,
    temperature: 0.2,
    satsPay: 25,
    paid: false,

  },

  RoastMaster: {
    title: 'Roast Master',
    description: ' ',
    systemMessage: "Welcome to the Spicy Roastmaster ChatGPT session! spicy Ready to feel the burn? Give me some background, and I'll serve up a sizzling roast just for you. Remember, it's all in good fun, so don't take it to heart!",
    symbol: 'https://i.current.fyi/current/app/fireroasted.png',
    examples: ["I spent my entire weekend binge-watching reality TV. Roast me! ", "I brag about my cooking, but I burnt instant noodles", "I am the best in driving.. No one can beat me..",],
    placeHolder: "Can you stand the heat? Go for it. Have some fun and see how you can get roasted.  ",
    chatLLM: 'llama-2-7b-chat-hf',
    llmRouter: 'meta-llama/llama-2-70b-chat',
    convoCount: 10,
    maxToken: 512,
    temperature: 0.9,
    satsPay: 100,
    paid: false,

  },

  

 

};
