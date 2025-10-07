# 🧪 Testing Guide - CRNMN Website

## Server is Running! ✅

The dev server is now running at: **http://localhost:3001/**

## What to Test

### 1. Home Page (/)
**URL:** http://localhost:3001/

✅ **What to check:**
- [ ] Page loads without errors
- [ ] Hero section displays
- [ ] Theme looks modern (Gold/Cream colors)
- [ ] Dark mode toggle works
- [ ] Navigation header visible
- [ ] Cart icon in header
- [ ] Responsive on mobile

### 2. Menu Page (/menu) 🌟 **NEW & FULLY FUNCTIONAL!**
**URL:** http://localhost:3001/menu

✅ **What to check:**
- [ ] 6 menu items display in grid
- [ ] Category tabs work (All, Appetizers, Mains, etc.)
- [ ] Search bar filters items
- [ ] Sort dropdown changes order
- [ ] "In Stock Only" filter works
- [ ] Each card shows:
  - [ ] Image (with fallback)
  - [ ] Item name
  - [ ] Description
  - [ ] Price (RM format)
  - [ ] Rating stars
  - [ ] Prep time & calories
  - [ ] Tags
  - [ ] "Add to Cart" button
- [ ] Click "Add to Cart" updates cart count
- [ ] Mobile responsive grid
- [ ] Smooth animations

**Test Scenarios:**
1. Search for "corn" → should show all items
2. Search for "sweet" → should show Sweet Corn Delight
3. Filter by "Appetizers" → should show 2 items
4. Filter by "Desserts" → should show Corn Ice Cream
5. Sort by "Price" → items ordered by price
6. Sort by "Rating" → highest rated first
7. Toggle "In Stock Only" → no changes (all in stock)
8. Add multiple items to cart → cart count increases

### 3. Cart Page (/cart)
**URL:** http://localhost:3001/cart

✅ **What to check:**
- [ ] Empty cart message if no items
- [ ] "Browse Menu" button goes to /menu
- [ ] If items in cart:
  - [ ] Each item displays with image, name, price
  - [ ] Quantity controls (+/-) work
  - [ ] Remove button works
  - [ ] Subtotal calculates correctly
  - [ ] Delivery fee shown (RM 5.00)
  - [ ] Tax calculated (6%)
  - [ ] Total is correct
  - [ ] "Proceed to Checkout" button visible

**Test Scenarios:**
1. Add 2-3 items from menu
2. Go to cart page
3. Increase quantity → price updates
4. Decrease quantity → price updates
5. Remove an item → recalculates
6. Check mobile view

### 4. Profile Page (/profile)
**URL:** http://localhost:3001/profile

✅ **What to check:**
- [ ] Page loads
- [ ] Profile component displays
- [ ] No authentication shows sign-in prompt

### 5. Orders Page (/orders)
**URL:** http://localhost:3001/orders

✅ **What to check:**
- [ ] Page loads
- [ ] Order tracking component displays

### 6. Navigation & Routing
✅ **What to check:**
- [ ] Clicking logo goes to home
- [ ] Header links navigate correctly
- [ ] Back button in browser works
- [ ] URLs update in address bar
- [ ] Page doesn't reload on navigation
- [ ] Mobile menu toggle works
- [ ] Active page highlighted in nav

### 7. Cart Functionality (Global)
✅ **What to check:**
- [ ] Cart icon shows count badge
- [ ] Clicking cart icon opens cart sheet
- [ ] Cart sheet displays items
- [ ] Cart persists on page refresh (Zustand)
- [ ] Can add items from multiple pages

### 8. Theme & Styling
✅ **What to check:**
- [ ] Gold gradient text on titles
- [ ] Smooth animations on hover
- [ ] Cards have elevation shadows
- [ ] Buttons have proper colors
- [ ] Dark mode toggle works
- [ ] Scrollbar is styled (gold thumb)
- [ ] Mobile responsive breakpoints
- [ ] Touch-friendly on mobile

### 9. Performance
✅ **What to check:**
- [ ] Pages load quickly
- [ ] No visible lag on filtering
- [ ] Smooth scrolling
- [ ] No console errors
- [ ] Images load progressively
- [ ] Animations are smooth (60fps)

## How to Test

### Open Browser Dev Tools
```
Chrome/Edge: F12 or Ctrl+Shift+I
Firefox: F12
Safari: Cmd+Option+I (Mac)
```

### Check Console for Errors
Look in Console tab:
- ❌ Red errors = Something broke
- ⚠️ Yellow warnings = Can be ignored
- ℹ️ Blue info = Normal logs

### Test Responsive Design
1. Open Dev Tools
2. Click device toggle (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1280px)

### Test Performance
1. Open Network tab
2. Reload page
3. Check:
   - Total load time
   - Number of requests
   - Bundle size

## Expected Results

### Menu Page Performance
- **Load time:** < 1 second
- **Initial bundle:** ~500KB (with code splitting)
- **Images:** Lazy loaded
- **Filtering:** Instant (< 100ms)

### Cart Operations
- **Add to cart:** Instant
- **Update quantity:** Instant
- **Remove item:** Instant
- **Persistent:** Survives page refresh

## Common Issues & Solutions

### Issue: Page shows blank
**Solution:** Check console for errors, verify route exists

### Issue: Menu items not showing
**Solution:** Check browser console, verify mock data loads

### Issue: Cart doesn't update
**Solution:** Check Zustand devtools, verify store connection

### Issue: Styles look broken
**Solution:** 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+Shift+R)
3. Verify tailwind.config.ts loaded

### Issue: Navigation doesn't work
**Solution:** Check React Router setup, verify Link components used

### Issue: Images don't load
**Solution:** 
1. Check if placeholder Unsplash images load
2. Verify image URLs in mock data
3. Check network tab for 404s

## Screenshots to Take

Take screenshots of:
1. Home page (desktop)
2. Menu page with all items (desktop)
3. Menu page with filters applied
4. Cart page with items
5. Mobile menu open
6. Mobile responsive grid
7. Cart sheet open
8. Dark mode

## Report Template

When testing is complete, fill this out:

```
✅ TESTING COMPLETE

## Working Features
- [ ] Home page loads
- [ ] Menu page loads
- [ ] Menu filtering works
- [ ] Add to cart works
- [ ] Cart page displays
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Dark mode works

## Issues Found
1. [Describe issue]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshot (if applicable)

## Browser Tested
- Chrome: Version ___
- Firefox: Version ___
- Safari: Version ___
- Mobile: iOS/Android

## Performance
- Load time: ___ seconds
- Console errors: Yes/No
- Memory usage: Normal/High

## Overall Rating
⭐⭐⭐⭐⭐ (1-5 stars)

## Notes
[Any additional comments]
```

## Next Steps After Testing

If everything works:
1. ✅ Commit changes
2. ✅ Push to repository
3. ✅ Start migrating other features
4. ✅ Deploy to staging

If issues found:
1. Document all issues
2. Prioritize by severity
3. Fix critical bugs first
4. Re-test after fixes

---

**Happy Testing! 🎉**

Need help? Check console logs and error messages first.
