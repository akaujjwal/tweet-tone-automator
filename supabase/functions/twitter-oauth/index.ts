
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
    const { action, code, state, userId } = await req.json();

    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error('Twitter OAuth credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'get_auth_url') {
      // Step 1: Generate PKCE parameters and authorization URL
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const stateParam = generateCodeVerifier(); // Use as state parameter
      
      const redirectUri = `${supabaseUrl}/functions/v1/twitter-oauth-callback`;
      
      console.log('Using redirect URI:', redirectUri);
      console.log('Generated code verifier:', codeVerifier);
      console.log('Generated code challenge:', codeChallenge);

      // Store code verifier and state in localStorage approach since we don't have DB columns
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
        code_verifier: codeVerifier
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'exchange_token') {
      // Step 2: Exchange authorization code for access token
      const redirectUri = `${supabaseUrl}/functions/v1/twitter-oauth-callback`;

      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: userId, // We'll pass code_verifier as userId for now
        client_id: CLIENT_ID
      });

      const authHeader = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenParams.toString()
      });

      const responseText = await response.text();
      console.log('Token exchange response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${responseText}`);
      }

      const tokenData = JSON.parse(responseText);

      // Get user info from Twitter
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();
      console.log('User data:', userData);

      if (!userResponse.ok) {
        throw new Error(`Failed to get user info: ${JSON.stringify(userData)}`);
      }

      return new Response(JSON.stringify({ 
        success: true,
        username: userData.data.username,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error: any) {
    console.error('Error in twitter-oauth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
