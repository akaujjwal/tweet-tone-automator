
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLIENT_ID = Deno.env.get("TWITTER_CLIENT_ID")?.trim();
const CLIENT_SECRET = Deno.env.get("TWITTER_CLIENT_SECRET")?.trim();
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Generate code verifier and challenge for PKCE
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, code, state, code_verifier, userId } = await req.json();

    console.log('Received request:', { 
      action, 
      code: code ? `${code.substring(0, 20)}...` : 'missing', 
      state: state ? 'present' : 'missing', 
      code_verifier: code_verifier ? 'present' : 'missing', 
      userId 
    });

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('Missing Twitter OAuth credentials');
      return new Response(JSON.stringify({ 
        error: 'Twitter OAuth credentials not configured. Please check your environment variables.',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'get_auth_url') {
      // Step 1: Generate PKCE parameters and authorization URL
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const stateParam = generateCodeVerifier(); // Use as state parameter
      
      const redirectUri = `${supabaseUrl}/functions/v1/twitter-oauth-callback`;
      
      console.log('Generated OAuth parameters:', {
        redirectUri,
        codeVerifier: codeVerifier.substring(0, 10) + '...',
        codeChallenge: codeChallenge.substring(0, 10) + '...',
        state: stateParam.substring(0, 10) + '...'
      });

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: redirectUri,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: stateParam,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      });

      const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

      return new Response(JSON.stringify({ 
        auth_url: authUrl,
        state: stateParam,
        code_verifier: codeVerifier,
        success: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'exchange_token') {
      // Step 2: Exchange authorization code for access token
      const redirectUri = `${supabaseUrl}/functions/v1/twitter-oauth-callback`;

      console.log('Token exchange request:', { 
        code: code ? `${code.substring(0, 20)}...` : 'missing', 
        redirectUri, 
        code_verifier: code_verifier ? 'present' : 'missing',
        state: state ? 'present' : 'missing'
      });

      if (!code || !code_verifier || !state) {
        console.error('Missing required parameters for token exchange');
        return new Response(JSON.stringify({ 
          error: 'Missing required parameters: code, code_verifier, or state',
          success: false 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: code_verifier,
        client_id: CLIENT_ID
      });

      const authHeader = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

      console.log('Making token request to Twitter with params:', {
        grant_type: 'authorization_code',
        code: code.substring(0, 20) + '...',
        redirect_uri: redirectUri,
        client_id: CLIENT_ID
      });

      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenParams.toString()
      });

      const responseText = await response.text();
      console.log('Twitter token response:', { 
        status: response.status, 
        ok: response.ok,
        hasResponse: !!responseText
      });

      if (!response.ok) {
        console.error('Token exchange failed:', response.status, responseText);
        return new Response(JSON.stringify({ 
          error: `Twitter API error (${response.status}): ${responseText}`,
          success: false 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let tokenData;
      try {
        tokenData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse token response:', parseError);
        return new Response(JSON.stringify({ 
          error: 'Invalid response from Twitter API',
          success: false 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!tokenData.access_token) {
        console.error('No access token in response:', tokenData);
        return new Response(JSON.stringify({ 
          error: 'No access token received from Twitter',
          success: false 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get user info from Twitter
      console.log('Getting user info from Twitter...');
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const userResponseText = await userResponse.text();
      console.log('Twitter user response:', { 
        status: userResponse.status, 
        ok: userResponse.ok,
        hasResponse: !!userResponseText
      });

      if (!userResponse.ok) {
        console.error('Failed to get user info:', userResponseText);
        return new Response(JSON.stringify({ 
          error: `Failed to get user info (${userResponse.status}): ${userResponseText}`,
          success: false 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let userData;
      try {
        userData = JSON.parse(userResponseText);
      } catch (parseError) {
        console.error('Failed to parse user response:', parseError);
        return new Response(JSON.stringify({ 
          error: 'Invalid user response from Twitter API',
          success: false 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!userData.data || !userData.data.username) {
        console.error('No username in user response:', userData);
        return new Response(JSON.stringify({ 
          error: 'No username received from Twitter',
          success: false 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Successfully retrieved user data:', { username: userData.data.username });

      return new Response(JSON.stringify({ 
        success: true,
        username: userData.data.username,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Invalid action',
      success: false 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in twitter-oauth function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
