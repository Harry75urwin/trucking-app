import { useEffect, useRef, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Send,
  Plus,
  MessageSquare,
  Users,
  Loader2,
  User,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuthSession } from "@/lib/auth-session";
import { useSocket } from "@/lib/socket-context";
import {
  fetchConversations,
  createConversation,
  fetchMessages,
  fetchUsers,
  fetchLoads,
  type BackendConversation,
  type BackendMessage,
  type BackendUser,
  type BackendLoad,
} from "@/lib/trucker-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tab = "conversations" | "users";

export default function ChatPage() {
  const { t } = useLanguage();
  const { session } = useAuthSession();
  const { socket, isConnected } = useSocket();
  const currentUser = session.user;
  const [tab, setTab] = useState<Tab>("conversations");
  const [conversations, setConversations] = useState<BackendConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<BackendConversation | null>(null);
  const [messages, setMessages] = useState<BackendMessage[]>([]);
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loads, setLoads] = useState<BackendLoad[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [newConvoReceiver, setNewConvoReceiver] = useState<number | "">("");
  const [newConvoLoad, setNewConvoLoad] = useState("");
  const [typingUserIds, setTypingUserIds] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevConversationIdRef = useRef<string | undefined>(undefined);
  const selectedConversationIdRef = useRef<string | undefined>(undefined);

  const currentUserId = currentUser?.id ?? 0;

  const getInitials = (user: BackendUser) =>
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  const getConversationName = (conv: BackendConversation) => {
    if (conv.createdBy === currentUserId) {
      if (conv.receiverId && conv.receiverId !== currentUserId) {
        const u = users.find((x) => x.id === conv.receiverId);
        return u ? `${u.firstName} ${u.lastName}` : t("Unknown", "अज्ञात");
      }
      return t("You", "आप");
    }
    const u = users.find((x) => x.id === conv.createdBy);
    return u ? `${u.firstName} ${u.lastName}` : t("Unknown", "अज्ञात");
  };

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const [convos, allUsers, allLoads] = await Promise.all([
        fetchConversations(session, currentUserId),
        fetchUsers(session),
        fetchLoads(session),
      ]);
      const otherUsers = allUsers.filter((u) => u.id !== currentUserId);
      setConversations(convos);
      setUsers(otherUsers);
      setLoads(allLoads);
      if (convos.length > 0) setSelectedConversation(convos[0]);
    } catch {}
    setLoading(false);
  }, [session, currentUserId]);

  useEffect(() => {
    if (session.isAuthenticated) loadInitial();
  }, [session, loadInitial]);

  const loadMessages = useCallback(
    async (conversationId: string, silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await fetchMessages(session, conversationId);
        setMessages((prev) => {
          if (
            prev.length === data.length &&
            prev.every((m, i) => m.id === data[i]?.id)
          )
            return prev;
          return data;
        });
      } catch {}
      if (!silent) setLoading(false);
    },
    [session],
  );

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation?.id, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (message: BackendMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        if (message.conversationId !== selectedConversationIdRef.current)
          return prev;
        const existingIndex = prev.findIndex((m) => m.id === message.id);
        if (existingIndex !== -1) {
          const next = [...prev];
          next[existingIndex] = message;
          return next;
        }
        return [...prev, message];
      });
      setConversations((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((c) => c.id === message.conversationId);
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            lastMessageAt: message.createdAt,
            updatedAt: message.createdAt,
          };
          updated.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          );
        }
        return updated;
      });
    };

    const onMessageRead = ({ messageId }: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m)),
      );
    };

    const onUserTyping = ({ userId }: { userId: number }) => {
      if (userId !== currentUserId) {
        setTypingUserIds((prev) => {
          const next = new Set(prev);
          next.add(userId);
          return next;
        });
      }
    };

    const onUserStopTyping = ({ userId }: { userId: number }) => {
      if (userId !== currentUserId) {
        setTypingUserIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    };

    socket.on("newMessage", onNewMessage);
    socket.on("messageRead", onMessageRead);
    socket.on("userTyping", onUserTyping);
    socket.on("userStopTyping", onUserStopTyping);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("messageRead", onMessageRead);
      socket.off("userTyping", onUserTyping);
      socket.off("userStopTyping", onUserStopTyping);
    };
  }, [socket, currentUserId]);

  useEffect(() => {
    if (!socket) return;

    const prevId = prevConversationIdRef.current;
    if (prevId && prevId !== selectedConversation?.id) {
      socket.emit("leaveConversation", { conversationId: prevId });
    }
    if (selectedConversation) {
      socket.emit("joinConversation", {
        conversationId: selectedConversation.id,
      });
    }
    prevConversationIdRef.current = selectedConversation?.id;
    selectedConversationIdRef.current = selectedConversation?.id;
  }, [selectedConversation?.id, socket]);

  const handleSend = async () => {
    if (!selectedConversation || !messageBody.trim() || !socket || !isConnected)
      return;
    setSending(true);
    try {
      const receiverId =
        selectedConversation.createdBy === currentUserId
          ? (selectedConversation.receiverId ?? 0)
          : selectedConversation.createdBy;
      const saved = await new Promise<BackendMessage>((resolve, reject) => {
        const timeout = window.setTimeout(
          () => reject(new Error("Timed out sending message")),
          10000,
        );
        let settled = false;
        const finish = () => {
          window.clearTimeout(timeout);
          settled = true;
        };
        const onDisconnect = () => {
          if (settled) return;
          finish();
          reject(new Error("Disconnected while sending message"));
        };
        socket.once("disconnect", onDisconnect);
        socket.emit(
          "sendMessage",
          {
            conversationId: selectedConversation.id,
            senderId: currentUserId,
            receiverId,
            body: messageBody.trim(),
          },
          (
            response:
              | BackendMessage
              | { event?: string; data?: BackendMessage; message?: string },
          ) => {
            if (settled) return;
            finish();
            socket.off("disconnect", onDisconnect);
            const data =
              response && typeof response === "object" && "data" in response
                ? response.data
                : response;
            if (data && typeof data === "object" && "id" in data) {
              resolve(data as BackendMessage);
            } else {
              reject(
                new Error(
                  response &&
                    typeof response === "object" &&
                    "message" in response &&
                    typeof response.message === "string"
                    ? response.message
                    : "Failed to send message",
                ),
              );
            }
          },
        );
      });
      setMessages((prev) => {
        const existingIndex = prev.findIndex((m) => m.id === saved.id);
        if (existingIndex !== -1) {
          const next = [...prev];
          next[existingIndex] = saved;
          return next;
        }
        return [...prev, saved];
      });
      setMessageBody("");
    } catch {}
    setSending(false);
  };

  const handleCreateConversation = async () => {
    if (!newConvoReceiver) return;
    setLoading(true);
    try {
      const convo = await createConversation(session, {
        userId: currentUserId,
        receiverId: newConvoReceiver,
        loadId: newConvoLoad || undefined,
      });
      setConversations((prev) => [convo, ...prev]);
      setSelectedConversation(convo);
      setShowNewConvo(false);
      setNewConvoReceiver("");
      setNewConvoLoad("");
      setTab("conversations");
    } catch {}
    setLoading(false);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const name = getConversationName(c).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const filteredUsers = users.filter((u) => {
    const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
    return (
      name.includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4 p-4">
      <Card className="w-80 border-0 bg-card/50 backdrop-blur-sm flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">
                {t("Messages", "संदेश")}
              </CardTitle>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setShowNewConvo(!showNewConvo)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {showNewConvo && (
            <div className="mt-3 space-y-2">
              <Select
                value={newConvoReceiver ? String(newConvoReceiver) : ""}
                onValueChange={(v) => setNewConvoReceiver(Number(v))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue
                    placeholder={t(
                      "Select recipient...",
                      "प्राप्तकर्ता चुनें...",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem
                      key={u.id}
                      value={String(u.id)}
                      className="text-xs"
                    >
                      {u.firstName} {u.lastName} ({u.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newConvoLoad} onValueChange={setNewConvoLoad}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue
                    placeholder={t(
                      "Link to load (optional)",
                      "लोड से जोड़ें (वैकल्पिक)",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {loads.map((l) => (
                    <SelectItem key={l.id} value={l.id} className="text-xs">
                      {l.load_number} — {l.origin_city} → {l.destination_city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="w-full h-8 text-xs bg-linear-to-r from-purple-600 to-indigo-600"
                onClick={handleCreateConversation}
                disabled={!newConvoReceiver}
              >
                <Plus className="w-3 h-3 mr-1" />{" "}
                {t("Start Chat", "चैट शुरू करें")}
              </Button>
            </div>
          )}
        </CardHeader>
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="pl-8 h-8 text-xs bg-background/80 dark:bg-slate-800/50"
              placeholder={t("Search conversations...", "वार्तालाप खोजें...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as Tab)}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="mx-4 mt-1 h-8">
            <TabsTrigger value="conversations" className="text-xs h-6">
              {t("Chats", "चैट")}
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs h-6">
              {t("People", "लोग")}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="conversations"
            className="flex-1 overflow-auto mt-1 px-2 pb-2"
          >
            {loading ? (
              <div className="py-8 text-center text-muted-foreground text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />{" "}
                {t("Loading...", "लोड हो रहा है...")}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs">
                {t("No conversations yet", "अभी तक कोई वार्तालाप नहीं")}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors ${selectedConversation?.id === conv.id ? "bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800" : "hover:bg-muted/50"}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white text-xs">
                          {getInitials({
                            firstName: getConversationName(conv).split(" ")[0],
                            lastName: "",
                            id: 0,
                            email: "",
                          } as BackendUser)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {getConversationName(conv)}
                          </p>
                          {conv.lastMessageAt && (
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(
                                conv.lastMessageAt,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {t("Conversation", "वार्तालाप")}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent
            value="users"
            className="flex-1 overflow-auto mt-1 px-2 pb-2"
          >
            {filteredUsers.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs">
                {t("No users found", "कोई उपयोगकर्ता नहीं मिला")}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setNewConvoReceiver(u.id);
                      setShowNewConvo(true);
                      setTab("conversations");
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-linear-to-br from-purple-500 to-indigo-600 text-white text-xs">
                          {getInitials(u)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {u.role} · {u.email}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="flex-1 border-0 bg-card/50 backdrop-blur-sm flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white text-sm">
                    {getInitials({
                      firstName:
                        getConversationName(selectedConversation).split(" ")[0],
                      lastName: "",
                      id: 0,
                      email: "",
                    } as BackendUser)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">
                    {getConversationName(selectedConversation)}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t("Conversation", "वार्तालाप")}
                  </CardDescription>
                </div>
                {!isConnected && (
                  <Badge variant="destructive" className="ml-auto">
                    Reconnecting...
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4">
              {loading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />{" "}
                  {t("Loading messages...", "संदेश लोड हो रहे हैं...")}
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                  {t(
                    "No messages yet. Start the conversation!",
                    "अभी तक कोई संदेश नहीं। वार्तालाप शुरू करें!",
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => {
                    const isMine = msg.senderId === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMine ? "bg-linear-to-br from-purple-600 to-indigo-600 text-white rounded-br-sm" : "bg-muted/80 dark:bg-slate-800/80 rounded-bl-sm"}`}
                        >
                          <p className="text-sm whitespace-pre-wrap wrap-break-word">
                            {msg.body}
                          </p>
                          <p
                            className={`text-[10px] mt-1 ${isMine ? "text-white/70" : "text-muted-foreground"}`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {typingUserIds.size > 0 && (
                    <div className="flex justify-start text-xs text-muted-foreground">
                      {t("Someone is typing...", "कोई टाइप कर रहा है...")}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>
            <div className="p-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1 h-10 text-sm bg-background/80 dark:bg-slate-800/50"
                  placeholder={t("Type a message...", "संदेश लिखें...")}
                  value={messageBody}
                  onChange={(e) => {
                    setMessageBody(e.target.value);
                    if (e.target.value && socket && selectedConversation) {
                      socket.emit("typing", {
                        conversationId: selectedConversation.id,
                      });
                    }
                  }}
                  onBlur={() => {
                    if (socket && selectedConversation) {
                      socket.emit("stopTyping", {
                        conversationId: selectedConversation.id,
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (socket && selectedConversation) {
                        socket.emit("stopTyping", {
                          conversationId: selectedConversation.id,
                        });
                      }
                      handleSend();
                    }
                  }}
                />
                <Separator orientation="vertical" className="h-10 mx-1" />
                <Button
                  size="icon"
                  className="h-10 w-10 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleSend}
                  disabled={sending || !messageBody.trim()}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            <div className="text-center space-y-2">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p>
                {t(
                  "Select a conversation to start messaging",
                  "संदेश शुरू करने के लिए वार्तालाप चुनें",
                )}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
