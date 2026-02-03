// Backend2/test-session.js

import { handleUserStep } from "./adaptive/session/sessionController.js";

const userId = "user-123";

const decision1 = handleUserStep(userId, {
  responseTime: 6000,
  errorType: "verb_tense"
});
console.log("Decision 1:", decision1);

const decision2 = handleUserStep(userId, {
  responseTime: 4800
});
console.log("Decision 2:", decision2);
