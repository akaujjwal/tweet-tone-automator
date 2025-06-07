
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Twitter, Bot, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export const Dashboard = ({ isConnected, setIsConnected }: DashboardProps) => {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    toast({
      title: "Connected to X (Twitter)",
      description: "Your account has been successfully connected!",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAutoReplyEnabled(false);
    toast({
      title: "Disconnected from X",
      description: "Your account has been disconnected.",
    });
  };

  const stats = [
    { label: "Replies Sent Today", value: "12", icon: MessageSquare, color: "text-blue-600" },
    { label: "Engagement Rate", value: "8.4%", icon: TrendingUp, color: "text-emerald-600" },
    { label: "Active Keywords", value: "5", icon: Zap, color: "text-purple-600" },
    { label: "Response Time", value: "2.3s", icon: Bot, color: "text-orange-600" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to ReplyBot AI</h1>
        <p className="text-slate-600">Automate your Twitter engagement with AI-powered responses</p>
      </div>

      {!isConnected ? (
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Twitter className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Connect Your X Account</CardTitle>
            <CardDescription className="text-lg">
              Get started by connecting your Twitter account to enable AI-powered auto-replies
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={handleConnect}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              <Twitter className="w-5 h-5 mr-2" />
              Connect with X
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  Auto-Reply Settings
                </CardTitle>
                <CardDescription>
                  Configure your automated response behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Auto-Replies</p>
                    <p className="text-sm text-slate-600">Automatically respond to relevant tweets</p>
                  </div>
                  <Switch 
                    checked={autoReplyEnabled}
                    onCheckedChange={setAutoReplyEnabled}
                  />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-slate-600 mb-2">Current Personality:</p>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-slate-700">Friendly & Professional</p>
                    <p className="text-xs text-slate-500">Responds with helpful and engaging tone</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Twitter className="w-5 h-5 text-blue-600" />
                  Account Status
                </CardTitle>
                <CardDescription>
                  Manage your X account connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <div>
                    <p className="font-medium text-emerald-800">Connected as @demo_user</p>
                    <p className="text-sm text-emerald-600">Ready to start auto-replying</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleDisconnect}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Disconnect Account
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest AI-generated replies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { tweet: "Just launched my new startup! Excited for the journey ahead.", reply: "Congratulations on your launch! Wishing you all the best on this exciting journey. 🚀", time: "2 minutes ago" },
                  { tweet: "Anyone have tips for better work-life balance?", reply: "Great question! Setting boundaries and prioritizing self-care are key. What's worked for me is time-blocking and regular breaks.", time: "15 minutes ago" },
                  { tweet: "The future of AI is fascinating but also concerning.", reply: "Absolutely agree! It's important we develop AI responsibly while embracing its potential to solve real problems.", time: "1 hour ago" },
                ].map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <p className="text-sm text-slate-600 mb-1">Original: "{item.tweet}"</p>
                    <p className="font-medium text-slate-800 mb-1">Your reply: "{item.reply}"</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// Import statement for MessageSquare icon
import { MessageSquare } from "lucide-react";
