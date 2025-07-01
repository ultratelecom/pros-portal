import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a default supervisor
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.supervisor.create({
    data: {
      username: 'supervisor',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe'
    }
  });
  
  // Create sample employees
  const employees = [
    {
      pin: '1234',
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '555-0101',
      address: '123 Main St, Springfield',
      shoeSize: '8',
      jerseySize: 'M'
    },
    {
      pin: '5678',
      firstName: 'Bob',
      lastName: 'Smith',
      phone: '555-0102', 
      address: '456 Oak Ave, Springfield',
      shoeSize: '10',
      jerseySize: 'L'
    },
    {
      pin: '9012',
      firstName: 'Carol',
      lastName: 'Williams',
      phone: '555-0103',
      address: '789 Pine Rd, Springfield',
      shoeSize: '7',
      jerseySize: 'S'
    }
  ];
  
  for (const employee of employees) {
    await prisma.employee.create({
      data: employee
    });
  }
  
  console.log('Database seeded successfully!');
  console.log('Default supervisor credentials:');
  console.log('Username: supervisor');
  console.log('Password: admin123');
  console.log('\nAdmin codes:');
  console.log('Full access: 00000');
  console.log('View-only access: 11111');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 