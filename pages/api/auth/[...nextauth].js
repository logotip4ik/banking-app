import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  secret: process.env.GLOBAL_SECRET,
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV !== 'production',
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  logger: {
    debug: (msg) => console.debug(msg),
    error: (msg) => console.warn(msg),
    warn: (msg) => console.info(msg),
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
