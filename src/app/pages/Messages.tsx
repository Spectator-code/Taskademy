import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, Search, Send, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { getEcho } from "../config/echo";
import { useAuth } from "../contexts/AuthContext";
import { messageService } from "../services/message.service";
import { Conversation, Message } from "../types/api";

function formatTime(value?: string) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Messages() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find((conv) => conv.id === selectedChat);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const otherUser =
        conversation.user1_id === user?.id ? conversation.user2 : conversation.user1;

      return otherUser?.name.toLowerCase().includes(query) ?? false;
    });
  }, [conversations, search, user?.id]);

  const selectedUser =
    selectedConversation?.user1_id === user?.id
      ? selectedConversation?.user2
      : selectedConversation?.user1;

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      try {
        const data = await messageService.getConversations();

        if (cancelled) {
          return;
        }

        setConversations(data);
        setSelectedChat((current) => current ?? data[0]?.id ?? null);
      } catch {
        toast.error("Unable to load conversations");
      } finally {
        if (!cancelled) {
          setLoadingConversations(false);
        }
      }
    }

    loadConversations();

    return () => {
      cancelled = true;
    };
  }, []);

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

        if (!cancelled) {
          setMessages([...response.data].reverse());
        }
      } catch {
        toast.error("Unable to load messages");
      } finally {
        if (!cancelled) {
          setLoadingMessages(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) {
      return;
    }

    const echo = getEcho();

    if (!echo) {
      return;
    }

    const channelName = `conversation.${selectedChat}`;
    const channel = echo.private(channelName);

    channel.listen(".message.sent", (event: { message: Message }) => {
      setMessages((current) => {
        if (current.some((message) => message.id === event.message.id)) {
          return current;
        }

        return [...current, event.message];
      });

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === event.message.conversation_id
            ? {
                ...conversation,
                last_message: event.message,
                updated_at: event.message.updated_at,
              }
            : conversation,
        ),
      );
    });

    return () => {
      echo.leave(channelName);
    };
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChat || !messageText.trim() || sending) {
      return;
    }

    const content = messageText.trim();
    setMessageText("");
    setSending(true);

    try {
      const message = await messageService.sendMessage({
        conversation_id: selectedChat,
        content,
      });

      setMessages((current) => [...current, message]);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === message.conversation_id
            ? {
                ...conversation,
                last_message: message,
                updated_at: message.updated_at,
              }
            : conversation,
        ),
      );
    } catch {
      setMessageText(content);
      toast.error("Unable to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {loadingConversations ? (
              <div className="h-full flex items-center justify-center text-foreground/60">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-sm text-foreground/60">No conversations found.</div>
            ) : (
              filteredConversations.map((conv) => {
                const otherUser = conv.user1_id === user?.id ? conv.user2 : conv.user1;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`w-full p-4 border-b border-border hover:bg-card/50 transition-all text-left ${
                      selectedChat === conv.id ? "bg-card" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {otherUser?.avatar ? (
                          <img
                            src={otherUser.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium truncate">{otherUser?.name ?? "Unknown user"}</div>
                          <div className="text-xs text-foreground/60">
                            {formatTime(conv.last_message?.created_at ?? conv.updated_at)}
                          </div>
                        </div>
                        <div className="text-sm text-foreground/60 truncate">
                          {conv.last_message?.content ?? "No messages yet"}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {selectedConversation ? (
            <>
              <div className="p-6 border-b border-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {selectedUser?.avatar ? (
                    <img src={selectedUser.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <div className="font-bold">{selectedUser?.name ?? "Unknown user"}</div>
                  <div className="text-sm text-foreground/60">Conversation</div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center text-foreground/60">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-foreground/60">
                    Start the conversation.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-md ${isOwn ? "order-2" : "order-1"}`}>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border"
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                          <div className="text-xs text-foreground/60 mt-1 px-2">
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

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
                    disabled={sending || !messageText.trim()}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-foreground/60">
              Select a conversation.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
