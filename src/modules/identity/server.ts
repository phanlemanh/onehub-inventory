import "server-only";

// Server API of the identity module.
export {
  APP_ROLE,
  SET_CONTEXT_SQL,
  SET_ROLE_SQL,
  createPool,
  withCompany,
  type CompanyContext,
  type DbClient,
  type DbPool,
} from "./with-company";
export { assertProductionConfig, AuthConfigError, PRODUCTION_VARS } from "./config";
export { authHandlers, currentSession, type CurrentSession } from "./runtime";
export { createAuthHandlers, type AuthHandlers } from "./http";
export { sessionContext, type CompanyRef, type Session } from "./login";
export { captureSender, codeEmail, type CodeSender, type SentMail } from "./sender";
