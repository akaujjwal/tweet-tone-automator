
import { cn } from "@/lib/utils";
import { Home, Settings, MessageSquare, BarChart3, Twitter, Bot, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isConnected: boolean;
}

export const Sidebar = ({ activeTab, setActiveTab, isConnected }: SidebarProps) => {
  const { user, signOut } = useAuth();
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "ai-settings", label: "AI Settings", icon: Bot },
    { id: "reply-log", label: "Reply Log", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 shadow-lg flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Twitter className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ReplyBot AI
            </h1>
            <p className="text-sm text-slate-500">Smart Twitter Automation</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isConnected ? "bg-emerald-500" : "bg-slate-400"
            )} />
            <span className="text-sm font-medium text-slate-700">
              {isConnected ? "Connected to X" : "Not Connected"}
            </span>
          </div>
          {isConnected && (
            <p className="text-xs text-slate-500">Auto-replies: Active</p>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSignOut}
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
