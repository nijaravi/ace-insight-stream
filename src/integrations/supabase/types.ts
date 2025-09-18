export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alert_history: {
        Row: {
          alert_id: string | null
          body: string
          created_at: string
          id: string
          kpi_id: string | null
          recipient_emails: string[]
          sent_date: string
          status: string
          subject: string
        }
        Insert: {
          alert_id?: string | null
          body: string
          created_at?: string
          id?: string
          kpi_id?: string | null
          recipient_emails: string[]
          sent_date?: string
          status?: string
          subject: string
        }
        Update: {
          alert_id?: string | null
          body?: string
          created_at?: string
          id?: string
          kpi_id?: string | null
          recipient_emails?: string[]
          sent_date?: string
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_history_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_history_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_recipients: {
        Row: {
          alert_id: string | null
          created_at: string
          email: string
          id: string
          recipient_type: string
        }
        Insert: {
          alert_id?: string | null
          created_at?: string
          email: string
          id?: string
          recipient_type: string
        }
        Update: {
          alert_id?: string | null
          created_at?: string
          email?: string
          id?: string
          recipient_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_recipients_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          alert_date: string
          alert_detail: string
          alert_id: string
          comment: string | null
          created_at: string
          curated_date: string | null
          department_id: string | null
          id: string
          kpi_id: string | null
          sent_date: string | null
          severity: string | null
          status: string | null
        }
        Insert: {
          alert_date?: string
          alert_detail: string
          alert_id: string
          comment?: string | null
          created_at?: string
          curated_date?: string | null
          department_id?: string | null
          id?: string
          kpi_id?: string | null
          sent_date?: string | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          alert_date?: string
          alert_detail?: string
          alert_id?: string
          comment?: string | null
          created_at?: string
          curated_date?: string | null
          department_id?: string | null
          id?: string
          kpi_id?: string | null
          sent_date?: string | null
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      kpis: {
        Row: {
          ai_prompt: string | null
          alert_table_name: string
          automation_time: string | null
          created_at: string
          default_body: string
          default_email_cc: string[]
          default_email_to: string[]
          default_footer: string
          default_subject: string
          description: string | null
          domain: string
          icon: string | null
          id: string
          identifier: string | null
          is_active: boolean
          is_automation_enabled: boolean
          is_favorite: boolean
          name: string
          owner_department_id: string | null
          severity: string | null
          severity_tagging: boolean
          status: string | null
          updated_at: string
        }
        Insert: {
          ai_prompt?: string | null
          alert_table_name: string
          automation_time?: string | null
          created_at?: string
          default_body?: string
          default_email_cc?: string[]
          default_email_to?: string[]
          default_footer?: string
          default_subject?: string
          description?: string | null
          domain: string
          icon?: string | null
          id?: string
          identifier?: string | null
          is_active?: boolean
          is_automation_enabled?: boolean
          is_favorite?: boolean
          name: string
          owner_department_id?: string | null
          severity?: string | null
          severity_tagging?: boolean
          status?: string | null
          updated_at?: string
        }
        Update: {
          ai_prompt?: string | null
          alert_table_name?: string
          automation_time?: string | null
          created_at?: string
          default_body?: string
          default_email_cc?: string[]
          default_email_to?: string[]
          default_footer?: string
          default_subject?: string
          description?: string | null
          domain?: string
          icon?: string | null
          id?: string
          identifier?: string | null
          is_active?: boolean
          is_automation_enabled?: boolean
          is_favorite?: boolean
          name?: string
          owner_department_id?: string | null
          severity?: string | null
          severity_tagging?: boolean
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpis_owner_department_id_fkey"
            columns: ["owner_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
