/*
  # SmartDesk AI Database Schema

  ## Overview
  Creates the complete database schema for SmartDesk AI - a multilingual IT Help Desk system.
  
  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `email` (text)
  - `role` (text) - 'user' or 'admin'
  - `preferred_language` (text) - 'en' or 'ja'
  - `email_notifications` (boolean) - whether user wants email alerts
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `tickets`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `ticket_number` (text, unique) - human-readable ticket ID like "TKT-001234"
  - `full_name` (text)
  - `email` (text)
  - `language` (text) - 'en' or 'ja'
  - `category` (text) - 'Network', 'Software', 'Hardware', 'Access', 'Other'
  - `issue_description` (text)
  - `issue_description_translated` (text) - English translation if submitted in Japanese
  - `ai_resolution` (text)
  - `ai_resolution_translated` (text) - Resolution in user's language
  - `confidence_score` (text) - 'High', 'Medium', 'Low'
  - `status` (text) - 'Open', 'Resolved', 'Escalated'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  - `resolved_at` (timestamptz, nullable)
  
  ## Security
  - Enable RLS on all tables
  - Users can read/update their own profile
  - Users can create tickets and read their own tickets
  - Admins can read all tickets and update any ticket
  - Public signup is allowed for profiles table
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ja')),
  email_notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ja')),
  category text NOT NULL CHECK (category IN ('Network', 'Software', 'Hardware', 'Access', 'Other')),
  issue_description text NOT NULL,
  issue_description_translated text,
  ai_resolution text,
  ai_resolution_translated text,
  confidence_score text CHECK (confidence_score IN ('High', 'Medium', 'Low')),
  status text NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Resolved', 'Escalated')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS text AS $$
DECLARE
  next_number int;
  ticket_num text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS int)), 0) + 1
  INTO next_number
  FROM tickets;
  
  ticket_num := 'TKT-' || LPAD(next_number::text, 6, '0');
  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Tickets policies for regular users
CREATE POLICY "Users can view own tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin policies (admins can see and update all tickets)
CREATE POLICY "Admins can view all tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );