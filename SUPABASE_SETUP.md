# Supabase Setup Guide for Vercel Deployment

## Your Supabase Project Details

**Project URL:** `https://uylusxvnomvlrxlrdwoi.supabase.co`  
**Project Reference:** `uylusxvnomvlrxlrdwoi`  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bHVzeHZub212bHJ4bHJkd29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzczNjAsImV4cCI6MjA2Njk1MzM2MH0.5ycW8htc_FQt9-eGQNOOoiI3FNh7mf9ol8H8yNj4qjI`

## Environment Variables for Vercel

### 1. Local Development (.env file)
Create a `.env` file in your project root:

```env
# Supabase Configuration
SUPABASE_URL="https://uylusxvnomvlrxlrdwoi.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bHVzeHZub212bHJ4bHJkd29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzczNjAsImV4cCI6MjA2Njk1MzM2MH0.5ycW8htc_FQt9-eGQNOOoiI3FNh7mf9ol8H8yNj4qjI"

# Database URL (you need to get your password from Supabase)
DATABASE_URL="postgresql://postgres.uylusxvnomvlrxlrdwoi:[YOUR_PASSWORD]@db.uylusxvnomvlrxlrdwoi.supabase.co:5432/postgres"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-secure-jwt-secret-here-change-this"

# Node Environment
NODE_ENV="development"
```

### 2. Vercel Environment Variables Setup

Go to your Vercel project dashboard and add these environment variables:

| Variable Name | Value |
|---------------|-------|
| `SUPABASE_URL` | `https://uylusxvnomvlrxlrdwoi.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bHVzeHZub212bHJ4bHJkd29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzczNjAsImV4cCI6MjA2Njk1MzM2MH0.5ycW8htc_FQt9-eGQNOOoiI3FNh7mf9ol8H8yNj4qjI` |
| `DATABASE_URL` | `postgresql://postgres.uylusxvnomvlrxlrdwoi:[YOUR_PASSWORD]@db.uylusxvnomvlrxlrdwoi.supabase.co:5432/postgres` |
| `JWT_SECRET` | `[GENERATE_SECURE_RANDOM_STRING]` |

## Getting Your Database Password

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **Database**
3. In the **Connection info** section, you'll find your password
4. Replace `[YOUR_PASSWORD]` in the DATABASE_URL with your actual password

## Setting up the Database Schema

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this repository
3. Paste and execute the SQL to create all tables and initial data

## Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Vercel CLI Alternative

If you prefer using Vercel CLI:

```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production  
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
```

## Testing the Connection

After setting up the environment variables, test your connection:

```bash
# Generate Prisma client
npx prisma generate

# Test database connection
npx prisma db pull
```

## Default Credentials

After running the SQL schema:

**Supervisor Login:**
- Username: `supervisor`
- Password: `admin123`

**Admin Access Codes:**
- Full Access: `00000`
- View-Only: `11111`

**Test Employee PINs:**
- Alice Johnson: `1234`
- Bob Smith: `5678`
- Carol Williams: `9012` 