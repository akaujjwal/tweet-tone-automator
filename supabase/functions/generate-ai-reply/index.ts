
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tweetText, authorName, userId, personalityType = 'friendly_professional' } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user settings for personality
    const { data: settings } = await supabase
      .from('user_settings')
      .select('personality_type')
      .eq('user_id', userId)
      .single();

    const personality = settings?.personality_type || personalityType;

    // Define personality prompts
    const personalityPrompts = {
      friendly_professional: "You are a friendly and professional Twitter user. Respond with helpful, engaging content that adds value to the conversation.",
      supportive: "You are supportive and encouraging. Respond with empathy and positivity, offering help or encouragement.",
      thoughtful: "You are thoughtful and analytical. Provide insightful responses that demonstrate deep thinking and consideration.",
      diplomatic: "You are diplomatic and balanced. Respond with measured, fair perspectives that acknowledge different viewpoints.",
      helpful: "You are extremely helpful and solution-oriented. Focus on providing practical advice or resources."
    };

    const systemPrompt = personalityPrompts[personality as keyof typeof personalityPrompts] || personalityPrompts.friendly_professional;

    // Generate AI reply using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `${systemPrompt} Keep responses under 280 characters for Twitter. Be authentic and engaging. Do not use hashtags unless absolutely necessary.`
          },
          { 
            role: 'user', 
            content: `Generate a reply to this tweet by @${authorName}: "${tweetText}"`
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content.trim();

    // Determine sentiment
    const sentimentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Analyze the sentiment of this reply and respond with only one word: positive, negative, neutral, supportive, thoughtful, helpful, or diplomatic'
          },
          { 
            role: 'user', 
            content: aiReply
          }
        ],
        max_tokens: 10,
        temperature: 0.1,
      }),
    });

    const sentimentData = await sentimentResponse.json();
    const sentiment = sentimentData.choices[0].message.content.trim().toLowerCase();

    return new Response(JSON.stringify({ 
      aiReply, 
      sentiment: sentiment || 'neutral'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-ai-reply function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
