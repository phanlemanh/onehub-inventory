// UI door of the sharing module: the Sent grid (roadmap row 6, _acceptance/da-gui-tren-luoi).
export { SentGrid } from "./sent-grid";
export { SentRecordBody, sentRecord } from "./sent-record";
export {
  SENT_FIELDS,
  sentColumns,
  sentRows,
  sentStateFrom,
  type SentField,
  type SentState,
} from "./sent-rows";
export {
  SAMPLE_RECIPIENT_PREFIX,
  SAMPLE_SHARE_ID_PREFIX,
  buildSampleShareLinks,
  checkShareLinks,
  sampleShareLinkId,
  type SampleShareLinks,
} from "../sample";
