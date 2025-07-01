import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ params, locals, request }) => {
  // Check if user is a supervisor
  if (!locals.user || locals.user.role !== 'supervisor') {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const { id } = params;
    const { status } = await request.json(); // 'verified' or 'invalid'
    
    if (!id) {
      return json({ error: 'Check log ID is required' }, { status: 400 });
    }
    
    if (!status || !['verified', 'invalid'].includes(status)) {
      return json({ error: 'Valid status is required (verified or invalid)' }, { status: 400 });
    }
    
    // Update the check log status
    const checkLog = await db.checkLog.updateStatus({
      where: { id },
      data: {
        status,
        verifiedById: locals.user.id
      }
    });
    
    return json({ success: true, checkLog });
  } catch (error) {
    console.error('Update check log status error:', error);
    return json({ error: 'Failed to update check log status' }, { status: 500 });
  }
}; 