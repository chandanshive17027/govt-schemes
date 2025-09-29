
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma";
export const runtime = "nodejs";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials:{
        email: { label: "Email", type: "email"},
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if(!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if(!user || !user.hashedPassword){
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );
        if(!isValid) {
          throw new Error("Invalid email or password");
        }
        return {
          id: user.id,
          email: user.email ?? "",
          name: user.name ?? "",
          role: user.role ?? "user",
        } as any;
      }
    })
  ],
  callbacks: {

    async jwt({token, user}){
      if (user) {
        token.id = user.id;
        token.role = user.role ;
      }
      return token;
    },

    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async signIn({user, account}){
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where:{
            email: user.email as string,
          }
        });

        if(existingUser){
          user.id = existingUser.id;
          user.role = existingUser.role;
        }else{
          //count user in database
          const userCount = await prisma.user.count();
          user.role = userCount === 0 ? "admin" : "user";

          //create new user
          const newUser = await prisma.user.create({
            data:{
              name: user.name,
              email: user.email as string,
              hashedPassword: "",
              role: user.role,
            }
          });

          user.id = newUser.id;
          user.role = newUser.role;
        }
      }
      return true;
        
    }
    
      
  },
  session:{strategy: "jwt"},
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  }
});