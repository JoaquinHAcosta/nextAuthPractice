import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { signInSchema } from './src/lib/zod'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },

      async authorize(credentials) {
        let user = null

        // validate credentials
        const parsedCredentials = signInSchema.safeParse(credentials)
        if (!parsedCredentials.success) {
          console.error('Invalid credentials:', parsedCredentials.error.errors)
          return null
        }
        // get user

        user = {
          id: '1',
          name: 'Aditya Singh',
          email: 'jojo@jojo.com',
          role: 'admin',
        }

        if (!user) {
          console.log('Invalid credentials')
          return null
        }

        return user
      },
    }),
  ],

  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user

      const { pathname } = nextUrl

      if (pathname.startsWith('/auth/signin') && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl))
      }

      return !!auth
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as string
      }
      return token
    },

    session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role

      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
})
