import NextAuth, { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";
import { myAppsApi } from "src/services/whitelabel";
/*const getOptions = (req: any) => {

  return {
    // Configure one or more authentication providers
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_API_KEY || '',
        clientSecret: process.env.TWITTER_API_KEY_SECRET || '',
      }),
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID || '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || ''
      }),
    ],
    callbacks: {
      async signIn({ user, account, credentials }) {
        try {
          await myAppsApi.post('/user-credentials/create-from-auth-callback', { user, provider: account?.provider, credentials }, {
            headers: {
              'Dexkit-Api-Key': `${process.env.MARKETPLACE_API_KEY}`
            }
          })
        } catch (e) {
          console.log('error on signin')
        }
        return true
      },

    }


  } as AuthOptions
}*/


export const authOptions: AuthOptions = {

  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY || '',
      clientSecret: process.env.TWITTER_API_KEY_SECRET || '',
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || ''
    }),

    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, credentials }) {
      try {
        await myAppsApi.post('/user-credentials/create-from-auth-callback', { user, provider: account?.provider, credentials }, {
          headers: {
            'Dexkit-Api-Key': `${process.env.MARKETPLACE_API_KEY}`
          }
        })
      } catch (e) {
        console.log('error on signin')
      }
      return true
    }
  }
}

//xport default (req: any, res: any) => NextAuth(req, res, getOptions(req))
export default NextAuth(authOptions)