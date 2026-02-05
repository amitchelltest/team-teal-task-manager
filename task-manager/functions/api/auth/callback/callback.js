export default async function onRequest({ request, env }) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
        // todo: figure out where errors should route
        console.error(error)
        return Response.redirect('/', 302);
    }
    if (!code) {
        return new Response('missing code', { status: 400 });
    }

    // send code to google, get token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: env.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code'
        })
    });

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok) {
        // todo: figure out where errors should route
        console.error('token exchange failed', tokenData);
        return Response.redirect('/', 302);
    }

    // update user in db using token

}