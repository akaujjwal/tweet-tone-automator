
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    if (error) {
      // User denied access or other error
      return new Response(`
        <html>
          <body>
            <h1>Authorization Error</h1>
            <p>Error: ${error}</p>
            ${errorDescription ? `<p>Description: ${errorDescription}</p>` : ''}
            <p>You can close this window and try again.</p>
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

    if (!code || !state) {
      throw new Error('Missing authorization code or state parameter');
    }

    // Redirect back to your app with the OAuth parameters
    const redirectUrl = `${url.origin}/?code=${code}&state=${state}&twitter_auth=success`;

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
