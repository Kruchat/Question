-- Supabase SQL Schema for Online Exam System

-- 1. Table: settings
CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value text
);

-- 2. Table: admins
CREATE TABLE public.admins (
  username text PRIMARY KEY,
  password_hash text NOT NULL,
  salt text
);

-- 3. Table: questions
CREATE TABLE public.questions (
  id text PRIMARY KEY,
  type text NOT NULL,
  text text NOT NULL,
  options_json jsonb,
  answer text NOT NULL,
  status text NOT NULL
);

-- 4. Table: attempts
CREATE TABLE public.attempts (
  attempt_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text,
  student_name text NOT NULL,
  student_group text,
  start_time timestamp with time zone DEFAULT now(),
  end_time timestamp with time zone,
  score integer DEFAULT 0,
  status text NOT NULL
);

-- 5. Table: answers
CREATE TABLE public.answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id uuid REFERENCES public.attempts(attempt_id) ON DELETE CASCADE,
  question_id text REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_value text,
  is_correct integer,
  saved_at timestamp with time zone DEFAULT now()
);

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES 
('exam_status', 'open'),
('time_limit', '20');

-- Insert default admin
-- Default password is 'admin1234' (hashed via bcrypt). User can change it later.
-- We'll just define the admin account here but you should generate the hash in Next.js or use this example hash.
-- Hash of 'admin1234' with bcrypt:
INSERT INTO public.admins (username, password_hash, salt) 
VALUES ('admin', '$2a$12$NqN.6h4G99T9b0.vY47k7OtG/yK34lC1T5E4B5Z/8q.X/T0.o0p.e', 'SALT');

-- Insert a sample question
INSERT INTO public.questions (id, type, text, options_json, answer, status) 
VALUES ('Q001', 'choice', 'เมืองหลวงของไทยคือ?', '["กรุงเทพฯ","เชียงใหม่","ภูเก็ต","ขอนแก่น"]'::jsonb, 'กรุงเทพฯ', 'active');
