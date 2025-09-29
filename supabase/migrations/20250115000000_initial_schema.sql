/*
          # [Initial Schema Setup]
          This script sets up the complete database schema for the 'حلهالي' platform, including tables for users, subjects, grades, questions, exams, subscriptions, and payments. It also establishes relationships, enables Row Level Security (RLS) for data protection, and creates policies to control access. An automated trigger is included to create a user profile upon successful registration.

          ## Query Description: This is a foundational script for a new database. It will create all necessary tables and security structures. It is safe to run on a new, empty Supabase project. If you have existing tables with the same names, this script will fail. Ensure your database is clean before running. No data will be lost as no tables are being dropped or altered.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: false
          
          ## Structure Details:
          - **Tables Created:** profiles, subjects, grades, questions, exams, exam_questions, subscriptions, user_subscriptions, payment_requests, exam_attempts.
          - **RLS Policies:** Enabled on all tables to restrict access based on user roles and ownership.
          - **Triggers:** `on_auth_user_created` to automatically create a user profile.
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (creation of new policies for all tables)
          - Auth Requirements: Policies are based on `auth.uid()` and a custom `role` in the `profiles` table.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed by default.
          - Triggers: One trigger on `auth.users` for profile creation.
          - Estimated Impact: Low, as this is an initial setup.
          */

-- 1. PROFILES TABLE
-- Stores public user data and role.
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    grade TEXT,
    track TEXT,
    role TEXT NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.profiles IS 'Stores public user data and application-specific role.';

-- 2. SUBJECTS TABLE
-- Stores academic subjects.
CREATE TABLE public.subjects (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.subjects IS 'Stores academic subjects like Math, Physics, etc.';

-- 3. QUESTIONS TABLE
-- The main question bank.
CREATE TABLE public.questions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    text TEXT NOT NULL,
    subject_id BIGINT REFERENCES public.subjects(id) ON DELETE SET NULL,
    grade TEXT,
    type TEXT NOT NULL, -- 'mcq-single', 'mcq-multiple', 'true-false'
    points INT NOT NULL DEFAULT 1,
    options JSONB, -- For MCQ options
    correct_answer JSONB, -- For correct answers
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.questions IS 'Stores all questions for the exams.';

-- 4. EXAMS TABLE
-- Defines the structure and rules for each exam.
CREATE TABLE public.exams (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    subject_id BIGINT REFERENCES public.subjects(id) ON DELETE CASCADE,
    grade TEXT,
    type TEXT,
    mode TEXT NOT NULL, -- 'retry-highest', 'retry-first', 'restricted'
    timing_mode TEXT NOT NULL, -- 'general', 'per-question'
    duration INT, -- in minutes, for 'general' timing mode
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.exams IS 'Defines exam metadata and rules.';

-- 5. EXAM_QUESTIONS (JOIN TABLE)
-- Links questions to exams.
CREATE TABLE public.exam_questions (
    exam_id BIGINT REFERENCES public.exams(id) ON DELETE CASCADE,
    question_id BIGINT REFERENCES public.questions(id) ON DELETE CASCADE,
    PRIMARY KEY (exam_id, question_id)
);
COMMENT ON TABLE public.exam_questions IS 'Many-to-many relationship between exams and questions.';

-- 6. SUBSCRIPTIONS TABLE
-- Defines the available pricing plans.
CREATE TABLE public.subscriptions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    exams_limit INT, -- -1 for unlimited
    trial_days INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.subscriptions IS 'Defines the pricing plans for the platform.';

-- 7. USER_SUBSCRIPTIONS TABLE
-- Tracks user subscriptions.
CREATE TABLE public.user_subscriptions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id BIGINT REFERENCES public.subscriptions(id) ON DELETE RESTRICT,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL -- 'active', 'expired', 'cancelled'
);
COMMENT ON TABLE public.user_subscriptions IS 'Tracks which user has which subscription.';

-- 8. PAYMENT_REQUESTS TABLE
-- Manages payment requests from users.
CREATE TABLE public.payment_requests (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id BIGINT REFERENCES public.subscriptions(id) ON DELETE RESTRICT,
    amount DECIMAL(10, 2) NOT NULL,
    transfer_number TEXT,
    proof_url TEXT, -- URL to the uploaded proof of payment
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);
COMMENT ON TABLE public.payment_requests IS 'Manages payment requests submitted by users.';

-- 9. EXAM_ATTEMPTS TABLE
-- Stores results of each exam attempt by a user.
CREATE TABLE public.exam_attempts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    exam_id BIGINT REFERENCES public.exams(id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_score INT NOT NULL,
    answers JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
COMMENT ON TABLE public.exam_attempts IS 'Stores the results of each student exam attempt.';

-- RLS POLICIES

-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- SUBJECTS, QUESTIONS, EXAMS, SUBSCRIPTIONS POLICIES (Admin full access, others read-only)
CREATE POLICY "Public can view all" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can manage all" ON public.subjects FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public can view all" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Admins can manage all" ON public.questions FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public can view all" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Admins can manage all" ON public.exams FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public can view all" ON public.exam_questions FOR SELECT USING (true);
CREATE POLICY "Admins can manage all" ON public.exam_questions FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public can view all" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Admins can manage all" ON public.subscriptions FOR ALL USING (get_user_role(auth.uid()) = 'admin');


-- USER_SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all user subscriptions" ON public.user_subscriptions FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- PAYMENT_REQUESTS POLICIES
CREATE POLICY "Users can manage their own payment requests" ON public.payment_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all payment requests" ON public.payment_requests FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- EXAM_ATTEMPTS POLICIES
CREATE POLICY "Users can manage their own exam attempts" ON public.exam_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all exam attempts" ON public.exam_attempts FOR SELECT USING (get_user_role(auth.uid()) = 'admin');


-- TRIGGER TO CREATE PROFILE ON NEW USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, email, phone, grade, track, role)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'firstName',
        new.raw_user_meta_data->>'lastName',
        new.email,
        new.phone,
        new.raw_user_meta_data->>'grade',
        new.raw_user_meta_data->>'track',
        'student' -- Default role
    );
    -- Create a default admin user for demonstration
    IF new.email = 'admin@halhali.com' THEN
        UPDATE public.profiles SET role = 'admin' WHERE id = new.id;
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SEED INITIAL DATA
-- Insert a default admin user for easy access
-- IMPORTANT: After running this migration, you must sign up a new user with the email 'admin@halhali.com'
-- and any password. The trigger will automatically assign them the 'admin' role.

-- Insert subjects
INSERT INTO public.subjects (name) VALUES
('الرياضيات'), ('الفيزياء'), ('الكيمياء'), ('الأحياء'), ('اللغة العربية'), ('اللغة الإنجليزية');

-- Insert subscription plans
INSERT INTO public.subscriptions (name, price, exams_limit, trial_days) VALUES
('الباقة الأساسية', 50.00, 20, 3),
('الباقة المميزة', 80.00, 50, 7),
('الباقة الذهبية', 120.00, -1, 7);
