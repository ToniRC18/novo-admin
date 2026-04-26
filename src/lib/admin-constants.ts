import type { ProductoNovo } from "@/types/admin";

export const PRODUCTS: ProductoNovo[] = ["cards", "pos", "kitchen"];
export const GLOBAL_ROLES = ["owner", "manager", "cajero"] as const;
export const BUSINESS_PLANS = ["suite", "cards", "pos", "kitchen"] as const;
