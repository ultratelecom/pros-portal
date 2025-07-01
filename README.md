# Pro's Portal - CleanPro Manager

A comprehensive employee time tracking system for cleaning companies with photo verification, geolocation tracking, and multi-level access control.

## Features

### 🔐 Employee Check-In/Out
- PIN-based authentication
- Automatic photo capture after PIN entry
- Geolocation tracking
- Timestamp recording
- Supervisor verification required

### 👥 Access Control
- **Employees**: Check-in/out with 4-digit PIN
- **Supervisors**: Use 5-digit PIN (22222) to verify or flag employee check-ins/outs
- **Admins**: 
  - Code `00000`: Full access (manage employees, edit data, delete check-ins)
  - Code `11111`: View-only access (check-in logs only)

### 📊 Employee Management
- Complete employee profiles:
  - Photo storage
  - Personal information (name, phone, address)
  - Uniform sizes (shoe, jersey)
  - Unique PIN assignment
- Full CRUD operations for admin users

### ✅ Verification System
- Supervisor dashboard for pending check-ins/outs
- Photo verification
- Location verification
- One-click approval process
- Permanent log retention (3 months)

## Technology Stack

- **Frontend**: SvelteKit, TypeScript, Tailwind CSS
- **Backend**: SvelteKit API routes
- **Database**: SQLite (development), PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT tokens
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/ultratelecom/pros-portal.git
cd pros-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database:
```bash
npx tsx prisma/seed.ts
```

6. Start the development server:
```bash
npm run dev
```

## Default Credentials

### Supervisor Login
- PIN: `22222`

### Admin Access Codes
- Full Access: `00000`
- View-Only: `11111`

### Test Employee PINs
- Alice Johnson: `1234`
- Bob Smith: `5678`
- Carol Williams: `9012`

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your production database URL
   - `JWT_SECRET`: A secure random string

## Database Setup (Production)

For production, use PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set your PostgreSQL connection string in Vercel environment variables

3. Run migrations:
```bash
npx prisma migrate deploy
```

## API Endpoints

- `POST /api/check-in` - Employee check-in/out
- `POST /api/supervisor/login` - Supervisor authentication
- `POST /api/supervisor/verify/[id]` - Verify check-in/out
- `POST /api/admin/login` - Admin code authentication
- `GET/POST/PUT/DELETE /api/admin/employees` - Employee management
- `POST /api/logout` - Logout

## Security Features

- JWT-based authentication
- Role-based access control
- Secure password hashing (bcrypt)
- Session management
- HTTPS-only cookies in production

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
