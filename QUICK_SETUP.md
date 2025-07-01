# 🚀 Quick Setup Guide

## Step 1: Get Your Supabase Password
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `uylusxvnomvlrxlrdwoi`
3. Go to **Settings** → **Database** → **Connection info**
4. Copy the password

## Step 2: Update Your .env File
Replace `[YOUR_PASSWORD]` in your `.env` file with the actual password:

```env
DATABASE_URL="postgresql://postgres.uylusxvnomvlrxlrdwoi:YOUR_ACTUAL_PASSWORD@db.uylusxvnomvlrxlrdwoi.supabase.co:5432/postgres"
```

## Step 3: Run Database Schema
Copy this entire script and run it in **Supabase SQL Editor**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Employee table
CREATE TABLE IF NOT EXISTS "Employee" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    pin TEXT UNIQUE NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    "shoeSize" TEXT,
    "jerseySize" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Supervisor table
CREATE TABLE IF NOT EXISTS "Supervisor" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create CheckLog table
CREATE TABLE IF NOT EXISTS "CheckLog" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "employeeId" TEXT NOT NULL,
    type TEXT NOT NULL,
    timestamp TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photoUrl" TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CheckLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CheckLog_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Supervisor"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create AdminCode table
CREATE TABLE IF NOT EXISTS "AdminCode" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "CheckLog_employeeId_idx" ON "CheckLog"("employeeId");
CREATE INDEX IF NOT EXISTS "CheckLog_timestamp_idx" ON "CheckLog"("timestamp");
CREATE INDEX IF NOT EXISTS "CheckLog_isVerified_idx" ON "CheckLog"("isVerified");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
CREATE TRIGGER update_employee_updated_at BEFORE UPDATE ON "Employee"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supervisor_updated_at BEFORE UPDATE ON "Supervisor"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin codes
INSERT INTO "AdminCode" (id, code, type, "createdAt") VALUES 
    (gen_random_uuid(), '00000', 'full', CURRENT_TIMESTAMP),
    (gen_random_uuid(), '11111', 'restricted', CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

-- Insert default supervisor (password: admin123)
INSERT INTO "Supervisor" (id, username, password, "firstName", "lastName") VALUES 
    (gen_random_uuid(), 'supervisor', '$2b$10$frSdmT1h9sXjT7hl9oD70OG9qRq//Epr9OOPUyQk7VncDxmb4L4si', 'John', 'Doe')
ON CONFLICT (username) DO NOTHING;

-- Insert sample employees
INSERT INTO "Employee" (id, pin, "firstName", "lastName", phone, address, "shoeSize", "jerseySize") VALUES 
    (gen_random_uuid(), '1234', 'Alice', 'Johnson', '555-0101', '123 Main St, Springfield', '8', 'M'),
    (gen_random_uuid(), '5678', 'Bob', 'Smith', '555-0102', '456 Oak Ave, Springfield', '10', 'L'),
    (gen_random_uuid(), '9012', 'Carol', 'Williams', '555-0103', '789 Pine Rd, Springfield', '7', 'S')
ON CONFLICT (pin) DO NOTHING;

-- Row Level Security (RLS) Policies
ALTER TABLE "Employee" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Supervisor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CheckLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminCode" ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for now
CREATE POLICY "Enable all access for Employee" ON "Employee" FOR ALL USING (true);
CREATE POLICY "Enable all access for Supervisor" ON "Supervisor" FOR ALL USING (true);
CREATE POLICY "Enable all access for CheckLog" ON "CheckLog" FOR ALL USING (true);
CREATE POLICY "Enable all access for AdminCode" ON "AdminCode" FOR ALL USING (true);
```

## Step 4: Generate Prisma Client
```bash
npx prisma generate
```

## Step 5: Test Connection
```bash
npm run dev
```

## ✅ After Setup, You'll Have:
- **Supervisor Login**: username: `supervisor`, password: `admin123`
- **Admin Codes**: `00000` (full access), `11111` (view-only)
- **Employee PINs**: `1234`, `5678`, `9012`

## 🔧 Troubleshooting
If you get errors:
1. Double-check your database password in `.env`
2. Make sure all SQL ran successfully in Supabase
3. Try: `npx prisma db push` to sync schema 