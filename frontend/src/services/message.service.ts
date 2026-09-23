import { INITIAL_MESSAGES } from "@/data/dashboard";
import type { MessageThread, ConsultationMessage } from "@/types";

const STORAGE_KEY = "tattoo_iconic_messages_v5";

function getStoredMessages(): MessageThread[] {
  if (typeof window === "undefined") return INITIAL_MESSAGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_MESSAGES;
  } catch {
    return INITIAL_MESSAGES;
  }
}

function saveStoredMessages(items: MessageThread[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save messages:", err);
  }
}

export const messageService = {
  async getAll(): Promise<MessageThread[]> {
    return getStoredMessages();
  },

  async getById(id: string): Promise<MessageThread | null> {
    const items = getStoredMessages();
    return items.find((m) => m.id === id) || null;
  },

  async sendMessage(threadId: string, text: string): Promise<MessageThread | null> {
    const items = getStoredMessages();
    const index = items.findIndex((m) => m.id === threadId);
    if (index === -1) return null;

    const newMsg: ConsultationMessage = {
      id: `msg-${Date.now()}`,
      sender: "artist",
      text,
      timestamp: new Date().toISOString(),
    };

    items[index].messages.push(newMsg);
    items[index].last_message = text;
    items[index].last_updated = new Date().toISOString();
    items[index].unread = false;

    saveStoredMessages(items);
    return items[index];
  },

  async markAsRead(threadId: string): Promise<void> {
    const items = getStoredMessages();
    const index = items.findIndex((m) => m.id === threadId);
    if (index !== -1) {
      items[index].unread = false;
      saveStoredMessages(items);
    }
  },
};
