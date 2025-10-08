# 🚀 DATABASE SETUP - SIMPLE 3-STEP GUIDE

Ikut steps ini EXACTLY - takes only 2 minutes!

## ✅ STEP 1: Create Tables (Schema)

1. **Open Supabase SQL Editor:**
   - Click this link: https://supabase.com/dashboard/project/czwokskgwxjjwnkpsyef/sql/new
   - (You'll need to login if not already)

2. **Copy Schema SQL:**
   ```bash
   # In your terminal, run:
   cat supabase-schema.sql
   ```
   - Select ALL output and copy (Ctrl+C)

3. **Paste and Run:**
   - Paste in the SQL Editor
   - Click **RUN** button (or press Ctrl+Enter)
   - Wait 3-5 seconds
   - You should see: ✅ "Success. No rows returned"

**✅ Tables Created!** (menu_items, orders, order_items, cart_items, reviews, order_tracking)

---

## ✅ STEP 2: Insert Menu Data

1. **New Query:**
   - In SQL Editor, click "New query" button (top right)

2. **Copy Menu Data:**
   ```bash
   # In your terminal, run:
   cat supabase-real-menu.sql
   ```
   - Select ALL output and copy (Ctrl+C)

3. **Paste and Run:**
   - Paste in the SQL Editor
   - Click **RUN** button
   - Wait 5-10 seconds
   - You should see: ✅ "INSERT 0 127" or "127 rows affected"

**✅ Data Inserted!** (127 real menu items)

---

## ✅ STEP 3: Verify Setup

Run this in your terminal:

```bash
node test-supabase.js
```

**Expected output:**
```
✅ Successfully connected to Supabase!
✅ Found 127 total menu items in database

📊 Menu by Category:
   • Nasi & Rice Meals: 45 items
   • Snacks: 25 items
   • Kuih: 20 items
   • Drinks: 15 items
   ... (and more)

✅ ALL TESTS PASSED!
```

---

## 🌐 TEST YOUR WEBSITE

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   ```
   http://localhost:5173/menu
   ```

3. **You should see:**
   - ✅ 127 REAL menu items (not mock data!)
   - ✅ Real prices (RM 3.80 - RM 13.00)
   - ✅ Real vendor names
   - ✅ Categories working
   - ✅ Search working
   - ✅ Filters working

---

## 🆘 TROUBLESHOOTING

### Problem: "relation menu_items does not exist"
**Solution:** You skipped Step 1. Go back and run `supabase-schema.sql`

### Problem: "No rows returned" when running menu SQL
**Solution:** Normal! The schema SQL returns no rows. Continue to Step 2.

### Problem: SQL Editor shows "permission denied"
**Solution:** 
1. Make sure you're logged into the correct Supabase account
2. Make sure you're in the correct project (czwokskgwxjjwnkpsyef)

### Problem: test-supabase.js shows "0 items"
**Solution:** Step 2 didn't complete. Run `supabase-real-menu.sql` again.

---

## 📝 QUICK CHECKLIST

```
[ ] Opened https://supabase.com/dashboard/project/czwokskgwxjjwnkpsyef/sql
[ ] Ran supabase-schema.sql → Success!
[ ] Ran supabase-real-menu.sql → 127 rows!
[ ] Ran node test-supabase.js → All passed!
[ ] Visited http://localhost:5173/menu → See real items!
```

---

## 🎉 DONE!

Your database is now set up with 127 real menu items!

**What's working:**
- ✅ Full menu with real data
- ✅ Categories & filtering
- ✅ Search functionality
- ✅ Vendor information
- ✅ Prices & ratings
- ✅ Featured items
- ✅ Stock status
- ✅ Allergen info

**Ready for production! 🚀**
