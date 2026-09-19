import { create } from "zustand";

interface UIState {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  lightboxOpen: boolean;
  lightboxIndex: number;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  lightboxOpen: false,
  lightboxIndex: 0,
  openLightbox: (index) => set({ lightboxOpen: true, lightboxIndex: index }),
  closeLightbox: () => set({ lightboxOpen: false }),
}));
