export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          role: 'designer' | 'client' | 'admin';
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          role?: 'designer' | 'client' | 'admin';
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          role?: 'designer' | 'client' | 'admin';
        };
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          scope: '1BHK' | '2BHK' | '3BHK' | 'Commercial';
          status: 'wip' | 'screenshots_shared' | 'approved' | 'renders_shared' | 'delivering' | 'delivered';
          address: string;
          notes: string | null;
          client_id: string;
          designer_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          scope: '1BHK' | '2BHK' | '3BHK' | 'Commercial';
          status?: 'wip' | 'screenshots_shared' | 'approved' | 'renders_shared' | 'delivering' | 'delivered';
          address: string;
          notes?: string | null;
          client_id: string;
          designer_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          scope?: '1BHK' | '2BHK' | '3BHK' | 'Commercial';
          status?: 'wip' | 'screenshots_shared' | 'approved' | 'renders_shared' | 'delivering' | 'delivered';
          address?: string;
          notes?: string | null;
          client_id?: string;
          designer_id?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string | null;
          price: number;
          category: string;
          color: string | null;
          image_url: string;
          status: 'active' | 'inactive' | 'deleted';
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description?: string | null;
          price: number;
          category: string;
          color?: string | null;
          image_url: string;
          status?: 'active' | 'inactive' | 'deleted';
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string | null;
          price?: number;
          category?: string;
          color?: string | null;
          image_url?: string;
          status?: 'active' | 'inactive' | 'deleted';
        };
      };
      project_products: {
        Row: {
          id: string;
          created_at: string;
          project_id: string;
          product_id: string;
          area: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          project_id: string;
          product_id: string;
          area: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          project_id?: string;
          product_id?: string;
          area?: string;
          notes?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          project_id: string;
          sender_id: string;
          content: string;
          attachments: Json[] | null;
          meeting_info: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          project_id: string;
          sender_id: string;
          content: string;
          attachments?: Json[] | null;
          meeting_info?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          project_id?: string;
          sender_id?: string;
          content?: string;
          attachments?: Json[] | null;
          meeting_info?: Json | null;
        };
      };
      files: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          size: number;
          mime_type: string;
          url: string;
          thumbnail_url: string | null;
          project_id: string;
          uploader_id: string;
          type: 'image' | 'file';
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          size: number;
          mime_type: string;
          url: string;
          thumbnail_url?: string | null;
          project_id: string;
          uploader_id: string;
          type: 'image' | 'file';
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          size?: number;
          mime_type?: string;
          url?: string;
          thumbnail_url?: string | null;
          project_id?: string;
          uploader_id?: string;
          type?: 'image' | 'file';
        };
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          client_id: string;
          project_id: string | null;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total_amount: number;
          payment_status: 'pending' | 'paid' | 'failed';
          shipping_address: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          client_id: string;
          project_id?: string | null;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total_amount: number;
          payment_status?: 'pending' | 'paid' | 'failed';
          shipping_address: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          client_id?: string;
          project_id?: string | null;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total_amount?: number;
          payment_status?: 'pending' | 'paid' | 'failed';
          shipping_address?: Json;
        };
      };
      order_items: {
        Row: {
          id: string;
          created_at: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}