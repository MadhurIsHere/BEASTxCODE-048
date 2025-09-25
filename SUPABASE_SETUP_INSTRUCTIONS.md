# Supabase Database Setup Instructions

## Overview
This document provides step-by-step instructions to set up the Supabase database tables for the Learnio learning platform and integrate them with your project.

## Prerequisites
- Supabase project created and configured
- Environment variables set in `.env` file:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for server functions)

## Step 1: Create Database Tables

1. Open your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase_tables.sql` into the SQL editor
4. Execute the SQL script to create all tables, indexes, and policies

The script will create the following tables:
- `user_profiles` - Extended user profile information
- `user_badges` - User-earned badges
- `user_achievements` - User achievements
- `game_progress` - Game/module progress tracking
- `level_progress` - Individual level completion tracking
- `daily_goals` - Daily learning goals
- `learning_sessions` - Learning session tracking
- `leaderboard_entries` - Leaderboard data

## Step 2: Verify Table Creation

After running the SQL script, verify that all tables were created successfully:

1. Go to the "Table Editor" in your Supabase dashboard
2. Confirm all 8 tables are present
3. Check that Row Level Security (RLS) is enabled on all tables
4. Verify that the policies are in place

## Step 3: Test Database Integration

The backend functions have been updated to use the new database schema. Test the integration:

### Registration Test
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User",
    "username": "testuser",
    "type": "student",
    "grade": 8,
    "school": "Test School",
    "profilePicture": "👨‍🎓"
  }'
```

### Login Test
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Progress Update Test
```bash
curl -X POST http://localhost:3000/make-server-c392be1f/user/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "userId": "USER_ID",
    "xp": 150,
    "badges": ["problem_solver"],
    "achievements": ["first_game_completed"],
    "gameId": "algebra-adventure",
    "levelProgress": {
      "overallProgress": 25,
      "completedLevels": 3,
      "totalScore": 450
    }
  }'
```

### Leaderboard Test
```bash
curl http://localhost:3000/leaderboard?grade=8
```

## Step 4: Environment Variables

Ensure your `.env` file contains the correct Supabase configuration:

```env
VITE_SUPABASE_URL=https://dslnuitpvyhkdgamvkuh.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 5: Backend Function Updates

The following backend functions have been updated to use the new database schema:

1. **Registration** (`/auth/register`)
   - Creates user profile in `user_profiles` table
   - Adds welcome badge to `user_badges` table

2. **Login** (`/auth/login`)
   - Fetches user profile with badges and achievements
   - Updates last login timestamp

3. **Progress Tracking** (`/make-server-c392be1f/user/progress`)
   - Updates user XP and activity
   - Manages badges and achievements
   - Tracks game progress

4. **Leaderboard** (`/leaderboard`)
   - Fetches top users by XP
   - Supports filtering by grade and school

## Step 6: Migration from KV Store (If Applicable)

If you have existing data in the KV store, you may want to migrate it:

1. Export existing user profiles from KV store
2. Transform the data to match the new schema
3. Import into the respective database tables
4. Verify data integrity

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure you're using the correct user authentication
   - Check that policies allow the intended operations

2. **Missing Environment Variables**
   - Verify all required environment variables are set
   - Restart the development server after updating `.env`

3. **Database Connection Issues**
   - Check Supabase project status
   - Verify URL and keys are correct

### Debugging Tips

1. Check Supabase logs in the dashboard
2. Use browser developer tools to inspect API responses
3. Enable detailed logging in the backend functions

## Data Structure Overview

### User Profile Structure
```typescript
interface UserProfile {
  id: string;           // UUID from Supabase Auth
  username: string;     // Unique username
  name: string;         // Display name
  email: string;        // Email address
  user_type: string;    // 'student' or 'teacher'
  grade?: number;       // Grade level (1-12)
  school?: string;      // School name
  profile_picture?: string; // Profile picture URL/emoji
  teacher_code?: string;    // Unique teacher code
  xp: number;          // Experience points
  level: number;       // User level
  streak: number;      // Learning streak
  created_at: string;  // Account creation timestamp
  last_login: string;  // Last login timestamp
  last_active: string; // Last activity timestamp
}
```

### Badge Structure
```typescript
interface UserBadge {
  id: string;
  user_id: string;
  badge_name: string;
  earned_at: string;
}
```

### Game Progress Structure
```typescript
interface GameProgress {
  id: string;
  user_id: string;
  game_id: string;
  game_name: string;
  subject: string;
  grade: number;
  progress_percentage: number;
  levels_completed: number;
  high_score: number;
  last_played: string;
}
```

## Next Steps

1. Test all functionality thoroughly
2. Monitor performance and optimize queries if needed
3. Set up database backups
4. Consider implementing caching for frequently accessed data
5. Add monitoring and alerting for database health

## Support

If you encounter any issues during setup:
1. Check the Supabase documentation
2. Review the error logs in both the application and Supabase dashboard
3. Ensure all environment variables are correctly configured
4. Verify that the database schema matches the expected structure