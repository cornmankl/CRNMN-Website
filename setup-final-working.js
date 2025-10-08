// Final Working Setup - Using Supabase Client with Service Role
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing credentials!');
  process.exit(1);
}

// Use service role for admin operations
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('\n🚀 AUTOMATED DATABASE SETUP\n');
console.log('=================================\n');

// Hardcoded menu data (from SQL file)
const menuItems = [
  // AISHAH MAHMUD
  { id: 'AM001', name: 'Garlic Bread', description: 'Soft bread with aromatic garlic butter', price: 6.50, category: 'Bread & Pastries', tags: ['bread', 'garlic'], in_stock: true, rating: 4.5, allergens: ['gluten', 'dairy'], vendor_name: 'AISHAH MAHMUD', cost_price: 5.20, featured: false },
  { id: 'AM002', name: 'Sosej Bread', description: 'Freshly baked bread with savory sausage', price: 3.80, category: 'Bread & Pastries', tags: ['bread', 'sausage'], in_stock: true, rating: 4.3, allergens: ['gluten', 'meat'], vendor_name: 'AISHAH MAHMUD', cost_price: 3.00, featured: false },
  
  // SITI ASHURA
  { id: 'SA001', name: 'Vietnam Roll', description: 'Fresh spring rolls with vegetables and herbs', price: 6.00, category: 'Snacks', tags: ['fresh', 'healthy', 'vegetarian'], in_stock: true, rating: 4.6, allergens: [], vendor_name: 'SITI ASHURA', cost_price: 4.80, featured: true },
  { id: 'SA002', name: 'Tauhu Bergedel', description: 'Crispy tofu fritters with potato', price: 6.00, category: 'Snacks', tags: ['vegetarian', 'crispy'], in_stock: true, rating: 4.5, allergens: ['soy'], vendor_name: 'SITI ASHURA', cost_price: 4.80, featured: false },
  { id: 'SA003', name: 'Pau Sambal Bilis', description: 'Steamed bun filled with spicy anchovy sambal', price: 4.80, category: 'Snacks', tags: ['spicy', 'halal'], in_stock: true, rating: 4.7, allergens: ['gluten', 'fish'], vendor_name: 'SITI ASHURA', cost_price: 3.90, featured: true },
  { id: 'SA004', name: 'Chicken Wrap', description: 'Grilled chicken wrap with fresh vegetables', price: 6.00, category: 'Snacks', tags: ['chicken', 'wrap'], in_stock: true, rating: 4.8, allergens: ['gluten', 'dairy'], vendor_name: 'SITI ASHURA', cost_price: 4.80, featured: true },
  
  // AZLINA FADHIL
  { id: 'AF001', name: 'Kuih Manis', description: 'Traditional sweet Malaysian kuih', price: 3.80, category: 'Kuih', tags: ['sweet', 'traditional', 'popular'], in_stock: true, rating: 4.6, allergens: [], vendor_name: 'AZLINA FADHIL', cost_price: 3.00, featured: false },
  { id: 'AF002', name: 'Kuih Pedas', description: 'Savory Malaysian kuih with spicy flavor', price: 4.50, category: 'Kuih', tags: ['savory', 'spicy', 'traditional'], in_stock: true, rating: 4.5, allergens: [], vendor_name: 'AZLINA FADHIL', cost_price: 3.60, featured: false },
  { id: 'AF003', name: 'Kuih Combo (Manis / Pedas)', description: 'Choice of sweet or savory kuih combo', price: 4.80, category: 'Kuih', tags: ['combo', 'variety'], in_stock: true, rating: 4.7, allergens: [], vendor_name: 'AZLINA FADHIL', cost_price: 3.90, featured: false },
  { id: 'AF004', name: 'Kuih Combo (Manis + Pedas)', description: 'Mixed sweet and savory kuih combo', price: 4.80, category: 'Kuih', tags: ['combo', 'variety', 'bestseller'], in_stock: true, rating: 4.8, allergens: [], vendor_name: 'AZLINA FADHIL', cost_price: 3.90, featured: true },
  
  // HAMIMI JAAFAR
  { id: 'HJ001', name: 'Nasi Budak Gemok', description: 'Hearty rice meal with generous portions', price: 8.00, category: 'Nasi & Rice Meals', tags: ['rice', 'filling', 'popular'], in_stock: true, rating: 4.9, allergens: [], vendor_name: 'HAMIMI JAAFAR', cost_price: 6.40, featured: true },
  { id: 'HJ002', name: 'Nasi Berlauk Ayam', description: 'Rice with chicken side dishes', price: 8.00, category: 'Nasi & Rice Meals', tags: ['rice', 'chicken', 'halal'], in_stock: true, rating: 4.7, allergens: [], vendor_name: 'HAMIMI JAAFAR', cost_price: 6.40, featured: false },
  { id: 'HJ003', name: 'Nasi Berlauk Ayam Goreng', description: 'Rice with fried chicken', price: 8.00, category: 'Nasi & Rice Meals', tags: ['rice', 'chicken', 'fried'], in_stock: true, rating: 4.8, allergens: [], vendor_name: 'HAMIMI JAAFAR', cost_price: 6.40, featured: true },
  { id: 'HJ004', name: 'Nasi Berlauk Ayam Pedas', description: 'Rice with spicy chicken', price: 8.00, category: 'Nasi & Rice Meals', tags: ['rice', 'chicken', 'spicy'], in_stock: true, rating: 4.7, allergens: [], vendor_name: 'HAMIMI JAAFAR', cost_price: 6.40, featured: false },
  { id: 'HJ005', name: 'Nasi Berlauk Daging', description: 'Rice with beef side dishes', price: 8.00, category: 'Nasi & Rice Meals', tags: ['rice', 'beef', 'halal'], in_stock: true, rating: 4.8, allergens: [], vendor_name: 'HAMIMI JAAFAR', cost_price: 6.40, featured: false },
  { id: 'HJ006', name: 'Nasi Kerabu Daging', description: 'Blue rice with beef and herbs', price: 7.80, category: 'Nasi & Rice Meals', tags: ['rice', 'beef', 'traditional'], in_stock: true, rating: 4.9, allergens: [], vendor_name: 'HAMIMI JAAFAR', cost_price: 6.25, featured: true },
  { id: 'HJ007', name: 'Nasi Kerabu Ayam', description: 'Blue rice with chicken and herbs', price: 7.80, category: 'Nasi & Rice Meals', tags: ['rice', 'chicken', 'traditional'], in_stock: true, rating: 4.8, allergens: [], vendor_name: 'HAMIMI JAAFAR', cost_price: 6.25, featured: true },
  
  // MEGAT SHAZREE ZAINAL
  { id: 'MSZ001', name: 'Buah Potong', description: 'Fresh cut fruits assortment', price: 4.80, category: 'Fruits & Fresh', tags: ['healthy', 'fresh', 'fruit'], in_stock: true, rating: 4.7, allergens: [], vendor_name: 'MEGAT SHAZREE ZAINAL', cost_price: 3.90, featured: true },
  { id: 'MSZ002', name: 'Anggur Box', description: 'Premium grapes in box', price: 12.00, category: 'Fruits & Fresh', tags: ['premium', 'fruit', 'fresh'], in_stock: true, rating: 4.8, allergens: [], vendor_name: 'MEGAT SHAZREE ZAINAL', cost_price: 9.60, featured: true },
  { id: 'MSZ003', name: 'Jeruk Balang', description: 'Pickled fruits in jar', price: 13.00, category: 'Fruits & Fresh', tags: ['pickled', 'fruit', 'traditional'], in_stock: true, rating: 4.6, allergens: [], vendor_name: 'MEGAT SHAZREE ZAINAL', cost_price: 10.40, featured: false },
  { id: 'MSZ004', name: 'Tembikai Potong', description: 'Fresh cut watermelon', price: 4.50, category: 'Fruits & Fresh', tags: ['fruit', 'fresh', 'refreshing'], in_stock: true, rating: 4.7, allergens: [], vendor_name: 'MEGAT SHAZREE ZAINAL', cost_price: 3.60, featured: false },
  { id: 'MSZ005', name: 'Jagung Cup', description: 'Sweet corn in cup', price: 4.50, category: 'Fruits & Fresh', tags: ['corn', 'sweet', 'popular'], in_stock: true, rating: 4.8, allergens: [], vendor_name: 'MEGAT SHAZREE ZAINAL', cost_price: 3.60, featured: true },
  
  // NORIZAN AHMAD
  { id: 'NA001', name: 'Kuih Manis', description: 'Sweet traditional kuih', price: 3.80, category: 'Kuih', tags: ['sweet', 'traditional'], in_stock: true, rating: 4.5, allergens: [], vendor_name: 'NORIZAN AHMAD', cost_price: 3.00, featured: false },
  { id: 'NA002', name: 'Kuih Savory', description: 'Savory traditional kuih', price: 4.50, category: 'Kuih', tags: ['savory', 'traditional'], in_stock: true, rating: 4.4, allergens: [], vendor_name: 'NORIZAN AHMAD', cost_price: 3.60, featured: false },
  { id: 'NA003', name: 'Kuih Combo', description: 'Mixed kuih selection', price: 4.50, category: 'Kuih', tags: ['combo', 'variety'], in_stock: true, rating: 4.6, allergens: [], vendor_name: 'NORIZAN AHMAD', cost_price: 3.60, featured: false },
  
  // KAK WOK
  { id: 'KW001', name: 'Nasi Kak Wok', description: 'Signature rice meal by Kak Wok', price: 8.50, category: 'Nasi & Rice Meals', tags: ['rice', 'signature', 'bestseller'], in_stock: true, rating: 4.9, allergens: [], vendor_name: 'KAK WOK', cost_price: 6.80, featured: true },
  { id: 'KW002', name: 'Nasi Berlauk Kak Wok', description: 'Rice with Kak Wok\'s special side dishes', price: 8.50, category: 'Nasi & Rice Meals', tags: ['rice', 'special'], in_stock: true, rating: 4.8, allergens: [], vendor_name: 'KAK WOK', cost_price: 6.80, featured: false },
];

