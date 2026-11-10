"use client";

import { useEffect, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

import { FRAME_COPY } from "./frame-copy";

/** A screen-wide problem shown as a banner above the screen (design/behaviors.md, notification channel). */
export interface ScreenBannerState {
  title: string;
  detail: string;
  retry?: () => void;
}

let current: ScreenBannerState | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function showScreenBanner(state: ScreenBannerState): void {
  current = state;
  emit();
}

export function clearScreenBanner(): void {
  current = null;
  emit();
}

export function getScreenBanner(): ScreenBannerState | null {
  return current;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useScreenBanner(): ScreenBannerState | null {
  return useSyncExternalStore(subscribe, getScreenBanner, () => null);
}

/**
 * Runs a save. When it fails because the device is offline, the banner says it was not saved and offers a retry;
 * the form is left alone, so what the person typed stays. Any other failure is the caller's to report.
 */
export async function saveWithBanner(save: () => Promise<void>): Promise<boolean> {
  try {
    await save();
    clearScreenBanner();
    return true;
  } catch (error) {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      showScreenBanner({
        ...FRAME_COPY.saveFailedOffline,
        retry: () => void saveWithBanner(save),
      });
      return false;
    }
    throw error;
  }
}

/** Shows the offline banner while the device has no network and clears it when the network returns. */
export function ConnectionWatcher() {
  useEffect(() => {
    const offline = () => showScreenBanner({ ...FRAME_COPY.offline });
    const online = () => clearScreenBanner();
    if (navigator.onLine === false) offline();
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    return () => {
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
    };
  }, []);
  return null;
}

export function ScreenBanner() {
  const banner = useScreenBanner();
  if (!banner) return null;
  return (
    <div
      role="alert"
      data-slot="screen-banner"
      className="flex flex-wrap items-center justify-between gap-4 border-b border-warning/25 bg-warning/10 px-4 py-3 text-sm"
    >
      <p>
        <span className="font-semibold">{banner.title}.</span> {banner.detail}
      </p>
      {banner.retry ? (
        <Button size="sm" variant="outline" onClick={banner.retry}>
          {FRAME_COPY.retry}
        </Button>
      ) : null}
    </div>
  );
}
