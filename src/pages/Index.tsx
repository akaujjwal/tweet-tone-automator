
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { AISettings } from "@/components/AISettings";
import { ReplyLog } from "@/components/ReplyLog";
import { Analytics } from "@/components/Analytics";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Handle Twitter OAuth callback
  useEffect(() => {
    const handleTwitterCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const twitterAuth = urlParams.get('twitter_auth');
      const error = urlParams.get('error');

      console.log('OAuth callback params:', { 
        code: code ? 'present' : 'missing', 
        state: state ? 'present' : 'missing', 
        twitterAuth, 
        error,
        fullURL: window.location.href
      });

      // Handle Twitter OAuth error
      if (twitterAuth === 'error' && error) {
        console.error('Twitter OAuth error:', error);
        toast({
          title: "Twitter Connection Failed",
          description: `Error: ${error}`,
          variant: "destructive",
        });
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Handle successful OAuth callback
      if (twitterAuth === 'success' && code && state && user) {
        console.log('Processing OAuth success callback...');
        
        try {
          // Get stored OAuth parameters from localStorage
          const storedState = localStorage.getItem('twitter_oauth_state');
          const storedCodeVerifier = localStorage.getItem('twitter_oauth_code_verifier');

          console.log('OAuth validation:', { 
            storedState: storedState ? `${storedState.substring(0, 10)}...` : 'missing', 
            storedCodeVerifier: storedCodeVerifier ? 'present' : 'missing',
            receivedState: state ? `${state.substring(0, 10)}...` : 'missing',
            stateMatch: storedState === state
          });

          if (!storedState || !storedCodeVerifier) {
            console.error('Missing stored OAuth data');
            throw new Error('OAuth session data not found. Please try connecting again.');
          }

          if (storedState !== state) {
            console.error('State mismatch - possible CSRF attack');
            throw new Error('OAuth state validation failed. Please try connecting again.');
          }

          console.log('Exchanging authorization code for tokens...');

          // Exchange the authorization code for access tokens
          const { data, error: functionError } = await supabase.functions.invoke('twitter-oauth', {
            body: {
              action: 'exchange_token',
              code: code,
              state: state,
              code_verifier: storedCodeVerifier
            }
          });

          console.log('Token exchange response:', { 
            success: data?.success, 
            error: functionError?.message,
            hasUsername: !!data?.username,
            hasAccessToken: !!data?.access_token
          });

          if (functionError) {
            console.error('Supabase function error:', functionError);
            throw new Error(functionError.message || 'Failed to exchange authorization code');
          }

          if (!data?.success) {
            const errorMessage = data?.error || 'Token exchange failed';
            console.error('Token exchange failed:', errorMessage);
            throw new Error(errorMessage);
          }

          if (!data.username || !data.access_token) {
            console.error('Incomplete token response:', data);
            throw new Error('Incomplete response from Twitter API');
          }

          // Store Twitter credentials securely
          localStorage.setItem('twitter_username', data.username);
          localStorage.setItem('twitter_access_token', data.access_token);
          if (data.refresh_token) {
            localStorage.setItem('twitter_refresh_token', data.refresh_token);
          }

          // Clean up OAuth session data
          localStorage.removeItem('twitter_oauth_state');
          localStorage.removeItem('twitter_oauth_code_verifier');

          console.log('Twitter connection successful:', { username: data.username });

          setIsConnected(true);
          toast({
            title: "Twitter Connected Successfully!",
            description: `Connected as @${data.username}`,
          });

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);

        } catch (error: any) {
          console.error('OAuth processing error:', error);
          
          // Clean up OAuth data on error
          localStorage.removeItem('twitter_oauth_state');
          localStorage.removeItem('twitter_oauth_code_verifier');
          
          toast({
            title: "Connection Failed",
            description: error.message || "Failed to complete Twitter connection",
            variant: "destructive",
          });
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    if (user) {
      handleTwitterCallback();
    }
  }, [user, toast]);

  // Check for existing Twitter connection on mount
  useEffect(() => {
    if (user) {
      const twitterUsername = localStorage.getItem('twitter_username');
      const twitterToken = localStorage.getItem('twitter_access_token');
      
      console.log('Checking existing Twitter connection:', {
        hasUsername: !!twitterUsername,
        hasToken: !!twitterToken
      });
      
      if (twitterUsername && twitterToken) {
        setIsConnected(true);
        console.log('Found existing Twitter connection');
      }
    }
  }, [user]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard isConnected={isConnected} setIsConnected={setIsConnected} />;
      case "ai-settings":
        return <AISettings />;
      case "reply-log":
        return <ReplyLog />;
      case "analytics":
        return <Analytics />;
      default:
        return <Dashboard isConnected={isConnected} setIsConnected={setIsConnected} />;
    }
  };

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 w-full">
      <div className="flex w-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isConnected={isConnected} />
        <main className="flex-1 overflow-hidden">
          <div className="h-screen overflow-y-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
