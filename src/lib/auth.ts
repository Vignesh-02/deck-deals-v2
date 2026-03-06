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
        const identifier = credentials.username.trim();
        const user = await User.findOne({
          $or: [{ username: identifier }, { email: identifier.toLowerCase() }],
        });
        if (!user) return null;

        const isValid = await (user as any).verifyPassword(credentials.password);
        if (!isValid) return null;

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in.");
        }

        // Migrate legacy pbkdf2 hash to bcrypt
        await (user as any).migratePassword(credentials.password);

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.email = user.email;
      } else if (token.id && !token.role) {
        // Backfill role/email for older JWT cookies that were issued before
        // role/email claims were added.
        await dbConnect();
        const dbUser = await User.findById(token.id).select("role email").lean();
        if (dbUser) {
          token.role = (dbUser as any).role;
          token.email = (dbUser as any).email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.email = (token.email as string) || session.user.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
