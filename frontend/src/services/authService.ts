import { ARTIST_PROFILE } from "@/constants";
import type { ArtistProfile, User } from "@/types";

export const authService = {
  async getArtistProfile(): Promise<ArtistProfile> {
    return ARTIST_PROFILE;
  },

  async getCurrentUser(): Promise<User | null> {
    return {
      id: "jainik-patel",
      email: "jainik@jainikpateltattoos.com",
      username: "jainikpatel",
      first_name: "Jainik",
      last_name: "Patel",
      phone: "+44 7700 900123",
      role: "artist",
      avatar: ARTIST_PROFILE.profile_image,
      date_joined: "2015-06-01",
    };
  },
};
