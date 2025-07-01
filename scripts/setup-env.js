import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Your Supabase project details
const envContent = `# Supabase Configuration
SUPABASE_URL="https://uylusxvnomvlrxlrdwoi.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bHVzeHZub212bHJ4bHJkd29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzczNjAsImV4cCI6MjA2Njk1MzM2MH0.5ycW8htc_FQt9-eGQNOOoiI3FNh7mf9ol8H8yNj4qjI"

# Database URL (replace [YOUR_PASSWORD] with your actual Supabase database password)
DATABASE_URL="postgresql://postgres.uylusxvnomvlrxlrdwoi:[YOUR_PASSWORD]@db.uylusxvnomvlrxlrdwoi.supabase.co:5432/postgres"

# JWT Secret (auto-generated)
JWT_SECRET="${jwtSecret}"

# Node Environment
NODE_ENV="development"
`;

const envPath = join(projectRoot, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('🔑 Generated JWT Secret:', jwtSecret);
  console.log('');
  console.log('⚠️  IMPORTANT: You need to replace [YOUR_PASSWORD] in the DATABASE_URL');
  console.log('   with your actual Supabase database password.');
  console.log('');
  console.log('📋 To find your password:');
  console.log('   1. Go to https://supabase.com/dashboard');
  console.log('   2. Select your project: uylusxvnomvlrxlrdwoi');
  console.log('   3. Navigate to Settings → Database');
  console.log('   4. Copy the password from Connection info');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Update your DATABASE_URL with the password');
  console.log('   2. Run: npx prisma generate');
  console.log('   3. Run: npm run dev');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
} 