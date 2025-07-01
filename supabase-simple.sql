-- Simple database setup script WITHOUT Row Level Security
-- This will create all tables and data without any RLS complications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop all tables if they exist (fresh start)
DROP TABLE IF EXISTS "CheckLog" CASCADE;
DROP TABLE IF EXISTS "Employee" CASCADE;
DROP TABLE IF EXISTS "Supervisor" CASCADE;
DROP TABLE IF EXISTS "AdminCode" CASCADE;

-- Create Employee table
CREATE TABLE "Employee" (
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
CREATE TABLE "Supervisor" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create CheckLog table
CREATE TABLE "CheckLog" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create AdminCode table
CREATE TABLE "AdminCode" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints
ALTER TABLE "CheckLog" ADD CONSTRAINT "CheckLog_employeeId_fkey" 
FOREIGN KEY ("employeeId") REFERENCES "Employee"(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CheckLog" ADD CONSTRAINT "CheckLog_verifiedById_fkey" 
FOREIGN KEY ("verifiedById") REFERENCES "Supervisor"(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX "CheckLog_employeeId_idx" ON "CheckLog"("employeeId");
CREATE INDEX "CheckLog_timestamp_idx" ON "CheckLog"("timestamp");
CREATE INDEX "CheckLog_isVerified_idx" ON "CheckLog"("isVerified");

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_employee_updated_at BEFORE UPDATE ON "Employee"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supervisor_updated_at BEFORE UPDATE ON "Supervisor"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin codes
INSERT INTO "AdminCode" (id, code, type, "createdAt") VALUES 
    (gen_random_uuid(), '00000', 'full', CURRENT_TIMESTAMP),
    (gen_random_uuid(), '11111', 'restricted', CURRENT_TIMESTAMP);

-- Insert default supervisor (password: admin123)
INSERT INTO "Supervisor" (id, username, password, "firstName", "lastName") VALUES 
    (gen_random_uuid(), 'supervisor', '$2b$10$frSdmT1h9sXjT7hl9oD70OG9qRq//Epr9OOPUyQk7VncDxmb4L4si', 'John', 'Doe');

-- Insert sample employees
INSERT INTO "Employee" (id, pin, "firstName", "lastName", phone, address, "shoeSize", "jerseySize") VALUES 
    (gen_random_uuid(), '1234', 'Alice', 'Johnson', '555-0101', '123 Main St, Springfield', '8', 'M'),
    (gen_random_uuid(), '5678', 'Bob', 'Smith', '555-0102', '456 Oak Ave, Springfield', '10', 'L'),
    (gen_random_uuid(), '9012', 'Carol', 'Williams', '555-0103', '789 Pine Rd, Springfield', '7', 'S');

-- DISABLE Row Level Security on all tables (this is the key!)
ALTER TABLE "Employee" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Supervisor" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "CheckLog" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminCode" DISABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'Database setup completed successfully! RLS is DISABLED.' as result; 