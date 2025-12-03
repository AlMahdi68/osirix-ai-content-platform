"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUPPORT_RESPONSES = {
  greeting: [
    "Hello! I'm your Osirix support assistant. How can I help you today?",
    "Hi there! Welcome to Osirix support. What can I assist you with?",
    "Hey! I'm here to help. What do you need assistance with?",
  ],
  social_accounts: [
    "To connect your social media accounts, go to Settings > Social Accounts and click 'Connect' on any platform. You'll be redirected to authorize Osirix to post on your behalf.",
    "Having trouble connecting social accounts? Make sure pop-ups are enabled in your browser and you're logged into the social platform you want to connect.",
  ],
  oz_agent: [
    "OZ is your autonomous AI agent that executes money-making workflows. Visit the /oz page to start the agent, choose a strategy, and set your revenue target. OZ will automatically create content, list products, and schedule social posts!",
    "The OZ Agent works 24/7 to generate income for you. It creates digital products, generates logos and videos, schedules social posts, and optimizes everything for maximum revenue.",
  ],
  credits: [
    "Credits are used for AI generation tasks like TTS, video creation, and logo design. You can purchase credits or subscribe to a plan that includes monthly credits. Check /plans for available options.",
    "Running low on credits? Upgrade your plan at /plans to get more monthly credits and unlock additional features.",
  ],
  marketplace: [
    "The marketplace at /marketplace allows you to sell digital products you create. You can also list AI-generated logos, videos, and other content. Visit /marketplace/sell to create a new listing.",
    "To sell on the marketplace, create high-quality digital products (logos, videos, templates, etc.) and list them with competitive pricing. The marketplace handles payments and delivery automatically.",
  ],
  payments: [
    "Osirix uses Stripe for secure payments. You can manage your subscription and billing at /plans. Your payment information is encrypted and secure.",
    "To upgrade your plan, visit /plans and choose a tier that fits your needs. You'll be redirected to Stripe for secure checkout.",
  ],
  sponsorships: [
    "The sponsorships feature connects brands with influencers. Brands can post opportunities at /sponsorships/create, and influencers can apply to collaborate. Deals are managed through the platform with escrow protection.",
    "Looking for brand deals? Check /sponsorships to browse active opportunities. Apply with your pitch and portfolio links to get started!",
  ],
  wallet: [
    "Your wallet at /wallet tracks all earnings from marketplace sales, sponsorships, and other monetization features. You can withdraw funds once you reach the minimum threshold.",
    "To withdraw earnings, go to /wallet and click 'Withdraw'. Choose your payment method (PayPal, bank transfer, or crypto) and submit your request. Withdrawals are typically processed within 2-3 business days.",
  ],
  ai_features: [
    "Osirix offers multiple AI features: AI Manager (Manus) for autonomous business management, AI Characters for influencer creation, AI Logos for brand design, AI Products for digital goods, and AI Campaigns for marketing strategy.",
    "All AI features are accessible from the dashboard. Each tool helps automate a different aspect of your online business, from content creation to marketing to sales.",
  ],
  default: [
    "I'm not sure about that specific question, but I'm here to help! Could you provide more details or try asking in a different way?",
    "I want to make sure I give you accurate information. Could you rephrase your question or provide more context?",
  ],
};

const QUICK_ACTIONS = [
  { label: "Connect Social Accounts", keywords: ["social", "connect", "twitter", "facebook", "instagram"] },
  { label: "How does OZ work?", keywords: ["oz", "agent", "autonomous", "money"] },
  { label: "Purchase Credits", keywords: ["credits", "purchase", "buy", "plans"] },
  { label: "Sell on Marketplace", keywords: ["marketplace", "sell", "products"] },
  { label: "Manage Billing", keywords: ["billing", "payment", "subscription", "upgrade"] },
];

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: SUPPORT_RESPONSES.greeting[0],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpenSupport = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };

    window.addEventListener("openSupportChat", handleOpenSupport);
    return () => window.removeEventListener("openSupportChat", handleOpenSupport);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const getResponseCategory = (userMessage: string): keyof typeof SUPPORT_RESPONSES => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.match(/social|twitter|facebook|instagram|linkedin|youtube|connect|post/i)) {
      return "social_accounts";
    }
    if (lowerMessage.match(/oz|agent|autonomous|workflow|money|revenue/i)) {
      return "oz_agent";
    }
    if (lowerMessage.match(/credit|purchase|buy|balance/i)) {
      return "credits";
    }
    if (lowerMessage.match(/marketplace|sell|product|listing/i)) {
      return "marketplace";
    }
    if (lowerMessage.match(/payment|billing|subscription|stripe|plan|upgrade/i)) {
      return "payments";
    }
    if (lowerMessage.match(/sponsorship|brand|influencer|deal|collaborate/i)) {
      return "sponsorships";
    }
    if (lowerMessage.match(/wallet|withdraw|earnings|payout/i)) {
      return "wallet";
    }
    if (lowerMessage.match(/ai|character|logo|campaign|manager|manus/i)) {
      return "ai_features";
    }
    if (lowerMessage.match(/hello|hi|hey|help|support/i)) {
      return "greeting";
    }
    
    return "default";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const category = getResponseCategory(userMessage.content);
      const responses = SUPPORT_RESPONSES[category];
      const response = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    setInput(action.label);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 p-0"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-96 shadow-2xl border-primary/30 z-50 transition-all ${
        isMinimized ? "h-16" : "h-[600px]"
      }`}
    >
      <CardHeader className="p-4 border-b bg-gradient-to-r from-primary/20 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Osirix Support</CardTitle>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-73px)]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.role === "user"
                        ? "bg-primary/20"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={`flex-1 p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-12"
                        : "bg-muted mr-12"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-muted mr-12">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="p-4 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
