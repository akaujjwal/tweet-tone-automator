
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

export const ReplyLog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const replies = [
    {
      id: 1,
      originalTweet: "Just launched my new SaaS product! Looking for feedback from the community.",
      originalAuthor: "@startup_founder",
      aiReply: "Congratulations on your launch! 🎉 This is a huge milestone. I'd love to check it out and provide some feedback. What problem does your SaaS solve?",
      timestamp: "2024-01-15 14:30",
      status: "posted",
      engagement: { likes: 3, replies: 1 },
      sentiment: "positive"
    },
    {
      id: 2,
      originalTweet: "Struggling with work-life balance as a developer. Any advice?",
      originalAuthor: "@dev_life",
      aiReply: "I completely understand! Setting boundaries is key - try time-blocking your work hours and stick to them. Also, don't forget to step away from the screen regularly. Your mental health matters! 💪",
      timestamp: "2024-01-15 13:45",
      status: "posted",
      engagement: { likes: 8, replies: 2 },
      sentiment: "supportive"
    },
    {
      id: 3,
      originalTweet: "AI is taking over everything. Soon we won't need humans anymore.",
      originalAuthor: "@tech_skeptic",
      aiReply: "I understand the concern, but I see AI as a tool to augment human capabilities rather than replace them. The human element - creativity, empathy, ethical reasoning - remains irreplaceable.",
      timestamp: "2024-01-15 12:20",
      status: "posted",
      engagement: { likes: 12, replies: 5 },
      sentiment: "thoughtful"
    },
    {
      id: 4,
      originalTweet: "What's the best programming language to learn in 2024?",
      originalAuthor: "@newbie_coder",
      aiReply: "Great question! It depends on your goals: JavaScript for web development, Python for data science/AI, Rust for systems programming, or Go for backend services. What interests you most?",
      timestamp: "2024-01-15 11:15",
      status: "posted",
      engagement: { likes: 15, replies: 8 },
      sentiment: "helpful"
    },
    {
      id: 5,
      originalTweet: "This new framework is absolutely terrible. Waste of time.",
      originalAuthor: "@angry_dev",
      aiReply: "I'm sorry you're having a frustrating experience. Would you like to share what specific issues you're facing? Sometimes the community can help with workarounds or alternatives.",
      timestamp: "2024-01-15 10:30",
      status: "pending",
      engagement: { likes: 0, replies: 0 },
      sentiment: "diplomatic"
    }
  ];

  const filteredReplies = replies.filter(reply =>
    reply.originalTweet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reply.aiReply.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reply.originalAuthor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "posted": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "failed": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "supportive": return "bg-blue-50 text-blue-700 border-blue-200";
      case "thoughtful": return "bg-purple-50 text-purple-700 border-purple-200";
      case "helpful": return "bg-orange-50 text-orange-700 border-orange-200";
      case "diplomatic": return "bg-slate-50 text-slate-700 border-slate-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reply Log</h1>
        <p className="text-slate-600">Track all your AI-generated responses and their performance</p>
      </div>

      <Card className="border-0 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Recent Replies
          </CardTitle>
          <CardDescription>
            Your AI has sent {replies.filter(r => r.status === 'posted').length} replies today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search replies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredReplies.map((reply) => (
              <div key={reply.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`border ${getStatusColor(reply.status)}`}>
                      {getStatusIcon(reply.status)}
                      <span className="ml-1 capitalize">{reply.status}</span>
                    </Badge>
                    <Badge variant="outline" className={getSentimentColor(reply.sentiment)}>
                      {reply.sentiment}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {reply.timestamp}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-slate-300">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-600">Original Tweet</span>
                      <span className="text-sm text-blue-600">{reply.originalAuthor}</span>
                    </div>
                    <p className="text-slate-800">{reply.originalTweet}</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-blue-600">Your AI Reply</span>
                      {reply.status === 'posted' && (
                        <Button variant="ghost" size="sm" className="text-blue-600 h-auto p-1">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-slate-800">{reply.aiReply}</p>
                  </div>

                  {reply.status === 'posted' && (
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>💙 {reply.engagement.likes} likes</span>
                      <span>💬 {reply.engagement.replies} replies</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredReplies.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No replies found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
