import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Loader2, Search, Send, User, 
  MoreHorizontal, Phone, Video, Info, 
  Circle, Smile, Paperclip, ChevronLeft,
  Check, CheckCheck, Clock
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { getEcho } from "../config/echo";
import { useAuth } from "../contexts/AuthContext";
import { messageService } from "../services/message.service";
import { Conversation, Message } from "../types/api";
import { useTranslation } from "../hooks/useTranslation";

function formatTime(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "Today";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Messages() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getConversationLabel = (conversation: Conversation) => {
    if (conversation.is_group) return conversation.title || "Group Conversation";
    const otherUser = conversation.user1_id === user?.id ? conversation.user2 : conversation.user1;
    return otherUser?.name ?? "Unknown user";
  };

  const selectedConversation = conversations.find((conv) => conv.id === selectedChat);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const participantNames = (conversation.participants ?? []).map((p) => p.name).join(" ");
      const label = getConversationLabel(conversation);
      return `${label} ${participantNames}`.toLowerCase().includes(query);
    });
  }, [conversations, search, user?.id]);

  const otherParticipant = selectedConversation?.user1_id === user?.id
    ? selectedConversation?.user2
    : selectedConversation?.user1;

  useEffect(() => {
    let cancelled = false;
    const requestedConversationId =
      typeof location.state === "object" && location.state && "conversationId" in location.state
        ? Number((location.state as { conversationId?: number }).conversationId)
        : null;

    async function loadConversations() {
      try {
        const data = await messageService.getConversations();
        if (cancelled) return;
        setConversations(data);
        setSelectedChat((current) => current ?? requestedConversationId ?? data[0]?.id ?? null);
      } catch {
        toast.error("Unable to load conversations");
      } finally {
        if (!cancelled) setLoadingConversations(false);
      }
    }
    loadConversations();
    return () => { cancelled = true; };
  }, [location.state]);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    setLoadingMessages(true);
    async function loadMessages() {
      try {
        const response = await messageService.getMessages(selectedChat);
        if (!cancelled) setMessages([...response.data].reverse());
      } catch {
        toast.error("Unable to load messages");
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    }
    loadMessages();
    return () => { cancelled = true; };
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;
    const echo = getEcho();
    if (!echo) return;
    const channelName = `conversation.${selectedChat}`;
    const channel = echo.private(channelName);
    channel.listen(".message.sent", (event: { message: Message }) => {
      setMessages((current) => {
        if (current.some((m) => m.id === event.message.id)) return current;
        return [...current, event.message];
      });
      setConversations((current) =>
        current.map((conv) =>
          conv.id === event.message.conversation_id
            ? { ...conv, last_message: event.message, updated_at: event.message.updated_at }
            : conv
        )
      );
    });
    return () => { echo.leave(channelName); };
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !messageText.trim() || sending) return;
    const content = messageText.trim();
    setMessageText("");
    setSending(true);
    try {
      const message = await messageService.sendMessage({ conversation_id: selectedChat, content });
      setMessages((current) => [...current, message]);
      setConversations((current) =>
        current.map((conv) =>
          conv.id === message.conversation_id
            ? { ...conv, last_message: message, updated_at: message.updated_at }
            : conv
        )
      );
    } catch {
      setMessageText(content);
      toast.error("Unable to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Conversations Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-[400px] border-r border-white/5 flex flex-col bg-card/20 backdrop-blur-3xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              {t("messages") || "Messages"}
            </h1>
            <Link 
              to="/dashboard"
              className="p-2 rounded-xl bg-white/5 text-foreground/40 hover:text-foreground transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-11 pr-4 py-3.5 rounded-[1.25rem] bg-black/20 border border-white/5 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {loadingConversations ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Syncing Chats...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-foreground/10" />
              </div>
              <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">No results found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const other = conv.user1_id === user?.id ? conv.user2 : conv.user1;
              const isActive = selectedChat === conv.id;
              
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full p-4 rounded-[1.5rem] flex items-center gap-4 transition-all duration-300 relative group ${
                    isActive ? "bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5" : "hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border border-white/5 shadow-xl">
                      {other?.avatar_url ? (
                        <img src={other.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    {isActive && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute -right-1 -top-1 w-4 h-4 bg-primary rounded-full border-4 border-background"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-black text-sm truncate ${isActive ? 'text-primary' : ''}`}>
                        {getConversationLabel(conv)}
                      </h4>
                      <span className="text-[10px] font-black uppercase text-foreground/20 shrink-0 ml-2">
                        {formatDate(conv.last_message?.created_at ?? conv.updated_at)}
                      </span>
                    </div>
                    <p className={`text-xs truncate font-medium ${isActive ? 'text-foreground/60' : 'text-foreground/40'}`}>
                      {conv.last_message?.content || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-card/10">
        <AnimatePresence mode="wait">
          {selectedConversation ? (
            <motion.div 
              key={selectedChat}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* Chat Header */}
              <header className="p-6 border-b border-white/5 flex items-center justify-between bg-card/20 backdrop-blur-xl z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border border-white/5">
                    {otherParticipant?.avatar_url ? (
                      <img src={otherParticipant.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black tracking-tight">{getConversationLabel(selectedConversation)}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link 
                    to={otherParticipant?.id ? `/profile/${otherParticipant.id}` : '#'}
                    className="p-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Info className="w-4 h-4" />
                  </Link>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary/20" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-primary/5 flex items-center justify-center mb-6">
                      <Smile className="w-10 h-10 text-primary/20" />
                    </div>
                    <h4 className="text-lg font-black mb-2">Say Hello!</h4>
                    <p className="text-sm text-foreground/40 font-medium">Start the conversation with {getConversationLabel(selectedConversation)}.</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isOwn = msg.sender_id === user?.id;
                    const showAvatar = idx === 0 || messages[idx-1].sender_id !== msg.sender_id;
                    
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, x: isOwn ? 10 : -10 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        className={`flex items-end gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 shrink-0 ${!showAvatar ? 'opacity-0' : ''}`}>
                          {isOwn ? (
                            user?.avatar_url ? <img src={user.avatar_url} /> : <User className="w-4 h-4 text-primary" />
                          ) : (
                            otherParticipant?.avatar_url ? <img src={otherParticipant.avatar_url} /> : <User className="w-4 h-4 text-foreground/40" />
                          )}
                        </div>
                        <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                          <div className={`px-6 py-3.5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-2xl ${
                            isOwn 
                              ? 'bg-primary text-primary-foreground rounded-br-none shadow-primary/20' 
                              : 'bg-card/40 backdrop-blur-xl border border-white/5 rounded-bl-none shadow-black/20'
                          }`}>
                            {msg.content}
                          </div>
                          <div className={`mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-foreground/20`}>
                            {formatTime(msg.created_at)}
                            {isOwn && <CheckCheck className="w-3 h-3 text-primary" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <footer className="p-8 bg-card/10 backdrop-blur-2xl">
                <form 
                  onSubmit={handleSendMessage}
                  className="max-w-4xl mx-auto flex items-center gap-4 p-2 bg-black/20 border border-white/5 rounded-[2.5rem] focus-within:border-primary/40 focus-within:ring-8 focus-within:ring-primary/5 transition-all shadow-2xl shadow-black/40"
                >
                  <button type="button" className="p-4 rounded-[1.75rem] text-foreground/20 hover:text-primary transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium placeholder:text-foreground/10 px-2"
                  />
                  <button 
                    type="submit" 
                    disabled={!messageText.trim() || sending}
                    className="p-4 rounded-[1.75rem] bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-primary/20"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              </footer>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-32 h-32 rounded-[3.5rem] bg-card/20 backdrop-blur-3xl border border-white/5 flex items-center justify-center mb-10 shadow-2xl group animate-float">
                <Send className="w-12 h-12 text-primary/40 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
              </div>
              <h2 className="text-3xl font-black mb-4 tracking-tighter">Your Inner Circle</h2>
              <p className="text-foreground/40 max-w-sm mx-auto font-medium leading-relaxed">
                Connect with clients and students to finalize details and get things done. Select a chat to begin.
              </p>
            </div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
