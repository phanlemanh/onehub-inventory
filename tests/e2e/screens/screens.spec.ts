// Register-driven state suite, signed-out run (roadmap rows 1f and 1r). The suite itself lives in
// tools/e2e_templates/suite.ts; a screen that sends the browser to sign-in is handed to the signed-in run
// (tests/e2e-db/screens.spec.ts) by name.
// decision:state-matrix
// decision:wcag-aa
// decision:no-sideways-scroll
import { registerSuite } from "../../../tools/e2e_templates/suite";

registerSuite({ mode: "khong-phien" });
