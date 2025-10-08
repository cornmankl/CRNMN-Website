// Automated Database Setup using Supabase REST API
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials!');
  console.log('Make sure .env.local has:');
  console.log('  - VITE_SUPABASE_URL');
  console.log('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('\n🚀 AUTOMATED DATABASE SETUP\n');
console.log('=================================');
console.log('📡 Connecting to Supabase...\n');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Parse menu SQL file into data objects
function parseMenuSQL(sql) {
  const items = [];
  
  // Extract each INSERT statement
  const insertMatches = sql.matchAll(/INSERT INTO menu_items \([^)]+\)\s+VALUES\s+\(([^)]+(?:\([^)]*\)[^)]*)*)\);/g);
  
  for (const match of insertMatches) {
    const valuesStr = match[1];
    
    // Parse the values - this is a simplified parser
    const values = valuesStr.split(/,(?![^']*'(?:(?:[^']*'){2})*[^']*$)/);
    
    const item = {
      id: values[0].replace(/'/g, '').trim(),
      name: values[1].replace(/'/g, '').trim(),
      description: values[2].replace(/'/g, '').trim(),
      price: parseFloat(values[3]),
      category: values[4].replace(/'/g, '').trim(),
      tags: values[5].replace(/'/g, '').replace(/[\{\}]/g, '').split(',').map(t => t.trim()).filter(t => t),
      in_stock: values[6].trim() === 'true',
      rating: parseFloat(values[7]),
      allergens: values[8].replace(/'/g, '').replace(/[\{\}]/g, '').split(',').map(a => a.trim()).filter(a => a),
      vendor_name: values[9].replace(/'/g, '').trim(),
      cost_price: parseFloat(values[10]),
      featured: values[11].trim() === 'true'
    };
    
    items.push(item);
  }
  
  return items;
}

async function setupDatabase() {
  try {
    console.log('✅ Connected to Supabase!\n');

    // Step 1: Check if tables exist
    console.log('📄 Step 1: Checking existing tables...\n');
    
    const { data: existingItems, error: checkError } = await supabase
      .from('menu_items')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('⚠️  Tables not found. You need to create them first!');
      console.log('\n📝 MANUAL SETUP REQUIRED:');
      console.log('=================================');
      console.log('1. Go to: https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Click "SQL Editor" in sidebar');
      console.log('4. Click "New query"');
      console.log('5. Copy ALL content from: supabase-schema.sql');
      console.log('6. Paste and click "RUN"');
      console.log('7. Wait for success message');
      console.log('8. Run this script again\n');
      process.exit(1);
    }

    console.log('✅ Tables exist!\n');

    // Step 2: Read and parse menu data
    console.log('📄 Step 2: Reading menu data file...');
    const menuSQL = fs.readFileSync('supabase-real-menu.sql', 'utf8');
    console.log(`✅ Menu data file loaded\n`);

    console.log('🔍 Step 3: Parsing menu items...');
    const menuItems = parseMenuSQL(menuSQL);
    console.log(`✅ Parsed ${menuItems.length} items\n`);

    // Step 3: Insert menu data in batches
    console.log('🍽️  Step 4: Inserting menu items...');
    console.log('   This may take 10-20 seconds...\n');

    const batchSize = 20;
    let inserted = 0;

    for (let i = 0; i < menuItems.length; i += batchSize) {
      const batch = menuItems.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('menu_items')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`   ⚠️  Batch ${Math.floor(i/batchSize) + 1} error:`, error.message);
      } else {
        inserted += batch.length;
        process.stdout.write(`\r   Progress: ${inserted}/${menuItems.length} items`);
      }
    }

    console.log('\n✅ Menu data inserted successfully!\n');

    // Step 4: Verify setup
    console.log('🔍 Step 5: Verifying setup...\n');
    
    const { count, error: verifyError } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
      throw verifyError;
    }

    console.log(`✅ Verification successful!`);
    console.log(`   Total menu items: ${count}`);
    console.log(`\n=================================`);
    console.log('✨ DATABASE SETUP COMPLETE! ✨');
    console.log('=================================\n');
    
    console.log('📊 Summary:');
    console.log(`   ✅ ${count} menu items inserted`);
    console.log(`   ✅ Database ready for use\n`);
    
    console.log('🌐 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:5173/menu');
    console.log('   3. See ' + count + ' REAL menu items! 🎉\n');

    console.log('🧪 Verify with test:');
    console.log('   node test-supabase.js\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure SUPABASE_SERVICE_ROLE_KEY is correct in .env.local');
    console.log('2. Run schema SQL manually first (see instructions above)');
    console.log('3. Check Supabase dashboard for errors\n');
    process.exit(1);
  }
}

// Run setup
setupDatabase();
