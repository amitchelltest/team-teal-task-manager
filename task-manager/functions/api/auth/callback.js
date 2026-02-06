export async function onRequest({ request, env }) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const debug = url.searchParams.get("debug") === "1";

    if (error) {
        console.error("oauth error:", error);
        if (debug) return new Response(JSON.stringify({ error }), { status: 400, headers: { "Content-Type": "application/json" } });
        return Response.redirect("/", 302);
    }

    if (!code) {
        return new Response("missing code", { status: 400 });
    }

    // determine origin for internal API calls and redirect URI
    const origin = env.FRONTEND_ORIGIN || `https://${request.headers.get("host")}`;
    const redirectUri = env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/callback`;

    try {
        // exchange code for tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: env.GOOGLE_CLIENT_ID,
                client_secret: env.GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenResponse.json().catch(() => null);
        if (!tokenResponse.ok) {
            console.error("token exchange failed", tokenData);
            if (debug) return new Response(JSON.stringify({ tokenError: tokenData }), { status: 502, headers: { "Content-Type": "application/json" } });
            return Response.redirect("/", 302);
        }

        // fetch user info
        const userInfoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userInfoData = await userInfoRes.json().catch(() => null);
        if (!userInfoRes.ok) {
            console.error("could not fetch user info", userInfoData);
            if (debug) return new Response(JSON.stringify({ userInfoError: userInfoData }), { status: 502, headers: { "Content-Type": "application/json" } });
            return Response.redirect("/", 302);
        }

        // update/create user
        const addUserRes = await fetch(new URL("/api/users", origin).toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ display_name: userInfoData.name, email: userInfoData.email }),
        });
        const userData = await addUserRes.json().catch(() => null);
        if (!addUserRes.ok) {
            console.error("could not insert user", userData);
            if (debug) return new Response(JSON.stringify({ addUserError: userData }), { status: 502, headers: { "Content-Type": "application/json" } });
            return Response.redirect("/", 302);
        }

        // add user provider using sub
        const expiresAt = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null;
        const addUserProviderRes = await fetch(new URL("/api/auth/user-providers", origin).toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: userInfoData.sub ?? null,
                user_id: userData.id,
                provider: "google",
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                token_expires_at: expiresAt,
            }),
        });
        const addUserProviderData = await addUserProviderRes.json().catch(() => null);
        if (!addUserProviderRes.ok) {
            console.error("could not insert user provider", addUserProviderData);
            if (debug) return new Response(JSON.stringify({ addUserProviderError: addUserProviderData }), { status: 502, headers: { "Content-Type": "application/json" } });
            return Response.redirect("/", 302);
        }

        return Response.redirect("/", 302);
    } catch (err) {
        console.error("callback onRequest error", err);
        if (debug) return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
        return Response.redirect("/", 302);
    }
}