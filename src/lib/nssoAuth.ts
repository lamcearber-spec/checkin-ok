/**
 * NSSO OAuth2 Authentication — Chaman Portal
 *
 * Client Assertion Profile: Client ID + Secret → Bearer token
 * Memory-cached token with auto-refresh before expiration
 */

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getNssoToken(): Promise<string | null> {
  const clientId = process.env.NSSO_CLIENT_ID;
  const clientSecret = process.env.NSSO_CLIENT_SECRET;
  const authUrl = process.env.CHAMAN_AUTH_URL;

  if (!clientId || !clientSecret || !authUrl) {
    console.warn('NSSO OAuth2 credentials not configured — running in mock mode');
    return null;
  }

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'presenceregistration',
      }),
    });

    if (!response.ok) {
      console.error(`Chaman auth error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const token = data.access_token;
    const expiresIn = data.expires_in || 3600; // default 1 hour

    cachedToken = {
      token,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    return token;
  } catch (err) {
    console.error('NSSO auth error:', err);
    return null;
  }
}

export function clearTokenCache() {
  cachedToken = null;
}
