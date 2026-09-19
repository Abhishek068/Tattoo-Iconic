import axios from "axios";
import { ARTIST_PROFILE } from "@/constants";
import type { ArtistProfile, User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const authService = {
  async getArtistProfile(): Promise<ArtistProfile> {
    return ARTIST_PROFILE;
  },

  async login(usernameOrEmail: string, password: string): Promise<{ access: string; refresh: string; user: User }> {
    const res = await axios.post(`${API_URL}/auth/login/`, {
      username: usernameOrEmail,
      password: password,
    });
    if (res.data.access && typeof window !== "undefined") {
      localStorage.setItem("access_token", res.data.access);
      if (res.data.refresh) {
        localStorage.setItem("refresh_token", res.data.refresh);
      }
    }
    return res.data;
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const res = await axios.get(`${API_URL}/auth/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        id: String(res.data.id),
        email: res.data.email,
        username: res.data.username,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        phone: "+91 8238767100",
        role: res.data.role || "artist",
        avatar: ARTIST_PROFILE.profile_image,
        date_joined: "2015-06-01",
      };
    } catch {
      return null;
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },
};
