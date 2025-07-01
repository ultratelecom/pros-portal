import { graphqlClient, 
  GET_EMPLOYEE_BY_PIN, 
  CREATE_CHECK_LOG, 
  GET_SUPERVISOR_BY_USERNAME, 
  GET_UNVERIFIED_CHECKLOGS, 
  VERIFY_CHECK_LOG, 
  GET_ADMIN_CODE, 
  GET_ALL_EMPLOYEES, 
  GET_ALL_CHECKLOGS, 
  CREATE_EMPLOYEE, 
  UPDATE_EMPLOYEE, 
  DELETE_EMPLOYEE 
} from './graphql.js';

// Database interface using GraphQL
export const db = {
  employee: {
    findUnique: async ({ where }: { where: { pin: string } }) => {
      const data = await graphqlClient.request(GET_EMPLOYEE_BY_PIN, { pin: where.pin });
      return data.Employee[0] || null;
    },
    findMany: async () => {
      const data = await graphqlClient.request(GET_ALL_EMPLOYEES);
      return data.Employee;
    },
    create: async ({ data }: { data: any }) => {
      const result = await graphqlClient.request(CREATE_EMPLOYEE, data);
      return result.insert_Employee_one;
    },
    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      const result = await graphqlClient.request(UPDATE_EMPLOYEE, { id: where.id, ...data });
      return result.update_Employee_by_pk;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const result = await graphqlClient.request(DELETE_EMPLOYEE, { id: where.id });
      return result.delete_Employee_by_pk;
    }
  },
  supervisor: {
    findUnique: async ({ where }: { where: { username?: string, id?: string } }) => {
      if (where.username) {
        const data = await graphqlClient.request(GET_SUPERVISOR_BY_USERNAME, { username: where.username });
        return data.Supervisor[0] || null;
      }
      // Handle id lookup if needed
      return null;
    }
  },
  checkLog: {
    create: async ({ data }: { data: any }) => {
      const result = await graphqlClient.request(CREATE_CHECK_LOG, data);
      return result.insert_CheckLog_one;
    },
    findMany: async ({ where, orderBy, include }: { where?: any, orderBy?: any, include?: any } = {}) => {
      if (where?.isVerified === false) {
        const data = await graphqlClient.request(GET_UNVERIFIED_CHECKLOGS);
        return data.CheckLog;
      } else {
        const data = await graphqlClient.request(GET_ALL_CHECKLOGS);
        return data.CheckLog;
      }
    },
    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      if (data.isVerified) {
        const result = await graphqlClient.request(VERIFY_CHECK_LOG, { 
          id: where.id, 
          verifiedById: data.verifiedById 
        });
        return result.update_CheckLog_by_pk;
      }
      return null;
    }
  },
  adminCode: {
    findUnique: async ({ where }: { where: { code: string } }) => {
      const data = await graphqlClient.request(GET_ADMIN_CODE, { code: where.code });
      return data.AdminCode[0] || null;
    }
  }
};

// Keep prisma export for compatibility (but it won't work with actual operations)
export const prisma = db; 