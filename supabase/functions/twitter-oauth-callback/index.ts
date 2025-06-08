
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const oauthToken = url.searchParams.get('oauth_token');
    const oauthVerifier = url.searchParams.get('oauth_verifier');
    const denied = url.searchParams.get('denied');

    if (denied) {
      // User denied access
      return new Response(`
        <html>
          <body>
            <h1>Authorization Cancelled</h1>
            <p>You cancelled the Twitter authorization. You can close this window and try again.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 3000);
            </script>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (!oauthToken || !oauthVerifier) {
      throw new Error('Missing OAuth parameters');
    }

    // Redirect back to your app with the OAuth parameters
    const redirectUrl = `${url.origin}/?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}&twitter_auth=success`;

    return new Response(`
      <html>
        <body>
          <h1>Authorization Successful!</h1>
          <p>Redirecting you back to ReplyBot AI...</p>
          <script>
            window.location.href = "${redirectUrl}";
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error: any) {
    console.error('Error in twitter-oauth-callback:', error);
    return new Response(`
      <html>
        <body>
          <h1>Authorization Error</h1>
          <p>There was an error processing your Twitter authorization: ${error.message}</p>
          <p>Please close this window and try again.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
});
