/*
  # Seed Demo Data for ProjectFlow

  1. Demo Data
    - Create a demo user account
    - Create sample boards with different themes
    - Add lists to boards (To Do, In Progress, Done, etc.)
    - Create sample tasks with various properties
    - Set up board membership

  2. Purpose
    - Provide immediate content for new users
    - Demonstrate all features of the application
    - Show best practices for organization
*/

-- Create demo user (this will be handled by Supabase Auth in the app)
-- The demo account will be: demo@projectflow.app / demo123456

-- Insert sample boards
DO $$
DECLARE
    demo_user_id uuid := '00000000-0000-0000-0000-000000000000'; -- Placeholder, will be replaced by actual user ID
    board1_id uuid := gen_random_uuid();
    board2_id uuid := gen_random_uuid();
    board3_id uuid := gen_random_uuid();
    
    -- Lists for Board 1
    list1_todo uuid := gen_random_uuid();
    list1_progress uuid := gen_random_uuid();
    list1_review uuid := gen_random_uuid();
    list1_done uuid := gen_random_uuid();
    
    -- Lists for Board 2
    list2_backlog uuid := gen_random_uuid();
    list2_sprint uuid := gen_random_uuid();
    list2_testing uuid := gen_random_uuid();
    list2_deployed uuid := gen_random_uuid();
    
    -- Lists for Board 3
    list3_ideas uuid := gen_random_uuid();
    list3_research uuid := gen_random_uuid();
    list3_design uuid := gen_random_uuid();
    list3_launch uuid := gen_random_uuid();
BEGIN
    -- Note: In real usage, this will use actual authenticated user IDs
    -- This is demo data that will be created when users sign up
    
    -- We'll use a function to create demo data for any new user
    NULL;
END $$;

-- Create function to initialize demo data for new users
CREATE OR REPLACE FUNCTION create_demo_data_for_user(user_id uuid)
RETURNS void AS $$
DECLARE
    board1_id uuid := gen_random_uuid();
    board2_id uuid := gen_random_uuid();
    board3_id uuid := gen_random_uuid();
    
    -- Lists for Board 1 - Website Redesign Project
    list1_todo uuid := gen_random_uuid();
    list1_progress uuid := gen_random_uuid();
    list1_review uuid := gen_random_uuid();
    list1_done uuid := gen_random_uuid();
    
    -- Lists for Board 2 - Mobile App Development
    list2_backlog uuid := gen_random_uuid();
    list2_sprint uuid := gen_random_uuid();
    list2_testing uuid := gen_random_uuid();
    list2_deployed uuid := gen_random_uuid();
    
    -- Lists for Board 3 - Marketing Campaign
    list3_ideas uuid := gen_random_uuid();
    list3_research uuid := gen_random_uuid();
    list3_design uuid := gen_random_uuid();
    list3_launch uuid := gen_random_uuid();
