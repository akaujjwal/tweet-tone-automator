
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Filter, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const AISettings = () => {
  const [personalityPrompt, setPersonalityPrompt] = useState(
    "I'm a friendly and professional person who loves helping others. I respond with enthusiasm and positivity while being informative and genuine."
  );
  const [keywords, setKeywords] = useState(["startup", "AI", "productivity", "tech", "innovation"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [previewMode, setPreviewMode] = useState(true);
  const [onlyQuestions, setOnlyQuestions] = useState(false);
  const [positiveOnly, setPositiveOnly] = useState(true);
  const { toast } = useToast();

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your AI personality and filters have been updated successfully!",
    });
  };

  const presetPersonalities = [
    {
      name: "Professional",
      prompt: "I'm a business professional who provides thoughtful, well-researched responses. I maintain a formal yet approachable tone."
    },
    {
      name: "Friendly Helper",
      prompt: "I'm a friendly and enthusiastic person who loves helping others. I respond with warmth and positivity while being genuinely helpful."
    },
    {
      name: "Tech Expert",
      prompt: "I'm a tech enthusiast with deep knowledge in software development and emerging technologies. I share insights and help solve technical problems."
    },
    {
      name: "Creative Thinker",
      prompt: "I'm a creative person who thinks outside the box. I bring fresh perspectives and innovative ideas to conversations."
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Settings</h1>
        <p className="text-slate-600">Customize your AI personality and response behavior</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                AI Personality
              </CardTitle>
              <CardDescription>
                Define how your AI should respond to tweets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="personality">Personality Prompt</Label>
                <Textarea
                  id="personality"
                  value={personalityPrompt}
                  onChange={(e) => setPersonalityPrompt(e.target.value)}
                  rows={4}
                  className="mt-2"
                  placeholder="Describe your personality and how you want to respond..."
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presetPersonalities.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => setPersonalityPrompt(preset.prompt)}
                      className="text-left h-auto p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">{preset.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{preset.prompt}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Response Filters
              </CardTitle>
              <CardDescription>
                Control when and how your AI responds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Preview Mode</Label>
                  <p className="text-sm text-slate-600">Review responses before posting</p>
                </div>
                <Switch checked={previewMode} onCheckedChange={setPreviewMode} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Only Reply to Questions</Label>
                  <p className="text-sm text-slate-600">Only respond to tweets with question marks</p>
                </div>
                <Switch checked={onlyQuestions} onCheckedChange={setOnlyQuestions} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Positive Sentiment Only</Label>
                  <p className="text-sm text-slate-600">Skip negative or controversial tweets</p>
                </div>
                <Switch checked={positiveOnly} onCheckedChange={setPositiveOnly} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Keywords to Track
              </CardTitle>
              <CardDescription>
                Add keywords and hashtags to monitor for relevant tweets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword or #hashtag"
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                />
                <Button onClick={addKeyword}>Add</Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-sm">
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 hover:bg-slate-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {keywords.length === 0 && (
                <p className="text-sm text-slate-500 italic">No keywords added yet. Add some to start monitoring tweets!</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Response Preview</CardTitle>
              <CardDescription>See how your AI would respond to a sample tweet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-200">
                <p className="text-sm text-slate-600 mb-2">Sample Tweet:</p>
                <p className="font-medium mb-3">"Just started learning React and feeling overwhelmed. Any tips for beginners?"</p>
                
                <p className="text-sm text-slate-600 mb-2">Your AI would respond:</p>
                <p className="text-slate-800 bg-white p-3 rounded border">
                  "Welcome to React! 🎉 Start with the official tutorial, practice with small projects, and don't worry about feeling overwhelmed - we've all been there! Take it one concept at a time and you'll be amazed how quickly it clicks. Happy coding!"
                </p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
