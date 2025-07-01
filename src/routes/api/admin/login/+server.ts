import { json, type RequestHandler } from '@sveltejs/kit';
import { generateToken, setAuthCookie } from '$lib/server/auth';

const ADMIN_CODES = {
  '00000': { type: 'full' as const, role: 'admin' as const },
  '11111': { type: 'restricted' as const, role: 'admin' as const }
};

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return json({ error: 'Code is required' }, { status: 400 });
    }
    
    // Check if code is valid
    const adminAccess = ADMIN_CODES[code as keyof typeof ADMIN_CODES];
    if (!adminAccess) {
      return json({ error: 'Invalid admin code' }, { status: 401 });
    }
    
    // Generate token and set cookie
    const token = generateToken({
      id: `admin_${code}`, // Using code as ID for admin
      role: adminAccess.role,
      type: adminAccess.type
    });
    
    setAuthCookie(cookies, token);
    
    return json({ 
      success: true,
      type: adminAccess.type
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}; 