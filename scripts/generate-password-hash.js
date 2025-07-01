import bcrypt from 'bcryptjs';

// Generate hash for 'admin123'
const password = 'admin123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nUse this hash in your SQL insert statement for the supervisor user.'); 