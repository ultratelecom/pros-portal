import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { generateToken, setAuthCookie } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { pin } = await request.json();
    
    if (!pin) {
      return json({ error: 'PIN is required' }, { status: 400 });
    }
    
    // Find supervisor by PIN
    const supervisor = await db.supervisor.findUnique({
      where: { pin }
    });
    
    if (!supervisor) {
      return json({ error: 'Invalid PIN' }, { status: 401 });
    }
    
    // Generate token and set cookie
    const token = generateToken({
      id: supervisor.id,
      role: 'supervisor'
    });
    
    setAuthCookie(cookies, token);
    
    return json({ 
      success: true,
      supervisor: {
        id: supervisor.id,
        pin: supervisor.pin,
        firstName: supervisor.firstName,
        lastName: supervisor.lastName
      }
    });
  } catch (error) {
    console.error('Supervisor login error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}; 