/**
 * Application Identity (Brand)
 *
 * Also note that the 'Brand' is used in the following places:
 *  - README.md             all over
 *  - package.json          app-slug and version
 *  - public/manifest.json  name, short_name, description, theme_color, background_color
 */
export const Brand = {
  // Name: 'big-AGI',
  // UpperName: 'BIG-AGI',
  Title: {
    Common: (process.env.NODE_ENV === 'development' ? '[DEV] ' : '') + 'PlebAI',
  },
  Meta: {
    SiteName: 'PlebAI',
    Title: 'PlebAI: Plebs version of chatGPT',
    Description: "Big techs are pouring billions into building closed source AI models, to keep everyone under lock and key. Yet, the true evolution of AI will come not from walled gardens, but from the open collaboration of plebs worldwide. Plebs will #buildinpublic and beat them at their own game. We built an AI Chatbot that relies solely on open-source large Language Models (LLMs). Check it out.",
    Keywords: 'artificial general intelligence, agi, openai, gpt-4, ai personas, code execution, pdf import, voice i/o, ai chat, artificial intelligence',
    ThemeColor: '#434356',
    TwitterSite: '@getcurrent.io',
  },
  URIs: {
    // Slug: 'big-agi',
    Home: 'https://plebai.com',
    CardImage: 'https://i.current.fyi/current/app/plebai_web.png',
    OpenRepo: 'https://github.com/lightning-digital-entertainment/plebai',
    SupportInvite: 'https://t.me/+1NhSTfdwv1M2MTky',
  },
};