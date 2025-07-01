import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const pin = formData.get('pin') as string;
    const photo = formData.get('photo') as string;
    const type = formData.get('type') as 'check-in' | 'check-out';
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;
    
    // Find employee by PIN
    const employee = await db.employee.findUnique({
      where: { pin }
    });
    
    if (!employee) {
      return json({ error: 'Invalid PIN' }, { status: 400 });
    }
    
    // Save photo to file system (in production, use cloud storage)
    let photoUrl = '';
    if (photo) {
      // For now, we'll store the base64 data URL directly
      // In production, upload to cloud storage and save URL
      photoUrl = photo;
    }
    
    // Create check log
    const checkLog = await db.checkLog.create({
      data: {
        employeeId: employee.id,
        type,
        photoUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
      }
    });
    
    return json({ 
      success: true, 
      checkLogId: checkLog.id,
      employeeName: `${employee.firstName} ${employee.lastName}`
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}; 