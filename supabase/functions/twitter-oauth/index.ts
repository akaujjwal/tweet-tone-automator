
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { createHmac } from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string = ""
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  return hmacSha1.update(signatureBaseString).digest("base64");
}

function generateOAuthHeader(method: string, url: string, additionalParams: Record<string, string> = {}): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
    ...additionalParams
  };

  const signature = generateOAuthSignature(method, url, oauthParams, API_SECRET!);
  const signedOAuthParams = { ...oauthParams, oauth_signature: signature };

  return "OAuth " + Object.entries(signedOAuthParams)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(", ");
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, oauth_token, oauth_verifier, userId } = await req.json();

    if (!API_KEY || !API_SECRET) {
      throw new Error('Twitter API credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'get_auth_url') {
      // Step 1: Get request token
      const requestTokenUrl = "https://api.twitter.com/oauth/request_token";
      const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/twitter-oauth-callback`;
      
      const oauthHeader = generateOAuthHeader('POST', requestTokenUrl, {
        oauth_callback: encodeURIComponent(callbackUrl)
      });

      const response = await fetch(requestTokenUrl, {
        method: 'POST',
        headers: {
          Authorization: oauthHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `oauth_callback=${encodeURIComponent(callbackUrl)}`
      });

      const responseText = await response.text();
      console.log('Request token response:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to get request token: ${responseText}`);
      }

      const params = new URLSearchParams(responseText);
      const oauthToken = params.get('oauth_token');
      const oauthTokenSecret = params.get('oauth_token_secret');

      if (!oauthToken || !oauthTokenSecret) {
        throw new Error('Invalid response from Twitter');
      }

      // Store the token secret temporarily (you might want to use a more secure method)
      await supabase
        .from('profiles')
        .update({ 
          // You could store this in user metadata or create a separate table
          // For now, we'll handle it in the callback
        })
        .eq('id', userId);

      const authUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`;

      return new Response(JSON.stringify({ 
        auth_url: authUrl,
        oauth_token: oauthToken,
        oauth_token_secret: oauthTokenSecret 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'exchange_token') {
      // Step 2: Exchange request token for access token
      const accessTokenUrl = "https://api.twitter.com/oauth/access_token";
      
      const oauthHeader = generateOAuthHeader('POST', accessTokenUrl, {
        oauth_token: oauth_token,
        oauth_verifier: oauth_verifier
      });

      const response = await fetch(accessTokenUrl, {
        method: 'POST',
        headers: {
          Authorization: oauthHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `oauth_verifier=${oauth_verifier}&oauth_token=${oauth_token}`
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${responseText}`);
      }

      const params = new URLSearchParams(responseText);
      const accessToken = params.get('oauth_token');
      const accessTokenSecret = params.get('oauth_token_secret');
      const screenName = params.get('screen_name');

      // Update user profile with Twitter info
      await supabase
        .from('profiles')
        .update({ 
          twitter_username: screenName
        })
        .eq('id', userId);

      return new Response(JSON.stringify({ 
        success: true,
        screen_name: screenName,
        access_token: accessToken,
        access_token_secret: accessTokenSecret
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
