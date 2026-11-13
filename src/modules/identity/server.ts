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
export { authHandlers, currentSession, membersHandlers, type CurrentSession } from "./runtime";
export { actionDoor, sessionDoor } from "./runtime";
export { isDoorError, openDoor, type DoorError, type OpenedDoor } from "./action-door";
export {
  captureInviteSender,
  inviteEmail,
  type InviteSender,
  type SentInvite,
} from "./invite-mail";
export { createMembersHandlers, type MembersHandlers } from "./members-http";
export { type MemberRow, type MembersDeps } from "./members";
export { requireAction } from "./require-action";
export { createAuthHandlers, type AuthHandlers } from "./http";
export { sessionContext, type CompanyRef, type Session } from "./login";
export { captureSender, codeEmail, type CodeSender, type SentMail } from "./sender";
