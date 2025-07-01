import { graphqlClient, 
  GET_EMPLOYEE_BY_PIN, 
  CREATE_CHECK_LOG, 
  GET_SUPERVISOR_BY_PIN, 
  GET_SUPERVISOR_BY_ID,
  GET_PENDING_CHECKLOGS, 
  UPDATE_CHECK_LOG_STATUS, 
  GET_ADMIN_CODE, 
  GET_ALL_EMPLOYEES, 
  GET_ALL_CHECKLOGS, 
  GET_CHECKLOGS_BY_DATE_RANGE,
  CREATE_EMPLOYEE, 
  UPDATE_EMPLOYEE, 
  DELETE_EMPLOYEE 
} from './graphql.js';

// Database interface using GraphQL
export const db = {
  employee: {
    findUnique: async ({ where }: { where: { pin: string } }) => {
      const data: any = await graphqlClient.request(GET_EMPLOYEE_BY_PIN, { pin: where.pin });
      return data.Employee[0] || null;
    },
    findMany: async () => {
      const data: any = await graphqlClient.request(GET_ALL_EMPLOYEES);
      return data.Employee;
    },
    create: async ({ data }: { data: Record<string, any> }) => {
      const result: any = await graphqlClient.request(CREATE_EMPLOYEE, data);
      return result.insert_Employee_one;
    },
    update: async ({ where, data }: { where: { id: string }, data: Record<string, any> }) => {
      const result: any = await graphqlClient.request(UPDATE_EMPLOYEE, { id: where.id, ...data });
      return result.update_Employee_by_pk;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const result: any = await graphqlClient.request(DELETE_EMPLOYEE, { id: where.id });
      return result.delete_Employee_by_pk;
    }
  },
  supervisor: {
    findUnique: async ({ where }: { where: { pin?: string, id?: string } }) => {
      if (where.pin) {
        const data: any = await graphqlClient.request(GET_SUPERVISOR_BY_PIN, { pin: where.pin });
        return data.Supervisor[0] || null;
      } else if (where.id) {
        const data: any = await graphqlClient.request(GET_SUPERVISOR_BY_ID, { id: where.id });
        return data.Supervisor_by_pk || null;
      }
      return null;
    }
  },
  checkLog: {
    create: async ({ data }: { data: Record<string, any> }) => {
      const result: any = await graphqlClient.request(CREATE_CHECK_LOG, data);
      return result.insert_CheckLog_one;
    },
    findMany: async ({ where }: { where?: { status?: string } } = {}) => {
      if (where?.status === 'pending') {
        const data: any = await graphqlClient.request(GET_PENDING_CHECKLOGS);
        return data.CheckLog;
      } else {
        const data: any = await graphqlClient.request(GET_ALL_CHECKLOGS);
        return data.CheckLog;
      }
    },
    findByDateRange: async (startDate: string, endDate: string) => {
      const data: any = await graphqlClient.request(GET_CHECKLOGS_BY_DATE_RANGE, { 
        startDate, 
        endDate 
      });
      return data.CheckLog;
    },
    updateStatus: async ({ where, data }: { where: { id: string }, data: { status: string, verifiedById: string } }) => {
      const isVerified = data.status === 'verified';
      const result: any = await graphqlClient.request(UPDATE_CHECK_LOG_STATUS, { 
        id: where.id, 
        status: data.status,
        isVerified: isVerified,
        verifiedById: data.verifiedById 
      });
      return result.update_CheckLog_by_pk;
    }
  },
  adminCode: {
    findUnique: async ({ where }: { where: { code: string } }) => {
      const data: any = await graphqlClient.request(GET_ADMIN_CODE, { code: where.code });
      return data.AdminCode[0] || null;
    }
  }
};

// Keep prisma export for compatibility (but it won't work with actual operations)
export const prisma = db; 