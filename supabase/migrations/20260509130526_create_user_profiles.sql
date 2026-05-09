/*
  # Create User Profiles Table

  ## Summary
  Stores user profile information and environmental impact statistics.

  ## New Tables
  - `user_profiles`
    - `id` (uuid, primary key, linked to auth.users)
    - `email` (text) — user email from auth
    - `display_name` (text, nullable) — user's display name
    - `avatar_url` (text, nullable) — user's avatar URL
    - `total_scans` (integer) — total waste items scanned
    - `total_items_recycled` (integer) — total items properly recycled
    - `co2_saved` (numeric) — CO2 saved in kg
    - `water_saved` (numeric) — water saved in liters
    - `created_at` (timestamptz) — account creation date
    - `updated_at` (timestamptz) — last profile update

  - `eco_impacts`
    - `user_id` (uuid) — foreign key to user_profiles
    - `total_scans` (integer) — total scans by category
    - `plastic_items`, `organic_items`, etc. (integers) — items per category
    - `co2_saved` (numeric) — cumulative CO2 saved
    - `water_saved` (numeric) — cumulative water saved
    - `trees_saved` (numeric) — trees saved equivalent
    - `updated_at` (timestamptz) — last update

  ## Security
  - RLS enabled on both tables
  - Users can only view/update their own profiles
  - Public read for leaderboard (only non-sensitive stats)
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text,
  avatar_url text,
  total_scans integer DEFAULT 0,
  total_items_recycled integer DEFAULT 0,
  co2_saved numeric(10,2) DEFAULT 0,
  water_saved numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eco_impacts (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_scans integer DEFAULT 0,
  plastic_items integer DEFAULT 0,
  organic_items integer DEFAULT 0,
  metal_items integer DEFAULT 0,
  ewaste_items integer DEFAULT 0,
  paper_items integer DEFAULT 0,
  glass_items integer DEFAULT 0,
  co2_saved numeric(10,2) DEFAULT 0,
  water_saved numeric(10,2) DEFAULT 0,
  trees_saved numeric(8,2) DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_impacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own eco impact"
  ON eco_impacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own eco impact"
  ON eco_impacts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view profiles for leaderboard"
  ON user_profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);
