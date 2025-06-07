
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { AISettings } from "@/components/AISettings";
import { ReplyLog } from "@/components/ReplyLog";
import { Analytics } from "@/components/Analytics";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isConnected, setIsConnected] = useState(false);

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
