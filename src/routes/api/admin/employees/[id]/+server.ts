import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const PUT: RequestHandler = async ({ request, params, locals }) => {
  // Check if user has full admin access
  if (!locals.user || locals.user.role !== 'admin' || locals.user.type !== 'full') {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const data = await request.json();
    const { id } = params;
    
    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id }
    });
    
    if (!employee) {
      return json({ error: 'Employee not found' }, { status: 404 });
    }
    
    // Check if new PIN already exists (if PIN is being changed)
    if (data.pin !== employee.pin) {
      const existingEmployee = await prisma.employee.findUnique({
        where: { pin: data.pin }
      });
      
      if (existingEmployee) {
        return json({ error: 'PIN already exists' }, { status: 400 });
      }
    }
    
    // Update employee
    const updatedEmployee = await prisma.employee.update({
      where: { id },
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
    
    return json({ success: true, employee: updatedEmployee });
  } catch (error) {
    console.error('Update employee error:', error);
    return json({ error: 'Failed to update employee' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  // Check if user has full admin access
  if (!locals.user || locals.user.role !== 'admin' || locals.user.type !== 'full') {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const { id } = params;
    
    // Delete employee (cascades to check logs)
    await prisma.employee.delete({
      where: { id }
    });
    
    return json({ success: true });
  } catch (error) {
    console.error('Delete employee error:', error);
    return json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}; 