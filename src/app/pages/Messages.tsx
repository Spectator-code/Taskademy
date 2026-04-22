import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Send, User, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const conversations = [
  {
    id: 1,
    name: "Sarah Chen",
    lastMessage: "Thanks! I'll review the designs",
    time: "2m ago",
    unread: true
  },
  {
    id: 2,
    name: "Michael Brown",
    lastMessage: "When can you start?",
    time: "1h ago",
    unread: false
  },
  {
    id: 3,
    name: "Emma Davis",
    lastMessage: "Perfect, approved!",
    time: "3h ago",
    unread: false
  }
];

const initialMessages = [
  {
    id: 1,
    sender: "Sarah Chen",
    text: "Hi! I saw your portfolio and I'm interested in hiring you for a project.",
    time: "10:30 AM",
    isOwn: false
  },
  {
    id: 2,
    sender: "You",
    text: "Hello! Thanks for reaching out. I'd love to hear more about the project.",
    time: "10:32 AM",
    isOwn: true
  },
  {
    id: 3,
    sender: "Sarah Chen",
    text: "Great! I need a landing page designed for a SaaS product. Can you share some similar work?",
    time: "10:35 AM",
    isOwn: false
  },
  {
    id: 4,
    sender: "You",
    text: "Absolutely! I've worked on several SaaS landing pages. Let me share my recent project.",
    time: "10:38 AM",
    isOwn: true
  }
];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      const currentTime = new Date();
      const timeString = currentTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        text: messageText.trim(),
        time: timeString,
        isOwn: true
      };

      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-80 border-r border-border flex flex-col"
        >
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                className={`w-full p-4 border-b border-border hover:bg-card/50 transition-all text-left ${
                  selectedChat === conv.id ? "bg-card" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium truncate">{conv.name}</div>
                      <div className="text-xs text-foreground/60">{conv.time}</div>
                    </div>
                    <div className={`text-sm truncate ${conv.unread ? "text-foreground" : "text-foreground/60"}`}>
                      {conv.lastMessage}
                    </div>
                  </div>
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {/* Chat Header */}
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-bold">Sarah Chen</div>
              <div className="text-sm text-foreground/60">Active now</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-md ${msg.isOwn ? "order-2" : "order-1"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <div className="text-xs text-foreground/60 mt-1 px-2">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-6 border-t border-border">
            <div className="flex gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}