# AIviary — Backend Setup & Integration Guide (Supabase)

This document outlines the planned backend architecture for **AIviary**.  
The backend will be built around **Supabase**, providing authentication, database storage, and scalable APIs.  
This guide is intended for developers preparing to extend the project beyond its static front-end.

---

## 🧠 Overview

AIviary’s front-end is a static JavaScript application powered by a local dataset (`models.json`).  
The backend will:
1. Move this data into a managed database (Supabase PostgreSQL).  
2. Add authentication and user profiles.  
3. Provide APIs for saved models, ratings, and preferences.  
4. Enable analytics and subscription handling.

---

## 🧩 Why Supabase

| Feature | Benefit |
|----------|----------|
| **Auth** | Ready-to-use email, password, and OAuth login (Google, GitHub). |
| **Database** | PostgreSQL with relational data, accessible through an API. |
| **Storage** | Handles images and uploaded assets (optional future use). |
| **Edge Functions** | Lightweight serverless functions for custom logic. |
| **Realtime & Security** | Subscription to data changes + row-level security policies. |

---

## ⚙️ Step 1 — Initial Setup

### 1. Create a Supabase Project
1. Visit [https://supabase.com](https://supabase.com)  
2. Log in (GitHub recommended)  
3. Create a new project named **aiviary-db**
4. Note your **API URL** and **anon/public key**

### 2. Add Supabase SDK to the Site
In each page that will use backend functions (e.g., login, profile):
  <script src="https://unpkg.com/@supabase/supabase-js"></script>
  <script>
    const supabase = window.supabase.createClient(
      'https://YOUR_PROJECT_URL.supabase.co',
      'YOUR_PUBLIC_ANON_KEY'
    );
  </script>
This creates a connection between your front-end and your Supabase backend.

---

🧱 Step 2 — Database Schema
Tables Overview
Table	Purpose
models	Stores all AI model data (replaces models.json)
users	Stores basic user info (managed automatically by Supabase Auth)
saved_models	Tracks which models a user has bookmarked
ratings	Records user ratings and feedback for models
subscriptions	(Future) Handles paid or premium tiers

Example Schema (SQL)
sql
Copy code
-- Table: models
CREATE TABLE models (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT[],
  image TEXT,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: saved_models
CREATE TABLE saved_models (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id INT REFERENCES models(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: ratings
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  model_id INT REFERENCES models(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

---

🔐 Step 3 — Authentication Setup
Supabase handles user auth automatically.

Example JavaScript Integration
js
Copy code
// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'example-password'
});

// Log in
const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'example-password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
Once authenticated, user.id can be used to reference their saved models or ratings.

---

💾 Step 4 — Replacing models.json
After migrating to Supabase, the dataset should load dynamically:

Old (current front-end)
js
Copy code
const models = await fetchJSON('./models.json');
New (Supabase version)
js
Copy code
const { data: models, error } = await supabase
  .from('models')
  .select('*');
You can then reuse existing display functions (createModelCard(), displayModels()) without changes.

---

⚡ Step 5 — Security & Policies
Use Row-Level Security (RLS) to protect user data.

Example:

sql
Copy code
ALTER TABLE saved_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" 
  ON saved_models FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" 
  ON saved_models FOR INSERT
  WITH CHECK (auth.uid() = user_id);
These ensure users can only view or edit their own saved models.

---

📊 Step 6 — Optional Supabase Edge Functions
You can later add custom logic for:

Calculating model popularity

Sending email notifications

Tracking subscription payments

Performing scheduled cleanup

Edge Functions use Deno and integrate seamlessly with your database.

---

💼 Step 7 — Deployment Plan
Keep the main site on GitHub Pages.

Host backend logic entirely in Supabase (no separate server needed).

Optionally, connect a custom subdomain like api.aiaviary.com for API routes.

---

🧠 Future Migration (Phase 3–4)
Once you’re ready to expand beyond Supabase:

Move backend logic into Node.js + Express for deeper customization.

Use Next.js or Astro for server-side rendering.

Build a REST/GraphQL API to expose AIviary’s model data to other developers.

Maintain Supabase as the primary database or migrate to a managed PostgreSQL instance.

---

✅ Summary
Area	Technology	Status
Database	Supabase PostgreSQL	🧩 Planned
Auth	Supabase Auth (email + OAuth)	🧩 Planned
Data Migration	From models.json → Supabase models table	🧩 Planned
User Features	Saved models, ratings, profiles	🧩 Planned
Subscriptions	Supabase Functions or Stripe integration	Future
API Layer	Supabase + optional Node.js endpoints	Future

---

📘 References
Supabase Documentation

JavaScript Client Library

Row-Level Security Policies

