import NextAuth, { type DefaultSession } from "next-auth";
import Google from "@auth/core/providers/google";
import EmailProvider from "@auth/core/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google,
    EmailProvider({
      from: process.env.EMAIL_FROM || "noreply@example.com",
      server: process.env.EMAIL_SERVER_HOST ? {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASSWORD || ""
        }
      } : {
        host: "localhost",
        port: 587,
        auth: { user: "dev", pass: "dev" }
      },
      // Simple numeric token (6-digit). Stored in VerificationToken table.
      generateVerificationToken: async () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      },
      // If RESEND_API_KEY is present, send via Resend; otherwise log to server.
      async sendVerificationRequest({ identifier, url, token, provider }) {
        const code = token;
        if (process.env.RESEND_API_KEY) {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: provider.from ?? process.env.EMAIL_FROM ?? "no-reply@example.com",
            to: identifier,
            subject: "Your DriftWatch verification code",
            text: `Your verification code is ${code}. It expires in 10 minutes.`
          });
        } else if (process.env.EMAIL_SERVER_HOST) {
          const nodemailer = await import("nodemailer");
          const transport = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT || 587),
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD
            }
          });
          await transport.sendMail({
            to: identifier,
            from: provider.from ?? process.env.EMAIL_FROM ?? "no-reply@example.com",
            subject: "Your DriftWatch verification code",
            text: `Your verification code is ${code}. It expires in 10 minutes.`
          });
        } else {
          // Dev mode: log verification code to console
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log("[Auth.js] Verification code for", identifier, "=>", code);
          }
        }
      }
    })
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify"
  },
});
