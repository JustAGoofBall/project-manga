/**
 * Seed script - populate database with test data
 * Run with: node scripts/seed.js
 */

const User = require('../models/userModel');

async function seed() {
  console.log('🌱 Seeding database with test data...\n');

  try {
    // Test Admin Account
    const testAdminEmail = 'testadmin@example.com';
    const existingAdmin = await User.getByEmail(testAdminEmail);

    if (!existingAdmin) {
      const testAdmin = await User.create('testadmin', testAdminEmail, 'testadmin123');

      // Make admin
      const db = require('../config/db');
      await db.query('UPDATE users SET is_admin = 1 WHERE id = ?', [testAdmin.id]);

      console.log('✅ Test Admin Created:');
      console.log('   Username: testadmin');
      console.log('   Email: testadmin@example.com');
      console.log('   Password: testadmin123');
      console.log('   Role: Admin');
    } else {
      console.log('ℹ️  Test admin already exists');
    }

    // Test User Account
    const testUserEmail = 'testuser@example.com';
    const existingUser = await User.getByEmail(testUserEmail);

    if (!existingUser) {
      const testUser = await User.create('testuser', testUserEmail, 'testuser123');

      console.log('\n✅ Test User Created:');
      console.log('   Username: testuser');
      console.log('   Email: testuser@example.com');
      console.log('   Password: testuser123');
      console.log('   Role: User');
    } else {
      console.log('\nℹ️  Test user already exists');
    }

    console.log('\n✨ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seed();
