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
      contacts: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          order_position: number
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_position?: number
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_position?: number
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      league_standings: {
        Row: {
          drawn: number | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          id: string
          league: string | null
          lost: number | null
          played: number | null
          points: number | null
          position: number
          season: string | null
          team_id: string | null
          team_name: string
          trend: string | null
          updated_at: string | null
          won: number | null
        }
        Insert: {
          drawn?: number | null
          goal_difference?: number | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          league?: string | null
          lost?: number | null
          played?: number | null
          points?: number | null
          position: number
          season?: string | null
          team_id?: string | null
          team_name: string
          trend?: string | null
          updated_at?: string | null
          won?: number | null
        }
        Update: {
          drawn?: number | null
          goal_difference?: number | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          league?: string | null
          lost?: number | null
          played?: number | null
          points?: number | null
          position?: number
          season?: string | null
          team_id?: string | null
          team_name?: string
          trend?: string | null
          updated_at?: string | null
          won?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team: string
          away_team_id: string | null
          created_at: string | null
          home_score: number | null
          home_team: string
          home_team_id: string | null
          id: string
          location: string | null
          match_date: string
          match_time: string | null
          match_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          away_score?: number | null
          away_team: string
          away_team_id?: string | null
          created_at?: string | null
          home_score?: number | null
          home_team: string
          home_team_id?: string | null
          id?: string
          location?: string | null
          match_date: string
          match_time?: string | null
          match_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          away_score?: number | null
          away_team?: string
          away_team_id?: string | null
          created_at?: string | null
          home_score?: number | null
          home_team?: string
          home_team_id?: string | null
          id?: string
          location?: string | null
          match_date?: string
          match_time?: string | null
          match_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          published_at: string | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          age: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_captain: boolean | null
          name: string
          number: number | null
          position: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_captain?: boolean | null
          name: string
          number?: number | null
          position?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_captain?: boolean | null
          name?: string
          number?: number | null
          position?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      scorers: {
        Row: {
          assists: number | null
          created_at: string | null
          goals: number | null
          id: string
          player_id: string | null
          player_name: string
          season: string | null
          team_id: string | null
          team_name: string | null
          updated_at: string | null
        }
        Insert: {
          assists?: number | null
          created_at?: string | null
          goals?: number | null
          id?: string
          player_id?: string | null
          player_name: string
          season?: string | null
          team_id?: string | null
          team_name?: string | null
          updated_at?: string | null
        }
        Update: {
          assists?: number | null
          created_at?: string | null
          goals?: number | null
          id?: string
          player_id?: string | null
          player_name?: string
          season?: string | null
          team_id?: string | null
          team_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scorers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          captain: string | null
          coach: string | null
          created_at: string | null
          id: string
          league: string | null
          name: string
          points: number | null
          season: string | null
          short_name: string | null
          table_position: number | null
          team_type: string | null
          training_schedule: string | null
          updated_at: string | null
        }
        Insert: {
          captain?: string | null
          coach?: string | null
          created_at?: string | null
          id?: string
          league?: string | null
          name: string
          points?: number | null
          season?: string | null
          short_name?: string | null
          table_position?: number | null
          team_type?: string | null
          training_schedule?: string | null
          updated_at?: string | null
        }
        Update: {
          captain?: string | null
          coach?: string | null
          created_at?: string | null
          id?: string
          league?: string | null
          name?: string
          points?: number | null
          season?: string | null
          short_name?: string | null
          table_position?: number | null
          team_type?: string | null
          training_schedule?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      youth_teams: {
        Row: {
          age_group: string | null
          coach: string | null
          created_at: string | null
          id: string
          league: string | null
          name: string
          player_count: number | null
          updated_at: string | null
        }
        Insert: {
          age_group?: string | null
          coach?: string | null
          created_at?: string | null
          id?: string
          league?: string | null
          name: string
          player_count?: number | null
          updated_at?: string | null
        }
        Update: {
          age_group?: string | null
          coach?: string | null
          created_at?: string | null
          id?: string
          league?: string | null
          name?: string
          player_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_generation_log: {
        Row: {
          created_at: string | null
          error_message: string | null
          generated_content_id: string | null
          generated_content_type: string | null
          id: string
          status: string | null
          trigger_data: Json | null
          trigger_type: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          generated_content_id?: string | null
          generated_content_type?: string | null
          id?: string
          status?: string | null
          trigger_data?: Json | null
          trigger_type: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          generated_content_id?: string | null
          generated_content_type?: string | null
          id?: string
          status?: string | null
          trigger_data?: Json | null
          trigger_type?: string
        }
        Relationships: []
      }
      team_form: {
        Row: {
          form_points: number | null
          form_string: string | null
          id: string
          recent_goals_against: number | null
          recent_goals_for: number | null
          season: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          form_points?: number | null
          form_string?: string | null
          id?: string
          recent_goals_against?: number | null
          recent_goals_for?: number | null
          season?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          form_points?: number | null
          form_string?: string | null
          id?: string
          recent_goals_against?: number | null
          recent_goals_for?: number | null
          season?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      news_templates: {
        Row: {
          conditions: Json | null
          content_template: string
          created_at: string | null
          id: string
          template_type: string
          title_template: string
        }
        Insert: {
          conditions?: Json | null
          content_template: string
          created_at?: string | null
          id?: string
          template_type: string
          title_template: string
        }
        Update: {
          conditions?: Json | null
          content_template?: string
          created_at?: string | null
          id?: string
          template_type?: string
          title_template?: string
        }
        Relationships: []
      }
    }
    Views: {
      contacts_by_department: {
        Row: {
          created_at: string | null
          department: string | null
          department_name: string | null
          email: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          order_position: number | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          department_name?: never
          email?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          order_position?: number | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          department_name?: never
          email?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          order_position?: number | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recent_matches: {
        Row: {
          away_score: number | null
          away_team: string | null
          away_team_id: string | null
          away_team_name: string | null
          created_at: string | null
          home_score: number | null
          home_team: string | null
          home_team_id: string | null
          home_team_name: string | null
          id: string | null
          location: string | null
          match_date: string | null
          match_time: string | null
          match_type: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      top_scorers_view: {
        Row: {
          assists: number | null
          created_at: string | null
          goals: number | null
          id: string | null
          player_id: string | null
          player_name: string | null
          player_number: number | null
          player_position: string | null
          season: string | null
          team_full_name: string | null
          team_id: string | null
          team_name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scorers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      upcoming_matches: {
        Row: {
          away_score: number | null
          away_team: string | null
          away_team_id: string | null
          away_team_name: string | null
          created_at: string | null
          home_score: number | null
          home_team: string | null
          home_team_id: string | null
          home_team_name: string | null
          id: string | null
          location: string | null
          match_date: string | null
          match_time: string | null
          match_type: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      current_league_table: {
        Row: {
          drawn: number | null
          form_points_last_5: number | null
          form_string: string | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          id: string | null
          league: string | null
          lost: number | null
          played: number | null
          points: number | null
          position: number | null
          season: string | null
          table_zone: string | null
          team_id: string | null
          team_name: string | null
          trend: string | null
          updated_at: string | null
          won: number | null
        }
        Relationships: []
      }
      team_statistics_view: {
        Row: {
          avg_goals_per_game: number | null
          current_points: number | null
          current_position: number | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          id: string | null
          name: string | null
          played: number | null
          games_played: number | null
          wins: number | null
          draws: number | null
          losses: number | null
          win_percentage: number | null
        }
        Relationships: []
      }
      match_results_view: {
        Row: {
          away_score: number | null
          away_team: string | null
          away_team_id: string | null
          away_team_name: string | null
          created_at: string | null
          home_score: number | null
          home_team: string | null
          home_team_id: string | null
          home_team_name: string | null
          id: string | null
          location: string | null
          match_date: string | null
          match_time: string | null
          match_type: string | null
          result_type: string | null
          season: string | null
          status: string | null
          updated_at: string | null
          winner: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment_news_views: {
        Args: { news_id: string }
        Returns: number
      }
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

