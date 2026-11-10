import { Skeleton } from "@/components/ui/skeleton";

/**
 * A waiting screen laid out like a screen: nothing under one second, then the skeleton (design/behaviors.md).
 * The delay is CSS (src/styles/frame.css) so it also works in the fallback the server streams first.
 */
export function PageSkeleton() {
  return (
    <div
      data-slot="page-skeleton"
      aria-hidden="true"
      className="onehub-reveal-after-1s flex flex-col gap-6"
    >
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
