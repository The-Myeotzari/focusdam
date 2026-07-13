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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      consent_events: {
        Row: {
          consent_key: Database["public"]["Enums"]["consent_key"]
          created_at: string
          granted: boolean
          id: string
          metadata: Json
          policy_version: string
          source: Database["public"]["Enums"]["consent_source"]
          user_id: string
        }
        Insert: {
          consent_key: Database["public"]["Enums"]["consent_key"]
          created_at?: string
          granted: boolean
          id?: string
          metadata?: Json
          policy_version?: string
          source?: Database["public"]["Enums"]["consent_source"]
          user_id: string
        }
        Update: {
          consent_key?: Database["public"]["Enums"]["consent_key"]
          created_at?: string
          granted?: boolean
          id?: string
          metadata?: Json
          policy_version?: string
          source?: Database["public"]["Enums"]["consent_source"]
          user_id?: string
        }
        Relationships: []
      }
      consent_settings: {
        Row: {
          analysis_usage: boolean
          created_at: string
          emotion_record: boolean
          spending_record: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_usage?: boolean
          created_at?: string
          emotion_record?: boolean
          spending_record?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_usage?: boolean
          created_at?: string
          emotion_record?: boolean
          spending_record?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_jobs: {
        Row: {
          created_at: string
          end_date: string | null
          error_message: string | null
          expires_at: string | null
          export_format:
            | Database["public"]["Enums"]["data_export_format"]
            | null
          id: string
          job_type: Database["public"]["Enums"]["data_job_type"]
          metadata: Json
          processed_at: string | null
          requested_at: string
          result_storage_path: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["data_job_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          error_message?: string | null
          expires_at?: string | null
          export_format?:
            | Database["public"]["Enums"]["data_export_format"]
            | null
          id?: string
          job_type: Database["public"]["Enums"]["data_job_type"]
          metadata?: Json
          processed_at?: string | null
          requested_at?: string
          result_storage_path?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["data_job_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          error_message?: string | null
          expires_at?: string | null
          export_format?:
            | Database["public"]["Enums"]["data_export_format"]
            | null
          id?: string
          job_type?: Database["public"]["Enums"]["data_job_type"]
          metadata?: Json
          processed_at?: string | null
          requested_at?: string
          result_storage_path?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["data_job_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emotion_records: {
        Row: {
          created_at: string
          emotion_label: string
          id: string
          intensity: number | null
          reset_action: string | null
          returned_to_focus: boolean | null
          session_id: string | null
          trigger_note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emotion_label: string
          id?: string
          intensity?: number | null
          reset_action?: string | null
          returned_to_focus?: boolean | null
          session_id?: string | null
          trigger_note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          emotion_label?: string
          id?: string
          intensity?: number | null
          reset_action?: string | null
          returned_to_focus?: boolean | null
          session_id?: string | null
          trigger_note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotion_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "focus_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_session_events: {
        Row: {
          event_reason: string | null
          event_type: Database["public"]["Enums"]["focus_event_type"]
          id: string
          metadata: Json
          occurred_at: string
          session_id: string
          user_id: string
        }
        Insert: {
          event_reason?: string | null
          event_type: Database["public"]["Enums"]["focus_event_type"]
          id?: string
          metadata?: Json
          occurred_at?: string
          session_id: string
          user_id: string
        }
        Update: {
          event_reason?: string | null
          event_type?: Database["public"]["Enums"]["focus_event_type"]
          id?: string
          metadata?: Json
          occurred_at?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_session_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "focus_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_sessions: {
        Row: {
          actual_duration_seconds: number | null
          completion_mood: Database["public"]["Enums"]["completion_mood"] | null
          created_at: string
          ended_at: string | null
          focus_level: Database["public"]["Enums"]["focus_level"] | null
          id: string
          overrun_seconds: number
          planned_duration_minutes: number
          recommended_duration_minutes: number | null
          schedule_id: string | null
          started_at: string
          starter_action_id: string | null
          status: Database["public"]["Enums"]["focus_session_status"]
          subtitle_snapshot: string | null
          title_snapshot: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_duration_seconds?: number | null
          completion_mood?:
            | Database["public"]["Enums"]["completion_mood"]
            | null
          created_at?: string
          ended_at?: string | null
          focus_level?: Database["public"]["Enums"]["focus_level"] | null
          id?: string
          overrun_seconds?: number
          planned_duration_minutes: number
          recommended_duration_minutes?: number | null
          schedule_id?: string | null
          started_at?: string
          starter_action_id?: string | null
          status?: Database["public"]["Enums"]["focus_session_status"]
          subtitle_snapshot?: string | null
          title_snapshot: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_duration_seconds?: number | null
          completion_mood?:
            | Database["public"]["Enums"]["completion_mood"]
            | null
          created_at?: string
          ended_at?: string | null
          focus_level?: Database["public"]["Enums"]["focus_level"] | null
          id?: string
          overrun_seconds?: number
          planned_duration_minutes?: number
          recommended_duration_minutes?: number | null
          schedule_id?: string | null
          started_at?: string
          starter_action_id?: string | null
          status?: Database["public"]["Enums"]["focus_session_status"]
          subtitle_snapshot?: string | null
          title_snapshot?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "starter_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "focus_sessions_starter_action_id_fkey"
            columns: ["starter_action_id"]
            isOneToOne: false
            referencedRelation: "starter_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          emotion_reset: boolean
          quiet_hours: boolean
          quiet_hours_end: string
          quiet_hours_start: string
          spend_hold: boolean
          start_reminder: boolean
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotion_reset?: boolean
          quiet_hours?: boolean
          quiet_hours_end?: string
          quiet_hours_start?: string
          spend_hold?: boolean
          start_reminder?: boolean
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotion_reset?: boolean
          quiet_hours?: boolean
          quiet_hours_end?: string
          quiet_hours_start?: string
          spend_hold?: boolean
          start_reminder?: boolean
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_goal_achievements: {
        Row: {
          achieved_amount_krw: number
          achieved_at: string
          created_at: string
          goal_id: string
          id: string
          saved_review_count: number
          target_amount_krw: number
          trigger_review_id: string | null
          trigger_saving_entry_id: string | null
          user_id: string
        }
        Insert: {
          achieved_amount_krw: number
          achieved_at?: string
          created_at?: string
          goal_id: string
          id?: string
          saved_review_count?: number
          target_amount_krw: number
          trigger_review_id?: string | null
          trigger_saving_entry_id?: string | null
          user_id: string
        }
        Update: {
          achieved_amount_krw?: number
          achieved_at?: string
          created_at?: string
          goal_id?: string
          id?: string
          saved_review_count?: number
          target_amount_krw?: number
          trigger_review_id?: string | null
          trigger_saving_entry_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_goal_achievements_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "payment_saving_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_goal_achievements_trigger_review_id_fkey"
            columns: ["trigger_review_id"]
            isOneToOne: false
            referencedRelation: "payment_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_goal_achievements_trigger_saving_entry_id_fkey"
            columns: ["trigger_saving_entry_id"]
            isOneToOne: false
            referencedRelation: "payment_saving_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_review_followups: {
        Row: {
          completed_at: string | null
          created_at: string
          followup_type: Database["public"]["Enums"]["payment_followup_type"]
          id: string
          memo: string | null
          metadata: Json
          reminder_decision:
            | Database["public"]["Enums"]["payment_reminder_decision"]
            | null
          review_id: string
          satisfaction_score: number | null
          scheduled_at: string
          sequence: number
          status: Database["public"]["Enums"]["payment_followup_status"]
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          followup_type: Database["public"]["Enums"]["payment_followup_type"]
          id?: string
          memo?: string | null
          metadata?: Json
          reminder_decision?:
            | Database["public"]["Enums"]["payment_reminder_decision"]
            | null
          review_id: string
          satisfaction_score?: number | null
          scheduled_at: string
          sequence?: number
          status?: Database["public"]["Enums"]["payment_followup_status"]
          summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          followup_type?: Database["public"]["Enums"]["payment_followup_type"]
          id?: string
          memo?: string | null
          metadata?: Json
          reminder_decision?:
            | Database["public"]["Enums"]["payment_reminder_decision"]
            | null
          review_id?: string
          satisfaction_score?: number | null
          scheduled_at?: string
          sequence?: number
          status?: Database["public"]["Enums"]["payment_followup_status"]
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_review_followups_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "payment_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_reviews: {
        Row: {
          alternative_status: Database["public"]["Enums"]["payment_alternative_status"]
          amount_krw: number
          budget_category: string | null
          buy_reason: string | null
          created_at: string
          decided_at: string
          deleted_at: string | null
          goal_id: string | null
          id: string
          impulse_strength: Database["public"]["Enums"]["payment_impulse_strength"]
          initial_decision: Database["public"]["Enums"]["payment_review_decision"]
          item_name: string
          need_timing: Database["public"]["Enums"]["payment_need_timing"]
          outcome_type: Database["public"]["Enums"]["payment_outcome_type"]
          reason: string | null
          reward: string | null
          satisfaction_reminder: boolean
          saving_target:
            | Database["public"]["Enums"]["payment_saving_target"]
            | null
          status: Database["public"]["Enums"]["payment_review_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          alternative_status?: Database["public"]["Enums"]["payment_alternative_status"]
          amount_krw: number
          budget_category?: string | null
          buy_reason?: string | null
          created_at?: string
          decided_at?: string
          deleted_at?: string | null
          goal_id?: string | null
          id?: string
          impulse_strength: Database["public"]["Enums"]["payment_impulse_strength"]
          initial_decision: Database["public"]["Enums"]["payment_review_decision"]
          item_name: string
          need_timing?: Database["public"]["Enums"]["payment_need_timing"]
          outcome_type: Database["public"]["Enums"]["payment_outcome_type"]
          reason?: string | null
          reward?: string | null
          satisfaction_reminder?: boolean
          saving_target?:
            | Database["public"]["Enums"]["payment_saving_target"]
            | null
          status: Database["public"]["Enums"]["payment_review_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          alternative_status?: Database["public"]["Enums"]["payment_alternative_status"]
          amount_krw?: number
          budget_category?: string | null
          buy_reason?: string | null
          created_at?: string
          decided_at?: string
          deleted_at?: string | null
          goal_id?: string | null
          id?: string
          impulse_strength?: Database["public"]["Enums"]["payment_impulse_strength"]
          initial_decision?: Database["public"]["Enums"]["payment_review_decision"]
          item_name?: string
          need_timing?: Database["public"]["Enums"]["payment_need_timing"]
          outcome_type?: Database["public"]["Enums"]["payment_outcome_type"]
          reason?: string | null
          reward?: string | null
          satisfaction_reminder?: boolean
          saving_target?:
            | Database["public"]["Enums"]["payment_saving_target"]
            | null
          status?: Database["public"]["Enums"]["payment_review_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_reviews_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "payment_saving_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_saving_entries: {
        Row: {
          amount_krw: number
          created_at: string
          followup_id: string | null
          goal_id: string
          id: string
          note: string | null
          review_id: string | null
          source: Database["public"]["Enums"]["payment_saving_source"]
          user_id: string
        }
        Insert: {
          amount_krw: number
          created_at?: string
          followup_id?: string | null
          goal_id: string
          id?: string
          note?: string | null
          review_id?: string | null
          source: Database["public"]["Enums"]["payment_saving_source"]
          user_id: string
        }
        Update: {
          amount_krw?: number
          created_at?: string
          followup_id?: string | null
          goal_id?: string
          id?: string
          note?: string | null
          review_id?: string | null
          source?: Database["public"]["Enums"]["payment_saving_source"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_saving_entries_followup_id_fkey"
            columns: ["followup_id"]
            isOneToOne: false
            referencedRelation: "payment_review_followups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_saving_entries_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "payment_saving_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_saving_entries_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "payment_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_saving_goals: {
        Row: {
          created_at: string
          current_saved_amount_krw: number
          due_date: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["saving_goal_status"]
          target_amount_krw: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_saved_amount_krw?: number
          due_date?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["saving_goal_status"]
          target_amount_krw: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_saved_amount_krw?: number
          due_date?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["saving_goal_status"]
          target_amount_krw?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plus_plans: {
        Row: {
          amount_krw: number
          billing_interval: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          provider_price_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          amount_krw: number
          billing_interval: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          provider_price_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          amount_krw?: number
          billing_interval?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          provider_price_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          locale: string
          onboarded_at: string | null
          social_provider: Database["public"]["Enums"]["social_provider"] | null
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          locale?: string
          onboarded_at?: string | null
          social_provider?:
            | Database["public"]["Enums"]["social_provider"]
            | null
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          locale?: string
          onboarded_at?: string | null
          social_provider?:
            | Database["public"]["Enums"]["social_provider"]
            | null
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          is_active: boolean
          last_seen_at: string
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean
          last_seen_at?: string
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean
          last_seen_at?: string
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      starter_action_templates: {
        Row: {
          category: string
          created_at: string
          default_duration_minutes: number
          description: string | null
          difficulty: string | null
          id: string
          is_active: boolean
          label: string | null
          recommended_duration_minutes: number
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          default_duration_minutes?: number
          description?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          recommended_duration_minutes?: number
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          default_duration_minutes?: number
          description?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          recommended_duration_minutes?: number
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      starter_actions: {
        Row: {
          archived_at: string | null
          category: string | null
          created_at: string
          id: string
          is_favorite: boolean
          last_started_at: string | null
          micro_action: string | null
          planned_duration_minutes: number
          recommended_duration_minutes: number
          source: Database["public"]["Enums"]["starter_action_source"]
          subtitle: string | null
          target: string | null
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
          verb: string | null
        }
        Insert: {
          archived_at?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean
          last_started_at?: string | null
          micro_action?: string | null
          planned_duration_minutes?: number
          recommended_duration_minutes?: number
          source?: Database["public"]["Enums"]["starter_action_source"]
          subtitle?: string | null
          target?: string | null
          template_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          verb?: string | null
        }
        Update: {
          archived_at?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean
          last_started_at?: string | null
          micro_action?: string | null
          planned_duration_minutes?: number
          recommended_duration_minutes?: number
          source?: Database["public"]["Enums"]["starter_action_source"]
          subtitle?: string | null
          target?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          verb?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "starter_actions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "starter_action_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      starter_schedules: {
        Row: {
          created_at: string
          id: string
          scheduled_at: string
          starter_action_id: string
          status: Database["public"]["Enums"]["starter_schedule_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          scheduled_at: string
          starter_action_id: string
          status?: Database["public"]["Enums"]["starter_schedule_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          scheduled_at?: string
          starter_action_id?: string
          status?: Database["public"]["Enums"]["starter_schedule_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "starter_schedules_starter_action_id_fkey"
            columns: ["starter_action_id"]
            isOneToOne: false
            referencedRelation: "starter_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json
          payment_method_summary: string | null
          plan_id: string | null
          provider: string
          provider_customer_id: string | null
          provider_subscription_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          payment_method_summary?: string | null
          plan_id?: string | null
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          payment_method_summary?: string | null
          plan_id?: string | null
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plus_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reviews: {
        Row: {
          created_at: string
          generated_at: string
          id: string
          insights_snapshot: Json
          recommendation_snapshot: Json
          return_rate: number | null
          saved_amount_krw: number
          started_count: number
          status: Database["public"]["Enums"]["weekly_review_status"]
          summary_snapshot: Json
          updated_at: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          generated_at?: string
          id?: string
          insights_snapshot?: Json
          recommendation_snapshot?: Json
          return_rate?: number | null
          saved_amount_krw?: number
          started_count?: number
          status?: Database["public"]["Enums"]["weekly_review_status"]
          summary_snapshot?: Json
          updated_at?: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          generated_at?: string
          id?: string
          insights_snapshot?: Json
          recommendation_snapshot?: Json
          return_rate?: number | null
          saved_amount_krw?: number
          started_count?: number
          status?: Database["public"]["Enums"]["weekly_review_status"]
          summary_snapshot?: Json
          updated_at?: string
          user_id?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: []
      }
      writing_helper_histories: {
        Row: {
          closing_request: string
          copied_count: number
          created_at: string
          deleted_at: string | null
          edited_draft: string
          id: string
          last_copied_at: string | null
          message_type: Database["public"]["Enums"]["writing_message_type"]
          reason: string
          recipient: string
          requested_action: string
          result_snapshot: Json
          tone: Database["public"]["Enums"]["writing_tone"]
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          closing_request?: string
          copied_count?: number
          created_at?: string
          deleted_at?: string | null
          edited_draft?: string
          id?: string
          last_copied_at?: string | null
          message_type: Database["public"]["Enums"]["writing_message_type"]
          reason?: string
          recipient?: string
          requested_action?: string
          result_snapshot: Json
          tone: Database["public"]["Enums"]["writing_tone"]
          topic?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          closing_request?: string
          copied_count?: number
          created_at?: string
          deleted_at?: string | null
          edited_draft?: string
          id?: string
          last_copied_at?: string | null
          message_type?: Database["public"]["Enums"]["writing_message_type"]
          reason?: string
          recipient?: string
          requested_action?: string
          result_snapshot?: Json
          tone?: Database["public"]["Enums"]["writing_tone"]
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      completion_mood: "light" | "neutral" | "hard"
      consent_key:
        | "required_service_terms"
        | "analysis_usage"
        | "emotion_record"
        | "spending_record"
      consent_source: "onboarding" | "settings" | "system"
      data_export_format: "csv" | "pdf"
      data_job_status:
        | "queued"
        | "processing"
        | "completed"
        | "failed"
        | "canceled"
      data_job_type: "export" | "delete"
      focus_event_type:
        | "started"
        | "paused"
        | "resumed"
        | "emotion_reset_started"
        | "emotion_reset_completed"
        | "overtime_started"
        | "extended"
        | "split_task"
        | "completed"
        | "canceled"
      focus_level: "low" | "medium" | "high"
      focus_session_status:
        | "running"
        | "paused"
        | "overtime"
        | "completed"
        | "canceled"
      payment_alternative_status: "similar" | "replaceable" | "none"
      payment_followup_status:
        | "scheduled"
        | "required"
        | "completed"
        | "canceled"
      payment_followup_type: "reminder" | "satisfaction"
      payment_impulse_strength: "low" | "medium" | "high"
      payment_need_timing: "now" | "tomorrow" | "low"
      payment_outcome_type: "buy" | "hold" | "save"
      payment_reminder_decision: "buy" | "cancel" | "hold"
      payment_review_decision: "hold" | "buy" | "save"
      payment_review_status:
        | "buy_satisfaction_scheduled"
        | "buy_satisfaction_required"
        | "buy_satisfaction_completed"
        | "save_completed"
        | "hold_reminder_scheduled"
        | "hold_reminder_required"
        | "hold_after_buy"
        | "hold_after_save"
        | "hold_after_hold_scheduled"
        | "rehold_reminder_scheduled"
        | "rehold_reminder_required"
        | "rehold_after_buy"
        | "rehold_after_save"
        | "rehold_after_hold_scheduled"
      payment_saving_source:
        | "initial_save"
        | "hold_cancel"
        | "rehold_cancel"
        | "manual_adjustment"
      payment_saving_target: "goal" | "reward" | "benefit"
      saving_goal_status: "active" | "achieved" | "archived"
      social_provider: "google" | "kakao" | "apple"
      starter_action_source:
        | "custom"
        | "template"
        | "recent"
        | "favorite"
        | "split"
      starter_schedule_status:
        | "scheduled"
        | "started"
        | "completed"
        | "skipped"
        | "canceled"
      subscription_status:
        | "not_subscribed"
        | "active"
        | "canceled"
        | "past_due"
        | "incomplete"
      weekly_review_status: "generated" | "stale" | "failed"
      writing_message_type: "email" | "check_in" | "request" | "apology"
      writing_tone: "plain" | "warm" | "formal"
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
    Enums: {
      completion_mood: ["light", "neutral", "hard"],
      consent_key: [
        "required_service_terms",
        "analysis_usage",
        "emotion_record",
        "spending_record",
      ],
      consent_source: ["onboarding", "settings", "system"],
      data_export_format: ["csv", "pdf"],
      data_job_status: [
        "queued",
        "processing",
        "completed",
        "failed",
        "canceled",
      ],
      data_job_type: ["export", "delete"],
      focus_event_type: [
        "started",
        "paused",
        "resumed",
        "emotion_reset_started",
        "emotion_reset_completed",
        "overtime_started",
        "extended",
        "split_task",
        "completed",
        "canceled",
      ],
      focus_level: ["low", "medium", "high"],
      focus_session_status: [
        "running",
        "paused",
        "overtime",
        "completed",
        "canceled",
      ],
      payment_alternative_status: ["similar", "replaceable", "none"],
      payment_followup_status: [
        "scheduled",
        "required",
        "completed",
        "canceled",
      ],
      payment_followup_type: ["reminder", "satisfaction"],
      payment_impulse_strength: ["low", "medium", "high"],
      payment_need_timing: ["now", "tomorrow", "low"],
      payment_outcome_type: ["buy", "hold", "save"],
      payment_reminder_decision: ["buy", "cancel", "hold"],
      payment_review_decision: ["hold", "buy", "save"],
      payment_review_status: [
        "buy_satisfaction_scheduled",
        "buy_satisfaction_required",
        "buy_satisfaction_completed",
        "save_completed",
        "hold_reminder_scheduled",
        "hold_reminder_required",
        "hold_after_buy",
        "hold_after_save",
        "hold_after_hold_scheduled",
        "rehold_reminder_scheduled",
        "rehold_reminder_required",
        "rehold_after_buy",
        "rehold_after_save",
        "rehold_after_hold_scheduled",
      ],
      payment_saving_source: [
        "initial_save",
        "hold_cancel",
        "rehold_cancel",
        "manual_adjustment",
      ],
      payment_saving_target: ["goal", "reward", "benefit"],
      saving_goal_status: ["active", "achieved", "archived"],
      social_provider: ["google", "kakao", "apple"],
      starter_action_source: [
        "custom",
        "template",
        "recent",
        "favorite",
        "split",
      ],
      starter_schedule_status: [
        "scheduled",
        "started",
        "completed",
        "skipped",
        "canceled",
      ],
      subscription_status: [
        "not_subscribed",
        "active",
        "canceled",
        "past_due",
        "incomplete",
      ],
      weekly_review_status: ["generated", "stale", "failed"],
      writing_message_type: ["email", "check_in", "request", "apology"],
      writing_tone: ["plain", "warm", "formal"],
    },
  },
} as const
