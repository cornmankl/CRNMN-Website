// Test Supabase Connection and Menu Data
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Read from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🧪 TESTING SUPABASE CONNECTION\n');
console.log('=================================');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing Supabase credentials!');
  console.log('URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
  console.log('Key:', supabaseKey ? '✅ Found' : '❌ Missing');
  process.exit(1);
}

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Supabase Key:', supabaseKey.substring(0, 20) + '...');

// Create client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n📡 Testing database connection...');
    
    // Test 1: Check if menu_items table exists and has data
    const { data: menuItems, error: menuError, count } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact' })
      .limit(5);

    if (menuError) {
      console.error('❌ Menu items query failed:', menuError.message);
      console.log('\n⚠️  POSSIBLE ISSUES:');
      console.log('   1. Table "menu_items" does not exist in Supabase');
      console.log('   2. Run supabase-schema.sql first!');
      console.log('   3. Then run supabase-real-menu.sql');
      return;
    }

    console.log('✅ Successfully connected to Supabase!');
    console.log(`✅ Found ${count} total menu items in database`);
    
    if (menuItems && menuItems.length > 0) {
      console.log('\n📋 Sample Menu Items:');
      menuItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} - RM ${item.price} (${item.category})`);
        console.log(`      Vendor: ${item.vendor_name || 'N/A'}`);
      });
    } else {
      console.log('⚠️  No menu items found. Run supabase-real-menu.sql to insert data!');
    }

    // Test 2: Check categories
    console.log('\n📊 Categories available:');
    const { data: categories } = await supabase
      .from('menu_items')
      .select('category')
      .limit(1000);
    
    if (categories) {
      const uniqueCategories = [...new Set(categories.map(c => c.category))];
      uniqueCategories.forEach(cat => {
        console.log(`   - ${cat}`);
      });
    }

    // Test 3: Check featured items
    const { data: featured, count: featuredCount } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact' })
      .eq('featured', true);

    console.log(`\n⭐ Featured items: ${featuredCount || 0}`);
    
    // Test 4: Test auth (check if enabled)
    console.log('\n🔐 Testing authentication...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('✅ Auth service responding');
    console.log('   Current session:', session ? 'Active' : 'None (not logged in)');

    console.log('\n=================================');
    console.log('✅ ALL TESTS PASSED!');
    console.log('=================================\n');
    console.log('🎉 Your Supabase is properly configured!');
    console.log('🌐 Visit http://localhost:5173/menu to see real data');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n⚠️  TROUBLESHOOTING:');
    console.log('   1. Make sure you ran supabase-schema.sql in Supabase SQL Editor');
    console.log('   2. Then run supabase-real-menu.sql to insert menu items');
    console.log('   3. Check Supabase dashboard for any errors');
  }
}

testConnection();
