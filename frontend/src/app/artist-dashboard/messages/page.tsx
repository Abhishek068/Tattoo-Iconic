"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Phone,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  Paperclip,
  DollarSign,
  Calendar,
} from "lucide-react";
import { messageService } from "@/services/message.service";
import type { MessageThread } from "@/types";
import toast from "react-hot-toast";

export default function ArtistMessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [replyText, setReplyText] = useState("");

  const loadData = () => {
    messageService.getAll().then((data) => {
      setThreads(data);
      if (data.length > 0 && !activeThreadId) {
        setActiveThreadId(data[0].id);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const updated = await messageService.sendMessage(activeThread.id, replyText.trim());
    if (updated) {
      setReplyText("");
      toast.success("Consultation reply sent!");
      loadData();
    }
  }

  function handleQuickReply(template: string) {
    setReplyText(template);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
            Consultation Inbox &amp; Direct Messaging
          </h2>
          <p className="text-xs sm:text-sm text-[#8e90a0] mt-1">
            Discuss design concepts, verify anatomical placements, and send custom deposit agreements.
          </p>
        </div>
      </div>

      {/* Split Chat View */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl overflow-hidden grid lg:grid-cols-12 min-h-[600px]">
        {/* Left Threads Column */}
        <div className="lg:col-span-4 border-r border-white/10 flex flex-col justify-between bg-[#0a0c12]">
          <div>
            <div className="p-4 border-b border-white/10">
              <span className="text-xs font-serif font-bold text-white uppercase tracking-wider block">
                Active Client Consultations ({threads.length})
              </span>
            </div>

            <div className="divide-y divide-white/5 overflow-y-auto max-h-[520px]">
              {threads.map((thread) => {
                const isSelected = activeThread?.id === thread.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      messageService.markAsRead(thread.id);
                    }}
                    className={`p-4 transition-colors cursor-pointer space-y-1.5 ${
                      isSelected
                        ? "bg-amber-500/15 border-l-4 border-amber-400"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-serif font-bold text-white truncate">
                        {thread.customer_name}
                      </strong>
                      {thread.unread && (
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                      )}
                    </div>

                    <p className="text-[11px] text-amber-300 truncate">
                      {thread.tattoo_concept} ({thread.preferred_style})
                    </p>

                    <p className="text-xs text-[#8e90a0] line-clamp-1">
                      {thread.last_message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Active Conversation Area */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#0d0f14]">
          {activeThread ? (
            <>
              {/* Chat Top Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#10131c]">
                <div className="space-y-0.5">
                  <h3 className="font-serif text-base font-bold text-white">
                    {activeThread.customer_name}
                  </h3>
                  <p className="text-xs text-[#8e90a0]">
                    Concept: <span className="text-amber-200">{activeThread.tattoo_concept}</span> · {activeThread.preferred_style}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${activeThread.customer_phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 font-semibold hover:bg-emerald-500/20 transition-colors"
                  >
                    Open WhatsApp
                  </a>
                </div>
              </div>

              {/* Chat Messages Timeline */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 max-h-[420px]">
                {activeThread.messages.map((msg) => {
                  const isArtist = msg.sender === "artist";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isArtist ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl p-4 text-xs space-y-1 ${
                          isArtist
                            ? "bg-gradient-to-r from-[#c5a059] to-[#d8b467] text-[#0a0a0a] font-medium rounded-br-none shadow-md shadow-amber-500/10"
                            : "bg-[#141722] border border-white/10 text-[#f5f0eb] rounded-bl-none"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <span
                          className={`text-[9px] block text-right font-mono ${
                            isArtist ? "text-black/60" : "text-[#747688]"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Response Templates & Reply Form */}
              <div className="p-4 border-t border-white/10 bg-[#0a0c12] space-y-3">
                {/* Quick Templates */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[10px] text-[#525463] uppercase font-bold shrink-0">Quick:</span>
                  <button
                    onClick={() => handleQuickReply("Namaste! Your concept is approved. Please transfer the deposit of ₹1,000 to confirm your slot.")}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[#8e90a0] hover:text-white whitespace-nowrap"
                  >
                    Send Deposit Link
                  </button>
                  <button
                    onClick={() => handleQuickReply("I recommend resizing the stencil by +15% so the fine-line details heal crisp over time.")}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[#8e90a0] hover:text-white whitespace-nowrap"
                  >
                    Stencil Advice
                  </button>
                  <button
                    onClick={() => handleQuickReply("Doorstep luxury home service is confirmed for your date. Our sterile unit will arrive at 11:00 AM.")}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[#8e90a0] hover:text-white whitespace-nowrap"
                  >
                    Confirm Home Visit
                  </button>
                </div>

                {/* Input form */}
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type artist reply or design consultation note..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder:text-[#525463] focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b467] p-3 text-[#0a0a0a] hover:brightness-110 transition-all shrink-0 cursor-pointer"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-[#8e90a0]">
              Select a conversation to begin chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
