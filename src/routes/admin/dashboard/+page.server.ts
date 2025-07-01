import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export async function load({ locals }) {
  // Check if user is authenticated and is an admin
  if (!locals.user || locals.user.role !== 'admin') {
    throw redirect(303, '/admin/login');
  }
  
  // Get all employees
  const employees = await prisma.employee.findMany({
    orderBy: {
      firstName: 'asc'
    }
  });
  
  // Get all check logs with related data
  const checkLogs = await prisma.checkLog.findMany({
    include: {
      employee: true,
      verifiedBy: true
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: 100 // Limit to last 100 logs
  });
  
  return {
    user: locals.user,
    employees,
    checkLogs: checkLogs.map(log => ({
      id: log.id,
      type: log.type,
      timestamp: log.timestamp.toISOString(),
      latitude: log.latitude,
      longitude: log.longitude,
      isVerified: log.isVerified,
      employee: {
        id: log.employee.id,
        firstName: log.employee.firstName,
        lastName: log.employee.lastName
      },
      verifiedBy: log.verifiedBy ? {
        firstName: log.verifiedBy.firstName,
        lastName: log.verifiedBy.lastName
      } : null
    }))
  };
} 