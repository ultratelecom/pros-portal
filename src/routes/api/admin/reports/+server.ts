import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check if user has full admin access
  if (!locals.user || locals.user.role !== 'admin' || locals.user.type !== 'full') {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const { month, year } = await request.json();
    
    if (!month || !year) {
      return json({ error: 'Month and year are required' }, { status: 400 });
    }
    
    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    // Get all check logs for the specified month
    const checkLogs = await db.checkLog.findByDateRange(
      startDate.toISOString(),
      endDate.toISOString()
    );
    
    // Group check logs by employee and process into timesheet format
    const employeeTimesheets: Record<string, any> = {};
    
    checkLogs.forEach((log: any) => {
      const employeeId = log.Employee.id;
      const employeeName = `${log.Employee.firstName} ${log.Employee.lastName}`;
      
      if (!employeeTimesheets[employeeId]) {
        employeeTimesheets[employeeId] = {
          employeeName,
          days: {},
          totalHours: 0
        };
      }
      
      const logDate = new Date(log.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!employeeTimesheets[employeeId].days[logDate]) {
        employeeTimesheets[employeeId].days[logDate] = {
          checkIn: null,
          checkOut: null,
          hours: 0,
          status: 'incomplete'
        };
      }
      
      if (log.type === 'check-in') {
        employeeTimesheets[employeeId].days[logDate].checkIn = log.timestamp;
      } else if (log.type === 'check-out') {
        employeeTimesheets[employeeId].days[logDate].checkOut = log.timestamp;
      }
      
      // Calculate hours if both check-in and check-out exist
      const dayData = employeeTimesheets[employeeId].days[logDate];
      if (dayData.checkIn && dayData.checkOut) {
        const hoursWorked = (new Date(dayData.checkOut).getTime() - new Date(dayData.checkIn).getTime()) / (1000 * 60 * 60);
        dayData.hours = Math.round(hoursWorked * 100) / 100; // Round to 2 decimal places
        dayData.status = 'complete';
        employeeTimesheets[employeeId].totalHours += dayData.hours;
      }
    });
    
    // Convert to array format
    const timesheet = Object.values(employeeTimesheets);
    
    return json({ 
      success: true,
      timesheet,
      period: {
        month,
        year,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    return json({ error: 'Failed to generate report' }, { status: 500 });
  }
}; 