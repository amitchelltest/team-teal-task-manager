import { describe, it, expect } from "vitest";
import { authFetch, authFetchAsAdmin, BASE_URL } from "./helpers.js";

// Integration authz test strategy:
// - Default integration token authenticates as user id=1.
// - OWN_COMMENT restrictions apply only to clinician/professor in our matrix.
// - We temporarily switch user 1 to clinician/professor via admin token.
// - We then verify:
//   1) PATCH on another user's comment is forbidden.
//   2) PATCH on own comment is allowed.
// - Finally, we restore user 1 back to developer to avoid test-state leakage.
//
// Seed assumptions used by this file:
// - comment id=1 is created_by=2 (not owned by user 1)
// - comment id=3 is created_by=1 (owned by user 1)

async function setUserRoleAsAdmin(userId, role) {
  const res = await authFetchAsAdmin(`${BASE_URL}/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  return res;
}

describe("Comments OWN_COMMENT authz (integration)", () => {
  const selfUserId = 1;
  const ownCommentId = 3; 
  const otherUsersCommentId = 1; 

  for (const role of ["clinician", "professor"]) {
    it(`enforces own-comment rules for role=${role}`, async () => {
      const switchRes = await setUserRoleAsAdmin(selfUserId, role);
      expect(switchRes.ok).toBe(true);

      try {
        const denyRes = await authFetch(`${BASE_URL}/api/comments/${otherUsersCommentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: `deny-${role}-${Date.now()}` }),
        });
        expect(denyRes.status).toBe(403);
        expect(await denyRes.json()).toEqual({ error: "Forbidden" });

        const allowRes = await authFetch(`${BASE_URL}/api/comments/${ownCommentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: `allow-${role}-${Date.now()}` }),
        });
        expect(allowRes.ok).toBe(true);
      } finally {
        const restoreRes = await setUserRoleAsAdmin(selfUserId, "developer");
        expect(restoreRes.ok).toBe(true);
      }
    });
  }
});
