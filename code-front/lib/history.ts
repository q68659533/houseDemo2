import type { PropertyFeatures } from "./api";

export interface HistoryEntry {
  id: string;
  features: PropertyFeatures;
  prediction: number;
  timestamp: number;
}

const STORAGE_KEY = "property-estimates";
const MAX_ENTRIES = 50;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveToHistory(features: PropertyFeatures, prediction: number): HistoryEntry {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    features,
    prediction,
    timestamp: Date.now(),
  };

  const history = getHistory();
  const updated = [entry, ...history];

  if (updated.length > MAX_ENTRIES) {
    updated.splice(MAX_ENTRIES);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return entry;
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
