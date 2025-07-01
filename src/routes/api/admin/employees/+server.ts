import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check if user has full admin access
  if (!locals.user || locals.user.role !== 'admin' || locals.user.type !== 'full') {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const data = await request.json();
    
        // Check if PIN already exists
    const existingEmployee = await db.employee.findUnique({
      where: { pin: data.pin }
    });

    if (existingEmployee) {
      return json({ error: 'PIN already exists' }, { status: 400 });
    }

    // Create new employee
    const employee = await db.employee.create({
      data: {
        pin: data.pin,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        address: data.address || null,
        shoeSize: data.shoeSize || null,
        jerseySize: data.jerseySize || null,
        photoUrl: data.photoUrl || null
      }
    });
    
    return json({ success: true, employee });
  } catch (error) {
    console.error('Create employee error:', error);
    return json({ error: 'Failed to create employee' }, { status: 500 });
  }
}; 