import { supabase } from "@/lib/supabase";

type NotificationType = "cart" | "chat" | "order" | "project" | "render";

export const notificationService = {
  // Create a new notification
  async create(
    type: NotificationType,
    referenceId: string,
    userId?: string
  ): Promise<void> {
    try {
      // Get current user if not provided
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        userId = user.id;
      }

      // Check if notification already exists for this reference
      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", userId)
        .eq("type", type)
        .eq("reference_id", referenceId)
        .eq("is_read", false)
        .single();

      // Only create if doesn't exist
      if (!existing) {
        const { error } = await supabase.from("notifications").insert({
          user_id: userId,
          type,
          reference_id: referenceId,
          is_read: false,
        });

        if (error) {
          console.error("Error creating notification:", error);
        }
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  },

  // Mark notification(s) as read
  async markAsRead(
    type: NotificationType,
    referenceId?: string,
    userId?: string
  ): Promise<void> {
    try {
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        userId = user.id;
      }

      let query = supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("type", type);

      if (referenceId) {
        query = query.eq("reference_id", referenceId);
      }

      const { error } = await query;

      if (error) {
        console.error("Error marking notification as read:", error);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  // Delete notification(s)
  async delete(
    type: NotificationType,
    referenceId?: string,
    userId?: string
  ): Promise<void> {
    try {
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        userId = user.id;
      }

      let query = supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId)
        .eq("type", type);

      if (referenceId) {
        query = query.eq("reference_id", referenceId);
      }

      const { error } = await query;

      if (error) {
        console.error("Error deleting notification:", error);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  },

  // Get unread count
  async getUnreadCount(
    type: NotificationType,
    userId?: string
  ): Promise<number> {
    try {
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;
        userId = user.id;
      }

      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("type", type)
        .eq("is_read", false);

      if (error) {
        console.error("Error getting unread count:", error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  },
};
