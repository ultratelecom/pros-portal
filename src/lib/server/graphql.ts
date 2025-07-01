import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://qwhnyvawliftwrekbyse.hasura.us-east-1.nhost.run/v1/graphql';
const adminSecret = 'NbAr9YrmWw#aOme1Me1$TVF4fzy3^-*K';

// Custom fetch with timeout and retry logic
const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('GraphQL request failed:', error);
    throw error;
  }
};

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'x-hasura-admin-secret': adminSecret,
  },
  fetch: customFetch
});

// Employee queries and mutations
export const GET_EMPLOYEE_BY_PIN = `
  query GetEmployeeByPin($pin: String!) {
    Employee(where: {pin: {_eq: $pin}}) {
      id
      pin
      firstName
      lastName
      phone
      address
      shoeSize
      jerseySize
      photoUrl
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CHECK_LOG = `
  mutation CreateCheckLog($employeeId: uuid!, $type: String!, $photoUrl: String, $latitude: float8, $longitude: float8, $address: String) {
    insert_CheckLog_one(object: {
      employeeId: $employeeId,
      type: $type,
      photoUrl: $photoUrl,
      latitude: $latitude,
      longitude: $longitude,
      address: $address
    }) {
      id
      employeeId
      type
      timestamp
      photoUrl
      latitude
      longitude
      address
      isVerified
      createdAt
    }
  }
`;

export const GET_SUPERVISOR_BY_PIN = `
  query GetSupervisorByPin($pin: String!) {
    Supervisor(where: {pin: {_eq: $pin}}) {
      id
      pin
      username
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

export const GET_SUPERVISOR_BY_ID = `
  query GetSupervisorById($id: uuid!) {
    Supervisor_by_pk(id: $id) {
      id
      pin
      username
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

export const GET_PENDING_CHECKLOGS = `
  query GetPendingCheckLogs {
    CheckLog(where: {status: {_eq: "pending"}}, order_by: {timestamp: desc}) {
      id
      employeeId
      type
      timestamp
      photoUrl
      latitude
      longitude
      address
      isVerified
      status
      verifiedAt
      verifiedById
      createdAt
      Employee {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_CHECK_LOG_STATUS = `
  mutation UpdateCheckLogStatus($id: uuid!, $status: String!, $isVerified: Boolean!, $verifiedById: uuid!) {
    update_CheckLog_by_pk(pk_columns: {id: $id}, _set: {
      status: $status,
      isVerified: $isVerified,
      verifiedAt: "now()",
      verifiedById: $verifiedById
    }) {
      id
      status
      isVerified
      verifiedAt
      verifiedById
    }
  }
`;

export const GET_ADMIN_CODE = `
  query GetAdminCode($code: String!) {
    AdminCode(where: {code: {_eq: $code}}) {
      id
      code
      type
      createdAt
    }
  }
`;

export const GET_ALL_EMPLOYEES = `
  query GetAllEmployees {
    Employee(order_by: {firstName: asc}) {
      id
      pin
      firstName
      lastName
      phone
      address
      shoeSize
      jerseySize
      photoUrl
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_CHECKLOGS = `
  query GetAllCheckLogs {
    CheckLog(order_by: {timestamp: desc}) {
      id
      employeeId
      type
      timestamp
      photoUrl
      latitude
      longitude
      address
      isVerified
      status
      verifiedAt
      verifiedById
      createdAt
      Employee {
        id
        firstName
        lastName
      }
      Supervisor {
        id
        firstName
        lastName
        pin
      }
    }
  }
`;

export const GET_CHECKLOGS_BY_DATE_RANGE = `
  query GetCheckLogsByDateRange($startDate: timestamptz!, $endDate: timestamptz!) {
    CheckLog(
      where: {timestamp: {_gte: $startDate, _lte: $endDate}},
      order_by: [{Employee: {firstName: asc}}, {timestamp: asc}]
    ) {
      id
      employeeId
      type
      timestamp
      photoUrl
      latitude
      longitude
      address
      isVerified
      status
      verifiedAt
      verifiedById
      createdAt
      Employee {
        id
        firstName
        lastName
      }
      Supervisor {
        id
        firstName
        lastName
        pin
      }
    }
  }
`;

export const CREATE_EMPLOYEE = `
  mutation CreateEmployee($pin: String!, $firstName: String!, $lastName: String!, $phone: String, $address: String, $shoeSize: String, $jerseySize: String) {
    insert_Employee_one(object: {
      pin: $pin,
      firstName: $firstName,
      lastName: $lastName,
      phone: $phone,
      address: $address,
      shoeSize: $shoeSize,
      jerseySize: $jerseySize
    }) {
      id
      pin
      firstName
      lastName
      phone
      address
      shoeSize
      jerseySize
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EMPLOYEE = `
  mutation UpdateEmployee($id: uuid!, $pin: String!, $firstName: String!, $lastName: String!, $phone: String, $address: String, $shoeSize: String, $jerseySize: String) {
    update_Employee_by_pk(pk_columns: {id: $id}, _set: {
      pin: $pin,
      firstName: $firstName,
      lastName: $lastName,
      phone: $phone,
      address: $address,
      shoeSize: $shoeSize,
      jerseySize: $jerseySize
    }) {
      id
      pin
      firstName
      lastName
      phone
      address
      shoeSize
      jerseySize
      updatedAt
    }
  }
`;

export const DELETE_EMPLOYEE = `
  mutation DeleteEmployee($id: uuid!) {
    delete_Employee_by_pk(id: $id) {
      id
    }
  }
`; 