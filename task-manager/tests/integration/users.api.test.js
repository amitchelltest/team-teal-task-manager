import { describe, it, expect } from "vitest";
import { authFetch, BASE_URL } from "./helpers.js";

describe("Users API with D1 (integration)", () => {
  it("rejects non-admin user listing", async () => {
    const res = await authFetch(`${BASE_URL}/api/users`);
    expect(res.status).toBe(403);

    const body = await res.json();
    expect(body).toEqual({ error: "Forbidden" });
  });

  it("updates a user's role via PATCH", async () => {
    const patchRes = await authFetch(`${BASE_URL}/api/users/2`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "clinician" }),
    });
    expect(patchRes.ok).toBe(true);

    const updated = await patchRes.json();
    expect(updated.role).toBe("clinician");
  });

  it("rejects invalid role on PATCH", async () => {
    const patchRes = await authFetch(`${BASE_URL}/api/users/2`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "superadmin" }),
    });

    expect(patchRes.status).toBe(400);
    const body = await patchRes.json();
    expect(body).toEqual({ error: "Unknown role." });
  });
});
