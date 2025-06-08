
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
      const oauthToken = urlParams.get('oauth_token');
      const oauthVerifier = urlParams.get('oauth_verifier');
      const twitterAuth = urlParams.get('twitter_auth');

      if (twitterAuth === 'success' && oauthToken && oauthVerifier && user) {
        try {
          // Exchange the tokens for access tokens
          const { data, error } = await supabase.functions.invoke('twitter-oauth', {
            body: {
              action: 'exchange_token',
              oauth_token: oauthToken,
              oauth_verifier: oauthVerifier,
              userId: user.id
            }
          });

          if (error) {
            throw new Error(error.message);
          }

          if (data.success) {
            setIsConnected(true);
            toast({
              title: "Twitter Connected!",
              description: `Successfully connected as @${data.screen_name}`,
            });

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error: any) {
          toast({
            title: "Connection Failed",
            description: error.message || "Failed to complete Twitter connection",
            variant: "destructive",
          });
        }
      }
    };

    if (user) {
      handleTwitterCallback();
    }
  }, [user, toast]);

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
