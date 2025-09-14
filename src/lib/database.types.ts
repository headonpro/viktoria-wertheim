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
    PostgrestVersion: "13.0.4"
  }
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
      league_standings: {
        Row: {
          drawn: number | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          id: string
          lost: number | null
          played: number | null
          points: number | null
          position: number
          season: string | null
          team_id: string | null
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
          lost?: number | null
          played?: number | null
          points?: number | null
          position: number
          season?: string | null
          team_id?: string | null
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
          lost?: number | null
          played?: number | null
          points?: number | null
          position?: number
          season?: string | null
          team_id?: string | null
          trend?: string | null
          updated_at?: string | null
          won?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_league_standings_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_league_standings_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      match_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_time: number | null
          event_type: string
          id: string
          match_id: string | null
          player_id: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_time?: number | null
          event_type: string
          id?: string
          match_id?: string | null
          player_id?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_time?: number | null
          event_type?: string
          id?: string
          match_id?: string | null
          player_id?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_results_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "recent_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "upcoming_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_team_id_fkey"
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
          season: string | null
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
          season?: string | null
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
          season?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_matches_away_team"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_away_team"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_home_team"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_home_team"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string
          house_number: string | null
          id: string
          joined_date: string | null
          last_name: string
          member_number: string | null
          membership_status: string | null
          membership_type: string | null
          notes: string | null
          phone: string | null
          postal_code: string | null
          profile_id: string | null
          street: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          house_number?: string | null
          id?: string
          joined_date?: string | null
          last_name: string
          member_number?: string | null
          membership_status?: string | null
          membership_type?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_id?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          house_number?: string | null
          id?: string
          joined_date?: string | null
          last_name?: string
          member_number?: string | null
          membership_status?: string | null
          membership_type?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_id?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
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
      newsletter_history: {
        Row: {
          content: string
          created_at: string | null
          id: string
          recipient_count: number | null
          sent_at: string | null
          sent_by: string | null
          subject: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          recipient_count?: number | null
          sent_at?: string | null
          sent_by?: string | null
          subject: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          recipient_count?: number | null
          sent_at?: string | null
          sent_by?: string | null
          subject?: string
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
            foreignKeyName: "fk_players_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_players_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schema_migrations: {
        Row: {
          applied_at: string | null
          checksum: string | null
          description: string | null
          version: string
        }
        Insert: {
          applied_at?: string | null
          checksum?: string | null
          description?: string | null
          version: string
        }
        Update: {
          applied_at?: string | null
          checksum?: string | null
          description?: string | null
          version?: string
        }
        Relationships: []
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
            foreignKeyName: "fk_scorers_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_scorers_team"
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
        Relationships: [
          {
            foreignKeyName: "team_form_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_form_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          captain: string | null
          coach: string | null
          created_at: string | null
          id: string
          is_own_team: boolean | null
          league: string | null
          name: string
          season: string
          short_name: string | null
          team_type: string
          training_schedule: string | null
          updated_at: string | null
        }
        Insert: {
          captain?: string | null
          coach?: string | null
          created_at?: string | null
          id?: string
          is_own_team?: boolean | null
          league?: string | null
          name: string
          season?: string
          short_name?: string | null
          team_type: string
          training_schedule?: string | null
          updated_at?: string | null
        }
        Update: {
          captain?: string | null
          coach?: string | null
          created_at?: string | null
          id?: string
          is_own_team?: boolean | null
          league?: string | null
          name?: string
          season?: string
          short_name?: string | null
          team_type?: string
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
          short_name: string | null
          table_zone: string | null
          team_id: string | null
          team_name: string | null
          trend: string | null
          updated_at: string | null
          won: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_league_standings_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_league_standings_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      league_standings_view: {
        Row: {
          avg_goals_per_game: number | null
          drawn: number | null
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
          short_name: string | null
          table_zone: string | null
          team_id: string | null
          team_name: string | null
          team_type: string | null
          trend: string | null
          updated_at: string | null
          win_percentage: number | null
          won: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_league_standings_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_league_standings_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      match_results_view: {
        Row: {
          away_score: number | null
          away_team: string | null
          away_team_id: string | null
          away_team_name: string | null
          created_at: string | null
          goal_difference: number | null
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
          status: string | null
          updated_at: string | null
          winner: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_matches_away_team"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_away_team"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_home_team"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_home_team"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "fk_matches_away_team"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_away_team"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_home_team"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_home_team"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_statistics_view: {
        Row: {
          avg_goals_conceded: number | null
          avg_goals_per_game: number | null
          current_points: number | null
          current_position: number | null
          draw_percentage: number | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          id: string | null
          league: string | null
          loss_percentage: number | null
          matches_drawn: number | null
          matches_lost: number | null
          matches_played: number | null
          matches_won: number | null
          name: string | null
          short_name: string | null
          team_type: string | null
          win_percentage: number | null
        }
        Relationships: []
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
            foreignKeyName: "fk_scorers_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_scorers_team"
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
            foreignKeyName: "fk_matches_away_team"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_away_team"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_home_team"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "team_statistics_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_matches_home_team"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      batch_update_standings: {
        Args: { p_season?: string; p_updates: string }
        Returns: {
          result: string
          team_name: string
        }[]
      }
      calculate_league_table: {
        Args: { p_season?: string }
        Returns: {
          drawn: number
          goal_difference: number
          goals_against: number
          goals_for: number
          league: string
          lost: number
          played: number
          points: number
          table_position: number
          team_id: string
          team_name: string
          won: number
        }[]
      }
      calculate_team_form: {
        Args: { target_season?: string; target_team_id: string }
        Returns: undefined
      }
      get_team_standings: {
        Args: { p_league?: string; p_season?: string }
        Returns: {
          drawn: number
          goal_difference: number
          goals_against: number
          goals_for: number
          league: string
          lost: number
          played: number
          points: number
          position: number
          short_name: string
          team_id: string
          team_name: string
          team_type: string
          trend: string
          won: number
        }[]
      }
      increment_news_views: {
        Args: { news_id: string }
        Returns: number
      }
      recalculate_all_league_standings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_team_form: {
        Args: { p_team_id: string }
        Returns: undefined
      }
      update_team_standings: {
        Args: {
          p_drawn: number
          p_goals_against: number
          p_goals_for: number
          p_lost: number
          p_played: number
          p_points: number
          p_position: number
          p_season?: string
          p_team_name: string
          p_won: number
        }
        Returns: string
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
