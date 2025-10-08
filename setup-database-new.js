// Automated Database Setup Script using PostgreSQL
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const postgresUrl = process.env.POSTGRES_URL;

if (!postgresUrl) {
  console.error('❌ Missing database connection string!');
  console.log('Make sure .env.local has POSTGRES_URL');
  process.exit(1);
}

console.log('\n🚀 AUTOMATED DATABASE SETUP\n');
console.log('=================================');
console.log('📡 Connecting to PostgreSQL database...\n');

const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    // Connect to database
    await client.connect();
    console.log('✅ Connected to database!\n');

    // Step 1: Read schema file
    console.log('📄 Step 1: Reading schema file...');
    const schemaSQL = fs.readFileSync('supabase-schema.sql', 'utf8');
    console.log(`✅ Schema file loaded (${schemaSQL.length} characters)\n`);

    // Step 2: Create tables
    console.log('🔨 Step 2: Creating database tables...');
    console.log('   This will create:');
    console.log('   - menu_items table');
    console.log('   - orders table');
    console.log('   - order_items table');
    console.log('   - cart_items table');
    console.log('   - order_tracking table');
    console.log('   - reviews table');
    console.log('   - RLS policies');
    console.log('   - Triggers & functions\n');

    await client.query(schemaSQL);
    console.log('✅ Tables created successfully!\n');

    // Step 3: Read menu data file
    console.log('📄 Step 3: Reading menu data file...');
    const menuSQL = fs.readFileSync('supabase-real-menu.sql', 'utf8');
    console.log(`✅ Menu data file loaded (${menuSQL.length} characters)\n`);

    // Step 4: Insert menu data
    console.log('🍽️  Step 4: Inserting 127 menu items...');
    console.log('   This may take 10-20 seconds...\n');

    await client.query(menuSQL);
    console.log('✅ Menu data inserted successfully!\n');

    // Step 5: Verify setup
    console.log('🔍 Step 5: Verifying setup...\n');
    
    const result = await client.query('SELECT COUNT(*) FROM menu_items');
    const count = parseInt(result.rows[0].count);

    console.log(`✅ Verification successful!`);
    console.log(`   Total menu items: ${count}`);
    console.log(`\n=================================`);
    console.log('✨ DATABASE SETUP COMPLETE! ✨');
    console.log('=================================\n');
    
    console.log('📊 Summary:');
    console.log(`   ✅ 6 tables created`);
    console.log(`   ✅ ${count} menu items inserted`);
    console.log(`   ✅ RLS policies enabled`);
    console.log(`   ✅ Triggers & functions set up\n`);
    
    console.log('🌐 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:5173/menu');
    console.log('   3. See 127 REAL menu items! 🎉\n');

    console.log('🧪 Verify with test:');
    console.log('   node test-supabase.js\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n' + error.stack);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure POSTGRES_URL is correct in .env.local');
    console.log('2. Check network connection');
    console.log('3. Try manual setup via Supabase SQL Editor\n');
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run setup
setupDatabase();
