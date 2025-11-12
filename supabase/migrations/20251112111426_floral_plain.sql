/*
  # ProjectFlow Database Schema

  1. New Tables
    - `boards`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, optional)
      - `background_color` (text, not null)
      - `created_by` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `lists`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `board_id` (uuid, foreign key to boards)
      - `position` (integer, not null)
      - `created_at` (timestamptz)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, optional)
      - `list_id` (uuid, foreign key to lists)
      - `position` (integer, not null)
      - `due_date` (timestamptz, optional)
      - `assignee_id` (uuid, foreign key to auth.users, optional)
      - `labels` (text array, optional)
      - `created_by` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `board_members`
      - `id` (uuid, primary key)
      - `board_id` (uuid, foreign key to boards)
      - `user_id` (uuid, foreign key to auth.users)
      - `role` (text, enum: owner, admin, member)
      - `joined_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Board members can access board data based on their membership
*/

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  background_color text NOT NULL DEFAULT '#3B82F6',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lists table
CREATE TABLE IF NOT EXISTS lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  board_id uuid REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  list_id uuid REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
  position integer NOT NULL DEFAULT 0,
  due_date timestamptz,
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  labels text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create board_members table
CREATE TABLE IF NOT EXISTS board_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(board_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for boards
CREATE POLICY "Users can view boards they have access to"
  ON boards FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM board_members 
      WHERE board_id = boards.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own boards"
  ON boards FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Board creators can update their boards"
  ON boards FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Board creators can delete their boards"
  ON boards FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create RLS policies for lists
CREATE POLICY "Users can view lists from accessible boards"
  ON lists FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id AND (
        boards.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM board_members 
          WHERE board_id = boards.id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can manage lists in accessible boards"
  ON lists FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id AND (
        boards.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM board_members 
          WHERE board_id = boards.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks from accessible boards"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lists
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = tasks.list_id AND (
        boards.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM board_members 
          WHERE board_id = boards.id AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can manage tasks in accessible boards"
  ON tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lists
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = tasks.list_id AND (
        boards.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM board_members 
          WHERE board_id = boards.id AND user_id = auth.uid()
        )
      )
    )
  );

-- Create RLS policies for board_members
CREATE POLICY "Users can view board members for accessible boards"
  ON board_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_members.board_id AND boards.created_by = auth.uid()
    )
  );

CREATE POLICY "Board owners can manage members"
  ON board_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_members.board_id AND boards.created_by = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_boards_created_by ON boards(created_by);
CREATE INDEX IF NOT EXISTS idx_lists_board_id ON lists(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_list_id ON tasks(list_id);
CREATE INDEX IF NOT EXISTS idx_board_members_board_id ON board_members(board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user_id ON board_members(user_id);

-- Create updated_at trigger for boards
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_boards_updated_at 
    BEFORE UPDATE ON boards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();