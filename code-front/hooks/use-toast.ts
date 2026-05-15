"use client";

import { useToastContext } from "@/components/ui/toast-provider";
import type { Toast, ToastType } from "@/components/ui/toast-provider";

export type { Toast, ToastType };

export function useToast() {
  return useToastContext();
}
