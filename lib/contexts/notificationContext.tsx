"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type NotificationType = "cart" | "chat" | "order" | "project" | "render";

type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  reference_id: string;
  is_read: boolean;
  created_at: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: Record<NotificationType, number>;
  markAsRead: (type: NotificationType, referenceId?: string) => Promise<void>;
  markAllAsRead: (type: NotificationType) => Promise<void>;
  hasUnread: (type: NotificationType, referenceId?: string) => boolean;
  refresh: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notifications from Supabase
  async function loadNotifications() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNotifications([]);
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_read", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading notifications:", error);
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate unread count by type
  const unreadCount: Record<NotificationType, number> = {
    cart: notifications.filter((n) => n.type === "cart").length,
    chat: notifications.filter((n) => n.type === "chat").length,
    order: notifications.filter((n) => n.type === "order").length,
    project: notifications.filter((n) => n.type === "project").length,
    render: notifications.filter((n) => n.type === "render").length,
  };

  // Mark specific notification as read
  async function markAsRead(type: NotificationType, referenceId?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("type", type);

      if (referenceId) {
        query = query.eq("reference_id", referenceId);
      }

      const { error } = await query;

      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }

      // Update local state
      setNotifications((prev) =>
        prev.filter((n) => {
          if (n.type !== type) return true;
          if (referenceId && n.reference_id !== referenceId) return true;
          return false;
        })
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Mark all notifications of a type as read
  async function markAllAsRead(type: NotificationType) {
    await markAsRead(type);
  }

  // Check if there are unread notifications
  function hasUnread(type: NotificationType, referenceId?: string): boolean {
    return notifications.some((n) => {
      if (n.type !== type) return false;
      if (referenceId && n.reference_id !== referenceId) return false;
      return true;
    });
  }

  // Set up real-time subscription
  useEffect(() => {
    loadNotifications();

    const { data: { user } } = supabase.auth.getUser();
    
    user.then((userData) => {
      if (!userData.user) return;

      const channel = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userData.user.id}`,
          },
          () => {
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        hasUnread,
        refresh: loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
