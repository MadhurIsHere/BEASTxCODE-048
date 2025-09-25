-- Supabase Database Schema for Learnio Learning Platform
-- Copy and paste these CREATE TABLE statements into your Supabase SQL editor

-- 1. User Profiles Table
-- Stores user profile information beyond Supabase Auth
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'teacher')),
    grade INTEGER CHECK (grade >= 1 AND grade <= 12),
    school VARCHAR(255),
    profile_picture TEXT,
    teacher_code VARCHAR(20) UNIQUE,
    xp INTEGER DEFAULT 100,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Badges Table
-- Stores badges earned by users
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    badge_name VARCHAR(100) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_name)
);

-- 3. User Achievements Table
-- Stores achievements unlocked by users
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_name VARCHAR(100) NOT NULL,
    achievement_description TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_name)
);

-- 4. Game Progress Table
-- Tracks user progress in different games/modules
CREATE TABLE game_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id VARCHAR(100) NOT NULL,
    game_name VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    levels_completed INTEGER DEFAULT 0,
    total_levels INTEGER DEFAULT 0,
    high_score INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in minutes
    last_played TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- 5. Level Progress Table
-- Detailed tracking of individual level completions
CREATE TABLE level_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id VARCHAR(100) NOT NULL,
    level_number INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER DEFAULT 0,
    badge VARCHAR(20) CHECK (badge IN ('gold', 'silver', 'bronze')),
    attempts INTEGER DEFAULT 0,
    best_time INTEGER, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id, level_number)
);

-- 6. Daily Goals Table
-- Tracks daily learning goals for users
CREATE TABLE daily_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    goal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    lessons_target INTEGER DEFAULT 2,
    lessons_completed INTEGER DEFAULT 0,
    xp_target INTEGER DEFAULT 50,
    xp_earned INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, goal_date)
);

-- 7. Learning Sessions Table
-- Tracks individual learning sessions
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id VARCHAR(100) NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in minutes
    xp_earned INTEGER DEFAULT 0,
    levels_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Leaderboard Entries Table
-- Stores leaderboard data for different categories
CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'global', 'grade', 'school'
    grade INTEGER,
    school VARCHAR(255),
    rank_position INTEGER NOT NULL,
    total_xp INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_grade ON user_profiles(grade);
CREATE INDEX idx_user_profiles_school ON user_profiles(school);
CREATE INDEX idx_user_profiles_xp ON user_profiles(xp DESC);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_game_progress_user_id ON game_progress(user_id);
CREATE INDEX idx_game_progress_game_id ON game_progress(game_id);
CREATE INDEX idx_level_progress_user_game ON level_progress(user_id, game_id);
CREATE INDEX idx_daily_goals_user_date ON daily_goals(user_id, goal_date);
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_leaderboard_category_grade ON leaderboard_entries(category, grade);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own game progress" ON game_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own game progress" ON game_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own level progress" ON level_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own level progress" ON level_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own daily goals" ON daily_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own daily goals" ON daily_goals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own learning sessions" ON learning_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning sessions" ON learning_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard entries are viewable by all authenticated users
CREATE POLICY "Authenticated users can view leaderboard" ON leaderboard_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own leaderboard entry" ON leaderboard_entries FOR ALL USING (auth.uid() = user_id);

-- Functions to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_progress_updated_at BEFORE UPDATE ON game_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_level_progress_updated_at BEFORE UPDATE ON level_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_goals_updated_at BEFORE UPDATE ON daily_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboard_entries_updated_at BEFORE UPDATE ON leaderboard_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();