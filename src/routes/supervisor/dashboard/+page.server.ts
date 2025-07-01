import type { PageServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated and is a supervisor
  if (!locals.user || locals.user.role !== 'supervisor') {
    throw redirect(303, '/supervisor/login');
  }
  
  // Get supervisor details
  const supervisor = await db.supervisor.findUnique({
    where: { id: locals.user.id }
  });
  
  if (!supervisor) {
    throw redirect(303, '/supervisor/login');
  }
  
  // Get all pending check logs
  const pendingLogs = await db.checkLog.findMany({
    where: { status: 'pending' }
  });
  
  return {
    supervisor: {
      id: supervisor.id,
      firstName: supervisor.firstName,
      lastName: supervisor.lastName
    },
    pendingLogs: pendingLogs.map((log: any) => ({
      id: log.id,
      type: log.type,
      timestamp: log.timestamp,
      photoUrl: log.photoUrl,
      latitude: log.latitude,
      longitude: log.longitude,
      address: log.address,
      status: log.status,
      employee: {
        id: log.Employee.id,
        firstName: log.Employee.firstName,
        lastName: log.Employee.lastName
      }
    }))
  };
}; 