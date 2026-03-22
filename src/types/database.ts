export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'user' | 'admin'
          preferred_language: 'en' | 'ja'
          email_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: 'user' | 'admin'
          preferred_language?: 'en' | 'ja'
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'user' | 'admin'
          preferred_language?: 'en' | 'ja'
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          user_id: string
          ticket_number: string
          full_name: string
          email: string
          language: 'en' | 'ja'
          category: 'Network' | 'Software' | 'Hardware' | 'Access' | 'Other'
          issue_description: string
          issue_description_translated: string | null
          ai_resolution: string | null
          ai_resolution_translated: string | null
          confidence_score: 'High' | 'Medium' | 'Low' | null
          status: 'Open' | 'Resolved' | 'Escalated'
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          ticket_number: string
          full_name: string
          email: string
          language?: 'en' | 'ja'
          category: 'Network' | 'Software' | 'Hardware' | 'Access' | 'Other'
          issue_description: string
          issue_description_translated?: string | null
          ai_resolution?: string | null
          ai_resolution_translated?: string | null
          confidence_score?: 'High' | 'Medium' | 'Low' | null
          status?: 'Open' | 'Resolved' | 'Escalated'
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          ticket_number?: string
          full_name?: string
          email?: string
          language?: 'en' | 'ja'
          category?: 'Network' | 'Software' | 'Hardware' | 'Access' | 'Other'
          issue_description?: string
          issue_description_translated?: string | null
          ai_resolution?: string | null
          ai_resolution_translated?: string | null
          confidence_score?: 'High' | 'Medium' | 'Low' | null
          status?: 'Open' | 'Resolved' | 'Escalated'
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
    }
  }
}
