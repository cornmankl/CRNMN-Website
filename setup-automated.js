// Fully Automated Database Setup using Supabase Management API
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';

dotenv.config({ path: '.env.local' });

const projectRef = 'czwokskgwxjjwnkpsyef';
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!accessToken) {
  console.error('❌ Missing SUPABASE_ACCESS_TOKEN!');
  process.exit(1);
}

console.log('\n🚀 AUTOMATED DATABASE SETUP\n');
console.log('=================================');
console.log('📡 Using Supabase Management API...\n');

// Function to execute SQL via Management API
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${projectRef}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function setup() {
  try {
    // Step 1: Create tables
    console.log('📄 Step 1: Reading schema file...');
    const schemaSQL = fs.readFileSync('supabase-schema.sql', 'utf8');
    console.log(`✅ Schema loaded (${schemaSQL.length} characters)\n`);

    console.log('🔨 Step 2: Creating database tables...');
    console.log('   - menu_items');
    console.log('   - orders');
    console.log('   - order_items');
    console.log('   - cart_items');
    console.log('   - reviews');
    console.log('   - order_tracking\n');

    try {
      await executeSQL(schemaSQL);
      console.log('✅ Tables created successfully!\n');
    } catch (error) {
      // Check if it's just because tables already exist
      if (error.message.includes('already exists')) {
        console.log('⚠️  Tables already exist, skipping...\n');
      } else {
        throw error;
      }
    }

    // Step 2: Insert menu data
    console.log('📄 Step 3: Reading menu data...');
    const menuSQL = fs.readFileSync('supabase-real-menu.sql', 'utf8');
    console.log(`✅ Menu data loaded\n`);

    console.log('🍽️  Step 4: Inserting 127 menu items...');
    console.log('   This may take 10-20 seconds...\n');

    await executeSQL(menuSQL);
    console.log('✅ Menu data inserted successfully!\n');

    // Step 3: Verify
    console.log('🔍 Step 5: Verifying setup...\n');
    const result = await executeSQL('SELECT COUNT(*) as count FROM menu_items');
    
    const count = result[0]?.count || 0;

    console.log('=================================');
    console.log('✨ SETUP COMPLETE! ✨');
    console.log('=================================\n');
    console.log('📊 Summary:');
    console.log(`   ✅ ${count} menu items inserted`);
    console.log('   ✅ All tables created');
    console.log('   ✅ Database ready!\n');
    
    console.log('🌐 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:5173/menu');
    console.log('   3. See real menu items! 🎉\n');

    console.log('🧪 Verify with:');
    console.log('   node test-supabase.js\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n📋 MANUAL SETUP:');
    console.log('If automated setup fails, please:');
    console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    console.log('2. Run supabase-schema.sql');
    console.log('3. Run supabase-real-menu.sql');
    console.log('4. Test with: node test-supabase.js\n');
    process.exit(1);
  }
}

setup();
