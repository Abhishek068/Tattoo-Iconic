import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Artist Access",
      credentials: {
        securityKey: { label: "Security Key", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.securityKey) return null;
        const expectedSecret = process.env.ARTIST_DASHBOARD_SECRET || "tattoo-iconic-artist-key-2026";
        if (credentials.securityKey === expectedSecret) {
          return {
            id: "jainik-patel",
            email: "Jainik.patel.33@gmail.com",
            name: "Jainik Patel",
            role: "artist",
          };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/artist-access" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  secret: process.env.ARTIST_DASHBOARD_SECRET || "tattoo-iconic-artist-key-2026",
};
