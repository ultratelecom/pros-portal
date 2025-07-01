import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { verifyPassword, generateToken, setAuthCookie } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return json({ error: 'Username and password are required' }, { status: 400 });
    }
    
    // Find supervisor by username
    const supervisor = await db.supervisor.findUnique({
      where: { username }
    });
    
    if (!supervisor) {
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Verify password
    const validPassword = await verifyPassword(password, supervisor.password);
    if (!validPassword) {
      return json({ error: 'Invalid credentials' }, { status: 401 });
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
        username: supervisor.username,
        firstName: supervisor.firstName,
        lastName: supervisor.lastName
      }
    });
  } catch (error) {
    console.error('Supervisor login error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}; 