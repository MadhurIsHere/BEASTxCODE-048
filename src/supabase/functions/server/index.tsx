import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c392be1f/health", (c) => {
  return c.json({ status: "ok", message: "Learnio server is running" });
});

// Demo accounts endpoint
app.get("/make-server-c392be1f/demo-accounts", (c) => {
  const demoAccounts = [
    {
      id: "demo_student_6",
      username: "grade6",
      password: "demo123",
      name: "Grade 6 Student",
      type: "student",
      grade: 6,
      school: "Demo School",
      xp: 100,
      badges: ["new_learner"],
      language: "en"
    },
    {
      id: "demo_student_11",
      username: "grade11", 
      password: "demo123",
      name: "Grade 11 Student",
      type: "student",
      grade: 11,
      school: "Demo School",
      xp: 500,
      badges: ["student"],
      language: "en"
    },
    {
      id: "demo_teacher",
      username: "teacher",
      password: "demo123",
      name: "Teacher",
      type: "teacher",
      school: "Demo School",
      xp: 1000,
      badges: ["educator"],
      language: "en"
    }
  ];
  
  return c.json({ demoAccounts });
});

// Login endpoint
app.post("/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    // Check for demo accounts first
    const demoAccounts = [
      { email: 'grade8@demo.learnio.app', password: 'demo123', userId: 'demo_student_8' },
      { email: 'grade9@demo.learnio.app', password: 'demo123', userId: 'demo_student_9' },
      { email: 'grade10@demo.learnio.app', password: 'demo123', userId: 'demo_student_10' },
      { email: 'grade11@demo.learnio.app', password: 'demo123', userId: 'demo_student_11' },
      { email: 'teacher@demo.learnio.app', password: 'demo123', userId: 'demo_teacher' }
    ];
    
    const demoAccount = demoAccounts.find(acc => acc.email === email && acc.password === password);
    if (demoAccount) {
      // Return demo account data
      const demoUserData = {
        id: demoAccount.userId,
        name: demoAccount.userId === 'demo_teacher' ? 'Demo Teacher' : `Grade ${demoAccount.userId.split('_')[2]} Student`,
        username: demoAccount.userId.replace('demo_', ''),
        email: demoAccount.email,
        user_type: demoAccount.userId.includes('teacher') ? 'teacher' : 'student',
        grade: demoAccount.userId.includes('teacher') ? null : parseInt(demoAccount.userId.split('_')[2]),
        school: 'Demo School',
        xp: demoAccount.userId.includes('teacher') ? 1000 : 500,
        level: demoAccount.userId.includes('teacher') ? 10 : 5,
        streak: 7,
        badges: demoAccount.userId.includes('teacher') ? ['educator', 'mentor'] : ['student', 'achiever']
      };
      
      return c.json({
        success: true,
        user: demoUserData,
        accessToken: 'demo_token',
        message: "Demo login successful"
      });
    }

    // Attempt Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return c.json({ success: false, error: error.message }, 401);
    }

    // Get user profile from database
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_badges(badge_name),
        user_achievements(achievement_name)
      `)
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return c.json({ success: false, error: "Failed to fetch user profile" }, 500);
    }

    // Update last login
    await supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    // Format response data
    const userData = {
      ...profileData,
      badges: profileData.user_badges?.map(b => b.badge_name) || [],
      achievements: profileData.user_achievements?.map(a => a.achievement_name) || []
    };

    return c.json({
      success: true,
      user: userData,
      accessToken: data.session?.access_token,
      message: "Login successful"
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, error: "Server error during login" }, 500);
  }
});

// User registration endpoint
app.post("/make-server-c392be1f/auth/register", async (c) => {
  try {
    const { email, password, name, username, type, grade, school, profilePicture } = await c.req.json();
    
    // Create user in Supabase Auth with email confirmation required
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          type,
          grade,
          school,
          profilePicture
        },
        emailRedirectTo: `${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/verify-email`
      }
    });

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    // If user creation was successful but email not confirmed yet
    if (data.user && !data.user.email_confirmed_at) {
      return c.json({ 
        success: true, 
        requiresVerification: true,
        message: "Registration successful! Please check your email to verify your account before logging in.",
        email: email
      });
    }

    // If email is already confirmed (shouldn't happen with signUp, but just in case)
    if (data.user && data.user.email_confirmed_at) {
      // Create user profile in database
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          name,
          username,
          email,
          user_type: type,
          grade,
          school,
          profile_picture: profilePicture,
          xp: 100, // Welcome bonus
          level: 1,
          streak: 1
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return c.json({ success: false, error: "Failed to create user profile" }, 500);
      }

      // Add welcome badge
      await supabase
        .from('user_badges')
        .insert({
          user_id: data.user.id,
          badge_name: 'new_learner'
        });
      
      return c.json({ 
        success: true, 
        user: profileData,
        message: "User registered and verified successfully" 
      });
    }

    return c.json({ success: false, error: "Unexpected registration state" }, 500);

  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ success: false, error: "Server error during registration" }, 500);
  }
});

// Email verification completion endpoint
app.post("/make-server-c392be1f/auth/verify-email", async (c) => {
  try {
    const { access_token, refresh_token } = await c.req.json();
    
    if (!access_token) {
      return c.json({ success: false, error: "Access token is required" }, 400);
    }

    // Get user data from the access token
    const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
    
    if (userError || !user) {
      return c.json({ success: false, error: "Invalid or expired token" }, 400);
    }

    // Check if user profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return c.json({ 
        success: true, 
        user: existingProfile,
        message: "Email verified and user profile already exists" 
      });
    }

    // Extract user metadata
    const metadata = user.user_metadata || {};
    const { name, username, type, grade, school, profilePicture } = metadata;

    // Create user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        name: name || 'User',
        username: username || `user_${user.id.slice(0, 8)}`,
        email: user.email,
        user_type: type || 'student',
        grade: grade || null,
        school: school || '',
        profile_picture: profilePicture || '👨‍🎓',
        xp: 100, // Welcome bonus
        level: 1,
        streak: 1
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return c.json({ success: false, error: "Failed to create user profile" }, 500);
    }

    // Add welcome badge
    await supabase
      .from('user_badges')
      .insert({
        user_id: user.id,
        badge_name: 'new_learner'
      });
    
    return c.json({ 
      success: true, 
      user: profileData,
      message: "Email verified and user profile created successfully" 
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return c.json({ success: false, error: "Server error during email verification" }, 500);
  }
});

// User progress tracking
app.post("/make-server-c392be1f/user/progress", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { userId, xp, badges, achievements, gameId, levelProgress } = await c.req.json();
    
    // For demo accounts, just return success without storing
    if (userId?.startsWith('demo_')) {
      return c.json({ success: true, message: "Demo progress updated" });
    }
    
    // Verify user authentication
    if (accessToken) {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (!user || user.id !== userId) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
      }
    }
    
    // Update user profile XP and level
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        xp: xp,
        last_active: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Profile update error:', profileError);
      return c.json({ success: false, error: "Failed to update profile" }, 500);
    }

    // Update badges if provided
    if (badges && badges.length > 0) {
      for (const badge of badges) {
        await supabase
          .from('user_badges')
          .upsert({
            user_id: userId,
            badge_name: badge
          }, {
            onConflict: 'user_id,badge_name'
          });
      }
    }

    // Update achievements if provided
    if (achievements && achievements.length > 0) {
      for (const achievement of achievements) {
        await supabase
          .from('user_achievements')
          .upsert({
            user_id: userId,
            achievement_name: achievement,
            achievement_description: `Achievement: ${achievement}`
          }, {
            onConflict: 'user_id,achievement_name'
          });
      }
    }

    // Update game progress if provided
    if (gameId && levelProgress) {
      await supabase
        .from('game_progress')
        .upsert({
          user_id: userId,
          game_id: gameId,
          game_name: gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          subject: 'Mathematics', // Default subject, can be made dynamic
          grade: 8, // Default grade, should be fetched from user profile
          progress_percentage: levelProgress.overallProgress || 0,
          levels_completed: levelProgress.completedLevels || 0,
          high_score: levelProgress.totalScore || 0,
          last_played: new Date().toISOString()
        }, {
          onConflict: 'user_id,game_id'
        });
    }
    
    return c.json({ success: true, message: "Progress updated successfully" });
    
  } catch (error) {
    console.error('Progress update error:', error);
    return c.json({ success: false, error: "Server error" }, 500);
  }
});

// Leaderboard endpoint
app.get("/leaderboard", async (c) => {
  try {
    const grade = c.req.query('grade');
    const school = c.req.query('school');
    
    let query = supabase
      .from('user_profiles')
      .select(`
        id,
        name,
        grade,
        school,
        xp,
        user_badges(badge_name)
      `)
      .order('xp', { ascending: false })
      .limit(20);

    // Filter by grade if specified
    if (grade) {
      query = query.eq('grade', parseInt(grade));
    }

    // Filter by school if specified
    if (school) {
      query = query.eq('school', school);
    }

    const { data: leaderboardData, error } = await query;

    if (error) {
      console.error('Leaderboard fetch error:', error);
      return c.json({ success: false, error: "Failed to fetch leaderboard" }, 500);
    }

    // Format the response
    const formattedLeaderboard = leaderboardData.map((user, index) => ({
      id: user.id,
      name: user.name,
      grade: user.grade,
      school: user.school,
      xp: user.xp,
      badges: user.user_badges?.map(b => b.badge_name) || [],
      rank: index + 1
    }));

    return c.json({
      success: true,
      leaderboard: formattedLeaderboard
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    return c.json({ success: false, error: "Server error" }, 500);
  }
});

Deno.serve(app.fetch);