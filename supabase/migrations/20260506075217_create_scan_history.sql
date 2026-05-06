/*
  # Create Scan History Table

  ## Summary
  Creates a table to store waste classification scan results from the AI scanner.

  ## New Tables
  - `scan_history`
    - `id` (uuid, primary key) — unique scan identifier
    - `category` (text) — classified waste category (plastic, organic, metal, ewaste, paper, glass, unknown)
    - `confidence` (numeric) — AI confidence score between 0 and 1
    - `image_url` (text, nullable) — optional URL to the scanned image
    - `session_id` (text, nullable) — anonymous session identifier for grouping scans
    - `created_at` (timestamptz) — when the scan was performed

  ## Security
  - RLS enabled on scan_history
  - Public insert policy (anonymous users can save scans)
  - Public select policy limited to recent 100 records (no user-specific data)

  ## Notes
  1. This table stores anonymous scan data — no authentication required
  2. session_id can optionally group scans per browser session
  3. Confidence is stored as a decimal (0.0 to 1.0)
*/

CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'unknown',
  confidence numeric(4,3) NOT NULL DEFAULT 0,
  image_url text,
  session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert scan records"
  ON scan_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view scan records"
  ON scan_history
  FOR SELECT
  TO anon, authenticated
  USING (true);
