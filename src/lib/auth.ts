import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "../models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        await dbConnect();
        const user = await User.findOne({ username: credentials.username });
        if (!user) return null;

        const isValid = await (user as any).verifyPassword(credentials.password);
        if (!isValid) return null;

        // Migrate legacy pbkdf2 hash to bcrypt
        await (user as any).migratePassword(credentials.password);

        return {
          id: user._id.toString(),
          name: user.username,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
