import { ARTIST_PROFILE } from "@/constants";
import type { ArtistProfile, User } from "@/types";

export const artistAuthService = {
  async getArtistProfile(): Promise<ArtistProfile> {
    return ARTIST_PROFILE;
  },

  async loginWithSecurityKey(securityKey: string): Promise<{ success: boolean; message?: string; redirect?: string }> {
    try {
      const res = await fetch("/api/artist/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ securityKey }),
      });

      const data = await res.json();
      return data;
    } catch {
      return {
        success: false,
        message: "Failed to connect to authentication service.",
      };
    }
  },

  async logout(): Promise<boolean> {
    try {
      const res = await fetch("/api/artist/logout", { method: "POST" });
      const data = await res.json();
      return data.success ?? true;
    } catch {
      return false;
    }
  },

  async getCurrentUser(): Promise<User> {
    return {
      id: "jainik-patel",
      email: ARTIST_PROFILE.email,
      username: "jainikpatel",
      first_name: "Jainik",
      last_name: "Patel",
      phone: ARTIST_PROFILE.phone,
      role: "artist",
      avatar: ARTIST_PROFILE.profile_image,
      date_joined: "2015-06-01",
    };
  },
};

export const authService = artistAuthService;
