import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
  try {
    console.log('Check-in request received');
    const requestData = await request.json();
    const { pin, photo, type, latitude, longitude } = requestData;
    
    console.log('Check-in data:', { pin, type, hasPhoto: !!photo, latitude, longitude });
    
    if (!pin) {
      return json({ error: 'PIN is required' }, { status: 400 });
    }
    
    // Find employee by PIN
    console.log('Looking up employee with PIN:', pin);
    const employee = await db.employee.findUnique({
      where: { pin }
    });
    
    console.log('Employee lookup result:', employee ? `Found: ${employee.firstName} ${employee.lastName}` : 'Not found');
    
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
    
    // Reverse geocode coordinates to get address
    let address = null;
    if (latitude && longitude) {
      try {
        console.log('Reverse geocoding coordinates:', latitude, longitude);
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'ProPortal-CheckIn/1.0'
            }
          }
        );
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          address = geoData.display_name || `${latitude}, ${longitude}`;
          console.log('Reverse geocoded address:', address);
        } else {
          console.log('Reverse geocoding failed, using coordinates');
          address = `${latitude}, ${longitude}`;
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        address = `${latitude}, ${longitude}`;
      }
    }
    
    // Create check log
    console.log('Creating check log for employee:', employee.id);
    const checkLogData = {
      employeeId: employee.id,
      type,
      photoUrl,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      address
    };
    
    console.log('Check log data:', checkLogData);
    
    const checkLog = await db.checkLog.create({
      data: checkLogData
    });
    
    console.log('Check log created successfully:', checkLog.id);
    
    return json({ 
      success: true, 
      checkLogId: checkLog.id,
      employeeName: `${employee.firstName} ${employee.lastName}`
    });
  } catch (error) {
    console.error('Check-in error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}; 