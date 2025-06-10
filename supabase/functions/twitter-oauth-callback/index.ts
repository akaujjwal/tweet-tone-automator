
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    console.log('OAuth callback received:', { code: code ? 'present' : 'missing', state, error });

    if (error) {
      // User denied access or other error
      const appUrl = 'https://loving-waffle-01f11e.lovableproject.com';
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
    const appUrl = 'https://loving-waffle-01f11e.lovableproject.com';
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
    
    const appUrl = 'https://loving-waffle-01f11e.lovableproject.com';
    const redirectUrl = `${appUrl}/?twitter_auth=error&error=${encodeURIComponent(error.message)}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl
      }
    });
  }
});