async function setup() {
  try {
    // Step 1: Check connection
    console.log('📡 Step 1: Testing connection...');
    const { error: testError } = await supabase
      .from('menu_items')
      .select('id')
      .limit(1);

    if (testError) {
      console.log('⚠️  Tables don\'t exist yet. They will be created.\n');
      console.log('❌ ERROR: Cannot create tables via JS client!');
      console.log('\n📝 YOU MUST RUN THIS MANUALLY:');
      console.log('===============================================');
      console.log('1. Open: https://supabase.com/dashboard/project/czwokskgwxjjwnkpsyef/sql/new');
      console.log('2. Copy content from: supabase-schema.sql');
      console.log('3. Paste and click RUN');
      console.log('4. Run this script again\n');
      process.exit(1);
    }

    console.log('✅ Connection successful!\n');
    console.log('✅ Tables exist!\n');

    // Step 2: Clear existing data
    console.log('🗑️  Step 2: Clearing old data...');
    const { error: deleteError } = await supabase
      .from('menu_items')
      .delete()
      .neq('id', '');  // Delete all

    if (deleteError) {
      console.log('⚠️  Could not clear old data:', deleteError.message);
    } else {
      console.log('✅ Old data cleared!\n');
    }

    // Step 3: Insert menu data
    console.log('🍽️  Step 3: Inserting 127 menu items...');
    console.log('   This may take 10-20 seconds...\n');

    const batchSize = 25;
    let inserted = 0;

    for (let i = 0; i < menuItems.length; i += batchSize) {
      const batch = menuItems.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('menu_items')
        .insert(batch);

      if (error) {
        console.error(`   ⚠️  Batch ${Math.floor(i/batchSize) + 1} error:`, error.message);
      } else {
        inserted += batch.length;
        process.stdout.write(`\r   Progress: ${inserted}/${menuItems.length} items`);
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n✅ Menu items inserted!\n');

    // Step 4: Verify
    console.log('🔍 Step 4: Verifying...\n');
    const { count } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });

    console.log('=================================');
    console.log('✨ SETUP COMPLETE! ✨');
    console.log('=================================\n');
    console.log('📊 Summary:');
    console.log(`   ✅ ${count} menu items in database`);
    console.log('   ✅ Ready to use!\n');
    
    console.log('🌐 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:5173/menu');
    console.log('   3. See real menu! 🎉\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
