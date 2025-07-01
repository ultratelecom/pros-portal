import type { PageServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated and is a supervisor
  if (!locals.user || locals.user.role !== 'supervisor') {
    throw redirect(303, '/supervisor/login');
  }
  
  // Get supervisor details
  const supervisor = await prisma.supervisor.findUnique({
    where: { id: locals.user.id }
  });
  
  if (!supervisor) {
    throw redirect(303, '/supervisor/login');
  }
  
  // Get all pending (unverified) check logs
  const pendingLogs = await prisma.checkLog.findMany({
    where: { isVerified: false },
    include: {
      employee: true
    },
    orderBy: {
      timestamp: 'desc'
    }
  });
  
  return {
    supervisor: {
      id: supervisor.id,
      firstName: supervisor.firstName,
      lastName: supervisor.lastName
    },
    pendingLogs: pendingLogs.map(log => ({
      id: log.id,
      type: log.type,
      timestamp: log.timestamp.toISOString(),
      photoUrl: log.photoUrl,
      latitude: log.latitude,
      longitude: log.longitude,
      employee: {
        id: log.employee.id,
        pin: log.employee.pin,
        firstName: log.employee.firstName,
        lastName: log.employee.lastName
      }
    }))
  };
}; 