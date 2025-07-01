# Hasura relationships created successfully

The following relationships have been set up in nhost/Hasura:

## Object Relationships:
- CheckLog → Employee (via employeeId)
- CheckLog → Supervisor (via verifiedById)

## Array Relationships:  
- Employee → CheckLogs (reverse relationship)
- Supervisor → VerifiedCheckLogs (reverse relationship)

These relationships enable GraphQL queries to fetch related data across tables.
The admin dashboard 500 error has been resolved.
