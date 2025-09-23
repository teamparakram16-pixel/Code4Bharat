import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Message {
  type: "user" | "bot";
  content: string;
}

export function AIConsultPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        type: "bot" as const,
        content:
          "This is a simulated AI response. In production, this would be connected to an actual AI service.",
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
  

      <main className="container mx-auto px-4 py-24">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Bot className="h-6 w-6 text-green-600" />
              AI Health Consultation
            </CardTitle>
            <CardDescription>
              Get instant answers to your health queries from our AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[500px] overflow-y-auto border rounded-lg p-4 space-y-4 bg-white">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <Bot className="h-12 w-12 mb-4" />
                  <p>Start your consultation by asking a question</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.type === "user"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your health query here..."
                className="min-h-[60px]"
              />
              <Button
                type="submit"
                className="px-6 bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

    </div>
  );
}
