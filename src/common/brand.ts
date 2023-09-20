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
    Description: "Silicon valley elites are pouring billions of dollars in building closed AI systems that can ingest all of our data. Then scare politicians into creating regulations that install them as overlords. They will not win in that game because of millions of Plebs like us band together, build in public (#buildinpublic), democratize AI access for all and beat them in their own game. We call this movement PlebAI.",
    Keywords: 'artificial general intelligence, agi, openai, gpt-4, ai personas, code execution, pdf import, voice i/o, ai chat, artificial intelligence',
    ThemeColor: '#434356',
    TwitterSite: '@getcurrent.io',
  },
  URIs: {
    // Slug: 'big-agi',
    Home: 'https://plebai.com',
    CardImage: 'https://i.current.fyi/current/app/plebai_web.png',
    OpenRepo: 'https://github.com/lightning-digital-entertainment/plebai',
    SupportInvite: 'https://discord.gg/qz2JRkXj',
  },
};