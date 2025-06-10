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

      console.log('OAuth callback params:', { code: code ? 'present' : 'missing', state, twitterAuth, error });

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

      if (twitterAuth === 'success' && code && state && user) {
        try {
          // Get stored OAuth parameters from localStorage
          const storedState = localStorage.getItem('twitter_oauth_state');
          const storedCodeVerifier = localStorage.getItem('twitter_oauth_code_verifier');

          console.log('Stored OAuth data:', { 
            storedState: storedState ? 'present' : 'missing', 
            storedCodeVerifier: storedCodeVerifier ? 'present' : 'missing',
            receivedState: state
          });

          if (!storedState || !storedCodeVerifier) {
            console.error('Missing stored OAuth data');
            throw new Error('OAuth session expired. Please try connecting again.');
          }

          if (storedState !== state) {
            console.error('State mismatch:', { stored: storedState, received: state });
            throw new Error('Invalid OAuth state. Security check failed.');
          }

          console.log('Exchanging code for token...');

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
            error: functionError,
            hasUsername: !!data?.username,
            hasAccessToken: !!data?.access_token
          });

          if (functionError) {
            console.error('Supabase function error:', functionError);
            throw new Error(functionError.message || 'Failed to exchange token');
          }

          if (!data) {
            throw new Error('No response data from token exchange');
          }

          if (!data.success) {
            const errorMessage = data.error || 'Token exchange failed';
            console.error('Token exchange failed:', errorMessage);
            throw new Error(errorMessage);
          }

          if (!data.username || !data.access_token) {
            throw new Error('Incomplete token exchange response');
          }

          // Store Twitter credentials in localStorage
          localStorage.setItem('twitter_username', data.username);
          localStorage.setItem('twitter_access_token', data.access_token);
          if (data.refresh_token) {
            localStorage.setItem('twitter_refresh_token', data.refresh_token);
          }

          // Clean up OAuth data
          localStorage.removeItem('twitter_oauth_state');
          localStorage.removeItem('twitter_oauth_code_verifier');

          setIsConnected(true);
          toast({
            title: "Twitter Connected!",
            description: `Successfully connected as @${data.username}`,
          });

          console.log('Twitter connection successful!');

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error: any) {
          console.error('Twitter OAuth error:', error);
          
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
      if (twitterUsername) {
        setIsConnected(true);
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
