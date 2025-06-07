export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          date: string
          engagement_rate: number | null
          id: string
          replies_sent: number | null
          response_time_avg: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          engagement_rate?: number | null
          id?: string
          replies_sent?: number | null
          response_time_avg?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          engagement_rate?: number | null
          id?: string
          replies_sent?: number | null
          response_time_avg?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          twitter_username: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          twitter_username?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          twitter_username?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reply_logs: {
        Row: {
          ai_reply_text: string
          created_at: string | null
          engagement_likes: number | null
          engagement_replies: number | null
          id: string
          original_author: string
          original_tweet_id: string
          original_tweet_text: string
          posted_at: string | null
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
          status: Database["public"]["Enums"]["reply_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_reply_text: string
          created_at?: string | null
          engagement_likes?: number | null
          engagement_replies?: number | null
          id?: string
          original_author: string
          original_tweet_id: string
          original_tweet_text: string
          posted_at?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          status?: Database["public"]["Enums"]["reply_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_reply_text?: string
          created_at?: string | null
          engagement_likes?: number | null
          engagement_replies?: number | null
          id?: string
          original_author?: string
          original_tweet_id?: string
          original_tweet_text?: string
          posted_at?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          status?: Database["public"]["Enums"]["reply_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          auto_reply_enabled: boolean | null
          created_at: string | null
          id: string
          keywords: string[] | null
          max_replies_per_hour: number | null
          personality_type: string | null
          response_delay_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_reply_enabled?: boolean | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          max_replies_per_hour?: number | null
          personality_type?: string | null
          response_delay_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_reply_enabled?: boolean | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          max_replies_per_hour?: number | null
          personality_type?: string | null
          response_delay_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      reply_status: "pending" | "posted" | "failed"
      sentiment_type:
        | "positive"
        | "negative"
        | "neutral"
        | "supportive"
        | "thoughtful"
        | "helpful"
        | "diplomatic"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      reply_status: ["pending", "posted", "failed"],
      sentiment_type: [
        "positive",
        "negative",
        "neutral",
        "supportive",
        "thoughtful",
        "helpful",
        "diplomatic",
      ],
    },
  },
} as const
