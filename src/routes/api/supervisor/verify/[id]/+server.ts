import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const POST: RequestHandler = async ({ params, locals }) => {
  // Check if user is a supervisor
  if (!locals.user || locals.user.role !== 'supervisor') {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const { id } = params;
    
    // Verify the check log
    const checkLog = await prisma.checkLog.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedById: locals.user.id
      }
    });
    
    return json({ success: true, checkLog });
  } catch (error) {
    console.error('Verify check log error:', error);
    return json({ error: 'Failed to verify check log' }, { status: 500 });
  }
}; 