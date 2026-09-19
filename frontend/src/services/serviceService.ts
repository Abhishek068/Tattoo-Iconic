import { SERVICES_CATALOG } from "@/constants";
import type { ServiceOffering } from "@/types";

export const serviceService = {
  async getServices(): Promise<ServiceOffering[]> {
    return SERVICES_CATALOG;
  },

  async getServiceBySlug(slug: string): Promise<ServiceOffering | null> {
    return SERVICES_CATALOG.find((s) => s.slug === slug) || null;
  },
};
