
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    console.log('OAuth callback received:', { code: code ? 'present' : 'missing', state, error });

    // Use the correct app URL - get it from the request origin or use the current domain
    const appUrl = 'https://3219dda9-d4f2-4be0-965d-b5b9fd9ccadf.lovableproject.com';

    if (error) {
      // User denied access or other error
      const redirectUrl = `${appUrl}/?twitter_auth=error&error=${encodeURIComponent(error)}`;
      
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl
        }
      });
    }

    if (!code || !state) {
      throw new Error('Missing authorization code or state parameter');
    }

    // Redirect back to your app with the OAuth parameters
    const redirectUrl = `${appUrl}/?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&twitter_auth=success`;

    console.log('Redirecting to:', redirectUrl);

    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl
      }
    });

  } catch (error: any) {
    console.error('Error in twitter-oauth-callback:', error);
    
    const appUrl = 'https://3219dda9-d4f2-4be0-965d-b5b9fd9ccadf.lovableproject.com';
    const redirectUrl = `${appUrl}/?twitter_auth=error&error=${encodeURIComponent(error.message)}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl
      }
    });
  }
});
