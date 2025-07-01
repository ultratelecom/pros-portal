import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://qwhnyvawliftwrekbyse.hasura.us-east-1.nhost.run/v1/graphql';
const adminSecret = 'NbAr9YrmWw#aOme1Me1$TVF4fzy3^-*K';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'x-hasura-admin-secret': adminSecret,
  },
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
  mutation CreateCheckLog($employeeId: uuid!, $type: String!, $photoUrl: String, $latitude: Float, $longitude: Float, $address: String) {
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

export const GET_SUPERVISOR_BY_USERNAME = `
  query GetSupervisorByUsername($username: String!) {
    Supervisor(where: {username: {_eq: $username}}) {
      id
      username
      password
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

export const GET_UNVERIFIED_CHECKLOGS = `
  query GetUnverifiedCheckLogs {
    CheckLog(where: {isVerified: {_eq: false}}, order_by: {timestamp: desc}) {
      id
      employeeId
      type
      timestamp
      photoUrl
      latitude
      longitude
      address
      isVerified
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

export const VERIFY_CHECK_LOG = `
  mutation VerifyCheckLog($id: uuid!, $verifiedById: uuid!) {
    update_CheckLog_by_pk(pk_columns: {id: $id}, _set: {
      isVerified: true,
      verifiedAt: "now()",
      verifiedById: $verifiedById
    }) {
      id
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