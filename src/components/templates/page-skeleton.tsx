"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

/** A waiting screen laid out like a screen: nothing under one second, then the skeleton (design/behaviors.md). */
export function PageSkeleton({ delayMs = 1000 }: { delayMs?: number }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShown(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);
  if (!shown) return null;
  return (
    <div data-slot="page-skeleton" aria-hidden="true" className="flex flex-col gap-6">
      <div className="grid h-8 w-48">
        <Skeleton />
      </div>
      <div className="grid h-10">
        <Skeleton />
      </div>
      <div className="grid h-64">
        <Skeleton />
      </div>
    </div>
  );
}