BEGIN
    -- Insert sample boards
    INSERT INTO boards (id, title, description, background_color, created_by) VALUES
    (board1_id, 'Website Redesign Project', 'Complete overhaul of company website with modern design and improved UX', '#3B82F6', user_id),
    (board2_id, 'Mobile App Development', 'iOS and Android app development for customer portal', '#10B981', user_id),
    (board3_id, 'Marketing Campaign Q1', 'Launch campaign for new product line across all channels', '#F59E0B', user_id);
    
    -- Insert lists for Board 1 - Website Redesign
    INSERT INTO lists (id, title, board_id, position) VALUES
    (list1_todo, 'To Do', board1_id, 0),
    (list1_progress, 'In Progress', board1_id, 1),
    (list1_review, 'Review', board1_id, 2),
    (list1_done, 'Done', board1_id, 3);
    
    -- Insert lists for Board 2 - Mobile App
    INSERT INTO lists (id, title, board_id, position) VALUES
    (list2_backlog, 'Backlog', board2_id, 0),
    (list2_sprint, 'Current Sprint', board2_id, 1),
    (list2_testing, 'Testing', board2_id, 2),
    (list2_deployed, 'Deployed', board2_id, 3);
    
    -- Insert lists for Board 3 - Marketing
    INSERT INTO lists (id, title, board_id, position) VALUES
    (list3_ideas, 'Ideas', board3_id, 0),
    (list3_research, 'Research', board3_id, 1),
    (list3_design, 'Design', board3_id, 2),
    (list3_launch, 'Launched', board3_id, 3);
    
    -- Insert sample tasks for Website Redesign Project
    INSERT INTO tasks (title, description, list_id, position, due_date, labels, created_by) VALUES
    ('Conduct user research', 'Interview 10 customers about current website pain points', list1_todo, 0, now() + interval '5 days', ARRAY['Research', 'High Priority'], user_id),
    ('Create wireframes', 'Design wireframes for all main pages including homepage, products, and contact', list1_todo, 1, now() + interval '10 days', ARRAY['Design', 'Medium Priority'], user_id),
    ('Set up development environment', 'Configure local development setup with latest frameworks', list1_todo, 2, now() + interval '3 days', ARRAY['Development', 'High Priority'], user_id),
    
    ('Design homepage mockup', 'Create high-fidelity mockup for new homepage design', list1_progress, 0, now() + interval '7 days', ARRAY['Design', 'High Priority'], user_id),
    ('Implement responsive navigation', 'Code the new navigation system that works on all devices', list1_progress, 1, now() + interval '12 days', ARRAY['Development', 'Medium Priority'], user_id),
    
    ('Homepage design review', 'Review homepage design with stakeholders and collect feedback', list1_review, 0, now() + interval '15 days', ARRAY['Review', 'High Priority'], user_id),
    
    ('Research competitor websites', 'Analyze top 5 competitor websites for design inspiration and features', list1_done, 0, now() - interval '2 days', ARRAY['Research', 'Completed'], user_id),
    ('Define project requirements', 'Document all functional and technical requirements for the project', list1_done, 1, now() - interval '5 days', ARRAY['Planning', 'Completed'], user_id);
    
    -- Insert sample tasks for Mobile App Development
    INSERT INTO tasks (title, description, list_id, position, due_date, labels, created_by) VALUES
    ('User authentication system', 'Implement secure login/logout functionality with biometric support', list2_backlog, 0, now() + interval '20 days', ARRAY['Feature', 'Security'], user_id),
    ('Push notifications', 'Set up push notification system for iOS and Android', list2_backlog, 1, now() + interval '25 days', ARRAY['Feature', 'Medium Priority'], user_id),
    ('Offline data sync', 'Implement offline mode with data synchronization when online', list2_backlog, 2, now() + interval '30 days', ARRAY['Feature', 'Complex'], user_id),
    
    ('Dashboard UI implementation', 'Build the main dashboard interface with charts and quick actions', list2_sprint, 0, now() + interval '8 days', ARRAY['Development', 'High Priority'], user_id),
    ('API integration', 'Connect app to backend API endpoints for data retrieval', list2_sprint, 1, now() + interval '6 days', ARRAY['Development', 'Critical'], user_id),
    
    ('Beta testing with users', 'Deploy beta version to test group and collect feedback', list2_testing, 0, now() + interval '18 days', ARRAY['Testing', 'High Priority'], user_id),
    
    ('App store setup', 'Create developer accounts and prepare app store listings', list2_deployed, 0, now() - interval '3 days', ARRAY['Release', 'Completed'], user_id);
    
    -- Insert sample tasks for Marketing Campaign
    INSERT INTO tasks (title, description, list_id, position, due_date, labels, created_by) VALUES
    ('Social media content calendar', 'Plan 3 months of social media posts across all platforms', list3_ideas, 0, now() + interval '14 days', ARRAY['Content', 'Planning'], user_id),
    ('Influencer collaboration ideas', 'Brainstorm potential influencer partnerships for product launch', list3_ideas, 1, now() + interval '10 days', ARRAY['Influencer', 'Ideas'], user_id),
    ('Email campaign concepts', 'Develop concepts for email marketing sequence', list3_ideas, 2, now() + interval '12 days', ARRAY['Email', 'Creative'], user_id),
    
    ('Market analysis report', 'Research target audience demographics and competitor strategies', list3_research, 0, now() + interval '7 days', ARRAY['Research', 'High Priority'], user_id),
    ('Budget allocation research', 'Analyze best channels for marketing budget distribution', list3_research, 1, now() + interval '9 days', ARRAY['Research', 'Budget'], user_id),
    
    ('Campaign visual identity', 'Create consistent visual branding for all campaign materials', list3_design, 0, now() + interval '16 days', ARRAY['Design', 'Branding'], user_id),
    ('Landing page design', 'Design high-converting landing page for campaign traffic', list3_design, 1, now() + interval '14 days', ARRAY['Design', 'High Priority'], user_id),
    
    ('Brand guidelines document', 'Finalize brand guidelines for consistent campaign execution', list3_launch, 0, now() - interval '1 day', ARRAY['Branding', 'Completed'], user_id);
    
    -- Add user as board member (owner) for all boards
    INSERT INTO board_members (board_id, user_id, role) VALUES
    (board1_id, user_id, 'owner'),
    (board2_id, user_id, 'owner'),
    (board3_id, user_id, 'owner');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create demo data for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Wait a moment for the user to be fully created
    PERFORM pg_sleep(1);
    
    -- Create demo data for the new user
    PERFORM create_demo_data_for_user(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This trigger would be created on auth.users table if we had access
-- For now, we'll call create_demo_data_for_user manually in the app after signup