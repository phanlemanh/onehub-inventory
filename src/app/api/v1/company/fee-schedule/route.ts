import { feeScheduleHandlers } from "@/modules/company-config/server";

/** The company's fee schedule: every item with its rate, whether it is switched on, and where its value comes from. */
export function GET(req: Request): Promise<Response> {
  return feeScheduleHandlers().read(req);
}

/** Saves the whole fee schedule; only CompanyAdmin (setFeeSchedule). */
export function PUT(req: Request): Promise<Response> {
  return feeScheduleHandlers().save(req);
}
