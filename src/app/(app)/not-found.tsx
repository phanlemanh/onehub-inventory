import { FRAME_COPY } from "@/components/templates/frame-copy";
import { PageState } from "@/components/templates/page-state";

/** notFound() inside an internal screen: shown in the frame. */
export default function ScreenNotFound() {
  return (
    <>
      <title>{`${FRAME_COPY.notFound.title} · ${FRAME_COPY.brand}`}</title>
      <PageState kind="not-found" />
    </>
  );
}
