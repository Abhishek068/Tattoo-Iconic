import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher, postData, patchData, deleteData, uploadFile } from "@/lib/api";
import type {
  ArtistProfile, Appointment, Availability, BlogPost,
  FlashDesign, PaginatedResponse, PortfolioItem, Review, User,
} from "@/types";

// ── Auth ──
export const useCurrentUser = () =>
  useQuery<User>({ queryKey: ["me"], queryFn: () => fetcher("/auth/me/"), retry: false, staleTime: 5 * 60_000 });

// ── Artists ──
export const useArtists = () =>
  useQuery<ArtistProfile[]>({ queryKey: ["artists"], queryFn: () => fetcher("/auth/artists/"), staleTime: 10 * 60_000 });

export const useArtist = (id: string) =>
  useQuery<ArtistProfile>({ queryKey: ["artist", id], queryFn: () => fetcher(`/auth/artists/${id}/`), enabled: !!id });

// ── Portfolio ──
export const usePortfolio = (params?: Record<string, string>) => {
  const qs = new URLSearchParams(params).toString();
  return useQuery<PaginatedResponse<PortfolioItem>>({
    queryKey: ["portfolio", params],
    queryFn: () => fetcher(`/portfolio/${qs ? `?${qs}` : ""}`),
  });
};

export const usePortfolioItem = (id: string) =>
  useQuery<PortfolioItem>({ queryKey: ["portfolio", id], queryFn: () => fetcher(`/portfolio/${id}/`), enabled: !!id });

export const useFeaturedPortfolio = () =>
  useQuery<PortfolioItem[]>({ queryKey: ["portfolio", "featured"], queryFn: () => fetcher("/portfolio/featured/"), staleTime: 10 * 60_000 });

export const useUploadPortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => uploadFile<PortfolioItem>("/portfolio/", form),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
};

export const useDeletePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteData(`/portfolio/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
};

// ── Appointments ──
export const useAppointments = (params?: Record<string, string>) => {
  const qs = new URLSearchParams(params).toString();
  return useQuery<PaginatedResponse<Appointment>>({
    queryKey: ["appointments", params],
    queryFn: () => fetcher(`/bookings/appointments/${qs ? `?${qs}` : ""}`),
  });
};

export const useAppointment = (id: string) =>
  useQuery<Appointment>({ queryKey: ["appointment", id], queryFn: () => fetcher(`/bookings/appointments/${id}/`), enabled: !!id });

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => postData<Appointment>("/bookings/appointments/", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

export const useUpdateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      patchData<Appointment>(`/bookings/appointments/${id}/`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

export const useCancelAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postData(`/bookings/appointments/${id}/cancel/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

// ── Availability ──
export const useAvailability = (artistId: string) =>
  useQuery<Availability[]>({ queryKey: ["availability", artistId], queryFn: () => fetcher(`/bookings/availability/?artist_id=${artistId}`), enabled: !!artistId });

// ── Reviews ──
export const useReviews = (artistId?: string) => {
  const url = artistId ? `/bookings/reviews/?appointment__artist=${artistId}` : "/bookings/reviews/";
  return useQuery<PaginatedResponse<Review>>({ queryKey: ["reviews", artistId], queryFn: () => fetcher(url) });
};

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { appointment: string; rating: number; comment: string }) => postData<Review>("/bookings/reviews/", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
};

// ── Blog ──
export const useBlogPosts = () =>
  useQuery<PaginatedResponse<BlogPost>>({ queryKey: ["blog"], queryFn: () => fetcher("/blog/") });

export const useBlogPost = (slug: string) =>
  useQuery<BlogPost>({ queryKey: ["blog", slug], queryFn: () => fetcher(`/blog/${slug}/`), enabled: !!slug });

export const useCreateBlogPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => postData<BlogPost>("/blog/", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog"] }),
  });
};

// ── Flash ──
export const useFlashDesigns = (params?: Record<string, string>) => {
  const qs = new URLSearchParams(params).toString();
  return useQuery<PaginatedResponse<FlashDesign>>({
    queryKey: ["flash", params],
    queryFn: () => fetcher(`/flash/${qs ? `?${qs}` : ""}`),
  });
};

export const useFlashDesign = (id: string) =>
  useQuery<FlashDesign>({ queryKey: ["flash", id], queryFn: () => fetcher(`/flash/${id}/`), enabled: !!id });

// ── Payments ──
export const useCreateDepositIntent = () =>
  useMutation({ mutationFn: (appointmentId: string) => postData<{ client_secret: string }>("/health/payments/deposit/", { appointment_id: appointmentId }) });

export const useCreateFlashIntent = () =>
  useMutation({ mutationFn: (designId: string) => postData<{ client_secret: string }>("/health/payments/flash/", { design_id: designId }) });
