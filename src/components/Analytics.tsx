
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, Target, Heart, MessageCircle } from "lucide-react";

export const Analytics = () => {
  const stats = [
    {
      title: "Total Replies",
      value: "127",
      change: "+12%",
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Engagement Rate",
      value: "8.4%",
      change: "+2.1%",
      icon: Heart,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Avg Response Time",
      value: "2.3s",
      change: "-0.5s",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Success Rate",
      value: "96.8%",
      change: "+1.2%",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const weeklyData = [
    { day: "Mon", replies: 18, engagement: 7.2 },
    { day: "Tue", replies: 24, engagement: 8.1 },
    { day: "Wed", replies: 19, engagement: 9.3 },
    { day: "Thu", replies: 31, engagement: 8.7 },
    { day: "Fri", replies: 28, engagement: 7.9 },
    { day: "Sat", replies: 15, engagement: 9.1 },
    { day: "Sun", replies: 12, engagement: 8.5 }
  ];

  const topKeywords = [
    { keyword: "AI", mentions: 45, engagement: 9.2 },
    { keyword: "startup", mentions: 32, engagement: 8.7 },
    { keyword: "React", mentions: 28, engagement: 8.1 },
    { keyword: "productivity", mentions: 24, engagement: 7.9 },
    { keyword: "tech", mentions: 19, engagement: 8.3 }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-600">Track the performance of your AI-powered engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Weekly Performance
            </CardTitle>
            <CardDescription>Replies sent and engagement rates this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-slate-600">{day.day}</div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-2 relative">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(day.replies / 35) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-slate-600 w-12">{day.replies}</div>
                  </div>
                  <div className="text-sm text-emerald-600 font-medium w-12">{day.engagement}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Top Keywords
            </CardTitle>
            <CardDescription>Most engaging keywords this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topKeywords.map((item, index) => (
                <div key={item.keyword} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800">#{item.keyword}</span>
                      <span className="text-sm text-emerald-600 font-medium">{item.engagement}% avg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-blue-500 h-1.5 rounded-full"
                          style={{ width: `${(item.mentions / 45) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{item.mentions} mentions</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Response Quality</CardTitle>
            <CardDescription>AI response ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Excellent</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '68%' }} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Good</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Needs Improvement</span>
                <span className="text-sm font-medium">4%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '4%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>When your AI is most active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "Morning (6-12)", percentage: 35 },
                { time: "Afternoon (12-18)", percentage: 45 },
                { time: "Evening (18-24)", percentage: 15 },
                { time: "Night (0-6)", percentage: 5 }
              ].map((slot) => (
                <div key={slot.time} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{slot.time}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${slot.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{slot.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your AI milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  🎯
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-800">100 Replies Milestone</p>
                  <p className="text-xs text-emerald-600">Reached yesterday</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  💙
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">High Engagement Day</p>
                  <p className="text-xs text-blue-600">12.3% engagement rate</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  ⚡
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-800">Speed Record</p>
                  <p className="text-xs text-purple-600">1.8s response time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
