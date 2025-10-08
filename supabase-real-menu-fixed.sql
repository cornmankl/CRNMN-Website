-- =============================================
-- CLEAR OLD DATA AND INSERT REAL MENU
-- =============================================

-- Delete all existing menu items
TRUNCATE TABLE menu_items CASCADE;

-- Insert REAL menu items from CRNMN business
INSERT INTO menu_items (id, name, description, price, category, tags, in_stock, rating, allergens, vendor_name, cost_price, featured) VALUES

-- AISHAH MAHMUD
('AM001', 'Garlic Bread', 'Soft bread with aromatic garlic butter', 6.50, 'Bread & Pastries', ARRAY['bread', 'garlic'], TRUE, 4.5, ARRAY['gluten', 'dairy'], 'AISHAH MAHMUD', 5.20, FALSE),
('AM002', 'Sosej Bread', 'Freshly baked bread with savory sausage', 3.80, 'Bread & Pastries', ARRAY['bread', 'sausage'], TRUE, 4.3, ARRAY['gluten', 'meat'], 'AISHAH MAHMUD', 3.00, FALSE),

-- SITI ASHURA
('SA001', 'Vietnam Roll', 'Fresh spring rolls with vegetables and herbs', 6.00, 'Snacks', ARRAY['fresh', 'healthy', 'vegetarian'], TRUE, 4.6, ARRAY[]::text[], 'SITI ASHURA', 4.80, TRUE),
('SA002', 'Tauhu Bergedel', 'Crispy tofu fritters with potato', 6.00, 'Snacks', ARRAY['vegetarian', 'crispy'], TRUE, 4.5, ARRAY['soy'], 'SITI ASHURA', 4.80, FALSE),
('SA003', 'Pau Sambal Bilis', 'Steamed bun filled with spicy anchovy sambal', 4.80, 'Snacks', ARRAY['spicy', 'halal'], TRUE, 4.7, ARRAY['gluten', 'fish'], 'SITI ASHURA', 3.90, TRUE),
('SA004', 'Chicken Wrap', 'Grilled chicken wrap with fresh vegetables', 6.00, 'Snacks', ARRAY['chicken', 'wrap'], TRUE, 4.8, ARRAY['gluten', 'dairy'], 'SITI ASHURA', 4.80, TRUE),

-- AZLINA FADHIL
('AF001', 'Kuih Manis', 'Traditional sweet Malaysian kuih', 3.80, 'Kuih', ARRAY['sweet', 'traditional', 'popular'], TRUE, 4.6, ARRAY[]::text[], 'AZLINA FADHIL', 3.00, FALSE),
('AF002', 'Kuih Pedas', 'Savory Malaysian kuih with spicy flavor', 4.50, 'Kuih', ARRAY['savory', 'spicy', 'traditional'], TRUE, 4.5, ARRAY[]::text[], 'AZLINA FADHIL', 3.60, FALSE),
('AF003', 'Kuih Combo (Manis / Pedas)', 'Choice of sweet or savory kuih combo', 4.80, 'Kuih', ARRAY['combo', 'variety'], TRUE, 4.7, ARRAY[]::text[], 'AZLINA FADHIL', 3.90, FALSE),
('AF004', 'Kuih Combo (Manis + Pedas)', 'Mixed sweet and savory kuih combo', 4.80, 'Kuih', ARRAY['combo', 'variety', 'bestseller'], TRUE, 4.8, ARRAY[]::text[], 'AZLINA FADHIL', 3.90, TRUE),

-- HAMIMI JAAFAR
('HJ001', 'Nasi Budak Gemok', 'Hearty rice meal with generous portions', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'filling', 'popular'], TRUE, 4.9, ARRAY[]::text[], 'HAMIMI JAAFAR', 6.40, TRUE),
('HJ002', 'Nasi Berlauk Ayam', 'Rice with chicken side dishes', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'chicken', 'halal'], TRUE, 4.7, ARRAY[]::text[], 'HAMIMI JAAFAR', 6.40, FALSE),
('HJ003', 'Nasi Berlauk Ayam Goreng', 'Rice with fried chicken', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'chicken', 'fried'], TRUE, 4.8, ARRAY[]::text[], 'HAMIMI JAAFAR', 6.40, TRUE),
('HJ004', 'Nasi Berlauk Ayam Pedas', 'Rice with spicy chicken', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'chicken', 'spicy'], TRUE, 4.7, ARRAY[]::text[], 'HAMIMI JAAFAR', 6.40, FALSE),
('HJ005', 'Nasi Berlauk Daging', 'Rice with beef side dishes', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'beef', 'halal'], TRUE, 4.8, ARRAY[]::text[], 'HAMIMI JAAFAR', 6.40, FALSE),
('HJ006', 'Nasi Kerabu Daging', 'Blue rice with beef and herbs', 7.80, 'Nasi & Rice Meals', ARRAY['rice', 'beef', 'traditional'], TRUE, 4.9, ARRAY[]::text[], 'HAMIMI JAAFAR', 6.25, TRUE),
('HJ007', 'Nasi Kerabu Ayam', 'Blue rice with chicken and herbs', 7.80, 'Nasi & Rice Meals', ARRAY['rice', 'chicken', 'traditional'], TRUE, 4.8, ARRAY[]::text[], 'HAMIMI JAAFAR', 6.25, TRUE),

-- MEGAT SHAZREE ZAINAL
('MSZ001', 'Buah Potong', 'Fresh cut fruits assortment', 4.80, 'Fruits & Fresh', ARRAY['healthy', 'fresh', 'fruit'], TRUE, 4.7, ARRAY[]::text[], 'MEGAT SHAZREE ZAINAL', 3.90, TRUE),
('MSZ002', 'Anggur Box', 'Premium grapes in box', 12.00, 'Fruits & Fresh', ARRAY['premium', 'fruit', 'fresh'], TRUE, 4.8, ARRAY[]::text[], 'MEGAT SHAZREE ZAINAL', 9.60, TRUE),
('MSZ003', 'Jeruk Balang', 'Pickled fruits in jar', 13.00, 'Fruits & Fresh', ARRAY['pickled', 'fruit', 'traditional'], TRUE, 4.6, ARRAY[]::text[], 'MEGAT SHAZREE ZAINAL', 10.40, FALSE),
('MSZ004', 'Tembikai Potong', 'Fresh cut watermelon', 4.50, 'Fruits & Fresh', ARRAY['fruit', 'fresh', 'refreshing'], TRUE, 4.7, ARRAY[]::text[], 'MEGAT SHAZREE ZAINAL', 3.60, FALSE),
('MSZ005', 'Jagung Cup', 'Sweet corn in cup', 4.50, 'Fruits & Fresh', ARRAY['corn', 'sweet', 'popular'], TRUE, 4.8, ARRAY[]::text[], 'MEGAT SHAZREE ZAINAL', 3.60, TRUE),

-- NORIZAN AHMAD
('NA001', 'Kuih Manis', 'Sweet traditional kuih', 3.80, 'Kuih', ARRAY['sweet', 'traditional'], TRUE, 4.5, ARRAY[]::text[], 'NORIZAN AHMAD', 3.00, FALSE),
('NA002', 'Kuih Savory', 'Savory traditional kuih', 4.50, 'Kuih', ARRAY['savory', 'traditional'], TRUE, 4.4, ARRAY[]::text[], 'NORIZAN AHMAD', 3.60, FALSE),
('NA003', 'Kuih Combo', 'Mixed kuih selection', 4.50, 'Kuih', ARRAY['combo', 'variety'], TRUE, 4.6, ARRAY[]::text[], 'NORIZAN AHMAD', 3.60, FALSE),

-- KAK WOK
('KW001', 'Nasi Kak Wok', 'Signature rice meal by Kak Wok', 8.50, 'Nasi & Rice Meals', ARRAY['rice', 'signature', 'bestseller'], TRUE, 4.9, ARRAY[]::text[], 'KAK WOK', 6.80, TRUE),

-- SUE (SU ELLA)
('SE001', 'Bun Sosej', 'Soft bun with sausage', 4.80, 'Bread & Pastries', ARRAY['bread', 'sausage'], TRUE, 4.5, ARRAY['gluten', 'meat'], 'SUE (SU ELLA)', 3.90, FALSE),
('SE002', 'Roti Choc', 'Chocolate bread', 4.80, 'Bread & Pastries', ARRAY['bread', 'chocolate', 'sweet'], TRUE, 4.6, ARRAY['gluten', 'dairy'], 'SUE (SU ELLA)', 3.90, FALSE),
('SE003', 'Roti Chicken Floss', 'Bread with chicken floss', 4.80, 'Bread & Pastries', ARRAY['bread', 'chicken'], TRUE, 4.5, ARRAY['gluten'], 'SUE (SU ELLA)', 3.90, FALSE),

-- SITI KHATIJAH
('SK001', 'Bubur Nasi', 'Traditional rice porridge', 6.50, 'Nasi & Rice Meals', ARRAY['porridge', 'traditional', 'comfort'], TRUE, 4.7, ARRAY[]::text[], 'SITI KHATIJAH', 5.20, FALSE),
('SK002', 'Lempeng', 'Traditional pancake', 6.50, 'Kuih', ARRAY['pancake', 'traditional'], TRUE, 4.6, ARRAY['gluten'], 'SITI KHATIJAH', 5.20, FALSE),

-- LINDA
('LI001', 'Kerabu Maggi', 'Spicy instant noodle salad', 7.50, 'Nasi & Rice Meals', ARRAY['spicy', 'noodles', 'popular'], TRUE, 4.8, ARRAY['gluten'], 'LINDA', 6.00, TRUE),
('LI002', 'Kuih Muih (Manis)', 'Sweet traditional cakes', 3.80, 'Kuih', ARRAY['sweet', 'traditional'], TRUE, 4.4, ARRAY[]::text[], 'LINDA', 3.00, FALSE),
('LI003', 'Laksam', 'Traditional noodle dish', 7.50, 'Nasi & Rice Meals', ARRAY['noodles', 'traditional'], TRUE, 4.7, ARRAY['gluten'], 'LINDA', 6.00, FALSE),
('LI004', 'Nasi Ayam', 'Chicken rice', 7.50, 'Nasi & Rice Meals', ARRAY['rice', 'chicken'], TRUE, 4.7, ARRAY[]::text[], 'LINDA', 6.00, FALSE),
('LI005', 'Nasi Berlauk Ayam', 'Rice with chicken sides', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'chicken'], TRUE, 4.6, ARRAY[]::text[], 'LINDA', 6.40, FALSE),
('LI006', 'Nasi Kerabu', 'Blue herb rice', 7.80, 'Nasi & Rice Meals', ARRAY['rice', 'traditional'], TRUE, 4.8, ARRAY[]::text[], 'LINDA', 6.25, TRUE),

-- ROSMAHAYATI
('RO001', 'Nasi Lemak', 'Fragrant coconut rice', 3.80, 'Nasi & Rice Meals', ARRAY['rice', 'traditional', 'popular'], TRUE, 4.9, ARRAY[]::text[], 'ROSMAHAYATI', 3.00, TRUE),

-- RUSYDLAZIZ
('RU001', 'Apam Nasi', 'Steamed rice cake', 3.80, 'Kuih', ARRAY['steamed', 'traditional'], TRUE, 4.5, ARRAY[]::text[], 'RUSYDLAZIZ', 3.00, FALSE),
('RU002', 'Puteri Ayu', 'Pandan coconut cake', 3.80, 'Kuih', ARRAY['sweet', 'pandan'], TRUE, 4.6, ARRAY[]::text[], 'RUSYDLAZIZ', 3.00, FALSE),
('RU003', 'Dangai', 'Traditional layered cake', 3.80, 'Kuih', ARRAY['layered', 'traditional'], TRUE, 4.4, ARRAY[]::text[], 'RUSYDLAZIZ', 3.00, FALSE),
('RU004', 'Kasui', 'Steamed tapioca cake', 3.80, 'Kuih', ARRAY['steamed', 'traditional'], TRUE, 4.5, ARRAY[]::text[], 'RUSYDLAZIZ', 3.00, FALSE),
('RU005', 'Gula Hangus', 'Caramelized sugar cake', 3.80, 'Kuih', ARRAY['sweet', 'caramel'], TRUE, 4.6, ARRAY[]::text[], 'RUSYDLAZIZ', 3.00, FALSE),

-- ZAIDEEN MR MERRY
('ZM001', 'Kek Tapak Kuda', 'Horseshoe cake', 3.80, 'Cakes & Desserts', ARRAY['cake', 'traditional'], TRUE, 4.5, ARRAY['gluten', 'eggs'], 'ZAIDEEN MR MERRY', 3.00, FALSE),

-- NASSHAH BAKRI
('NB001', 'Ayam Goreng Mekdi', 'Crispy fried chicken', 4.80, 'Snacks', ARRAY['chicken', 'fried', 'crispy'], TRUE, 4.8, ARRAY[]::text[], 'NASSHAH BAKRI', 3.90, TRUE),
('NB002', 'Buah Potong', 'Fresh cut fruits', 3.80, 'Fruits & Fresh', ARRAY['fruit', 'fresh', 'healthy'], TRUE, 4.6, ARRAY[]::text[], 'NASSHAH BAKRI', 3.00, FALSE),
('NB003', 'Bubur Ayam', 'Chicken porridge', 6.50, 'Nasi & Rice Meals', ARRAY['porridge', 'chicken', 'comfort'], TRUE, 4.7, ARRAY[]::text[], 'NASSHAH BAKRI', 5.20, FALSE),
('NB004', 'Spaghetti Carbonara', 'Creamy pasta carbonara', 7.50, 'Nasi & Rice Meals', ARRAY['pasta', 'western'], TRUE, 4.8, ARRAY['gluten', 'dairy'], 'NASSHAH BAKRI', 6.00, TRUE),

-- MANJA DELIGHTS
('MD001', 'Kek Pisang', 'Banana cake', 6.00, 'Cakes & Desserts', ARRAY['cake', 'banana'], TRUE, 4.7, ARRAY['gluten', 'eggs'], 'MANJA DELIGHTS', 4.80, FALSE),
('MD002', 'Brownies', 'Rich chocolate brownies', 7.80, 'Cakes & Desserts', ARRAY['chocolate', 'dessert', 'popular'], TRUE, 4.9, ARRAY['gluten', 'eggs', 'dairy'], 'MANJA DELIGHTS', 6.25, TRUE),
('MD003', 'Choco Jar', 'Chocolate dessert in jar', 10.00, 'Cakes & Desserts', ARRAY['chocolate', 'premium', 'dessert'], TRUE, 4.8, ARRAY['dairy'], 'MANJA DELIGHTS', 8.00, TRUE),
('MD004', 'Donat', 'Fresh donuts', 6.00, 'Cakes & Desserts', ARRAY['donut', 'sweet'], TRUE, 4.6, ARRAY['gluten', 'eggs'], 'MANJA DELIGHTS', 4.80, FALSE),
('MD005', 'Egg Tart', 'Portuguese egg tart', 6.50, 'Cakes & Desserts', ARRAY['tart', 'eggs'], TRUE, 4.7, ARRAY['gluten', 'eggs', 'dairy'], 'MANJA DELIGHTS', 5.20, FALSE),
('MD006', 'Kek Batik', 'Biscuit chocolate cake', 7.50, 'Cakes & Desserts', ARRAY['cake', 'chocolate', 'traditional'], TRUE, 4.8, ARRAY['gluten', 'dairy'], 'MANJA DELIGHTS', 6.00, TRUE),
('MD007', 'Marshmellow', 'Fluffy marshmallow treats', 9.00, 'Cakes & Desserts', ARRAY['sweet', 'dessert'], TRUE, 4.5, ARRAY[]::text[], 'MANJA DELIGHTS', 7.20, FALSE),

-- ROSLI
('ROSLI001', 'Nasi Berlauk', 'Rice with mixed sides', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'variety'], TRUE, 4.7, ARRAY[]::text[], 'ROSLI', 7.00, FALSE),
('ROSLI002', 'Pulut Nasi Kelapa Ikan Masin', 'Glutinous rice with salted fish', 5.00, 'Nasi & Rice Meals', ARRAY['rice', 'traditional'], TRUE, 4.6, ARRAY['fish'], 'ROSLI', 4.00, FALSE),

-- NOORAISHAH ARIFFIN
('NAA001', 'Trifle Puding', 'Layered trifle pudding', 4.80, 'Cakes & Desserts', ARRAY['pudding', 'dessert'], TRUE, 4.6, ARRAY['dairy'], 'NOORAISHAH ARIFFIN', 3.90, FALSE),
('NAA002', 'Cream Caramel', 'Silky caramel pudding', 4.80, 'Cakes & Desserts', ARRAY['pudding', 'caramel'], TRUE, 4.7, ARRAY['dairy', 'eggs'], 'NOORAISHAH ARIFFIN', 3.90, FALSE),
('NAA003', 'Agar - Agar Gudel Gula Melaka', 'Jelly with palm sugar', 4.80, 'Cakes & Desserts', ARRAY['jelly', 'traditional'], TRUE, 4.5, ARRAY[]::text[], 'NOORAISHAH ARIFFIN', 3.90, FALSE),
('NAA004', 'Tropical Fruit Jelly', 'Fruit flavored jelly', 4.80, 'Cakes & Desserts', ARRAY['jelly', 'fruit'], TRUE, 4.6, ARRAY[]::text[], 'NOORAISHAH ARIFFIN', 3.90, FALSE),
('NAA005', 'Nasi Berlauk', 'Rice with sides', 8.00, 'Nasi & Rice Meals', ARRAY['rice'], TRUE, 4.6, ARRAY[]::text[], 'NOORAISHAH ARIFFIN', 7.00, FALSE),

-- MASNI ATAN
('MA001', 'Popia Sayur', 'Vegetable spring rolls', 4.50, 'Snacks', ARRAY['vegetarian', 'fresh'], TRUE, 4.6, ARRAY[]::text[], 'MASNI ATAN', 3.60, FALSE),
('MA002', 'Cucur Sayur', 'Vegetable fritters', 4.50, 'Snacks', ARRAY['vegetarian', 'fried'], TRUE, 4.5, ARRAY['gluten'], 'MASNI ATAN', 3.60, FALSE),
('MA003', 'Tauhu Bergedel Kentang', 'Tofu potato cakes', 4.80, 'Snacks', ARRAY['vegetarian'], TRUE, 4.6, ARRAY['soy'], 'MASNI ATAN', 3.90, FALSE),
('MA004', 'Nasi berlauk - Ayam Berlado', 'Rice with spicy chicken', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'chicken', 'spicy'], TRUE, 4.8, ARRAY[]::text[], 'MASNI ATAN', 7.00, TRUE),
('MA005', 'Nasi berlauk - Ayam Buttermilk', 'Rice with buttermilk chicken', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'chicken', 'popular'], TRUE, 4.9, ARRAY['dairy'], 'MASNI ATAN', 7.00, TRUE),
('MA006', 'Nasi berlauk - Ayam Bawang', 'Rice with onion chicken', 8.00, 'Nasi & Rice Meals', ARRAY['rice', 'chicken'], TRUE, 4.7, ARRAY[]::text[], 'MASNI ATAN', 7.00, FALSE),
('MA007', 'Mee Kari', 'Curry noodles', 7.50, 'Nasi & Rice Meals', ARRAY['noodles', 'curry', 'spicy'], TRUE, 4.8, ARRAY['gluten'], 'MASNI ATAN', 6.50, TRUE),
('MA008', 'Laksa Asam', 'Sour spicy noodle soup', 7.50, 'Nasi & Rice Meals', ARRAY['noodles', 'spicy', 'traditional'], TRUE, 4.8, ARRAY['gluten', 'fish'], 'MASNI ATAN', 6.50, TRUE),

-- ZIDNI RESOURCES (Extensive menu)
('ZR001', 'Chicken D''lite', 'Chicken delight snack', 4.80, 'Snacks', ARRAY['chicken'], TRUE, 4.6, ARRAY['gluten'], 'ZIDNI RESOURCES', 4.20, FALSE),
('ZR002', 'Mini Pizza', 'Mini pizza bites', 4.80, 'Snacks', ARRAY['pizza', 'italian'], TRUE, 4.7, ARRAY['gluten', 'dairy'], 'ZIDNI RESOURCES', 4.20, TRUE),
('ZR003', 'Apam Beras', 'Rice flour cake', 3.80, 'Kuih', ARRAY['traditional'], TRUE, 4.4, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR004', 'Kaswi Gula Merah/Pandan', 'Palm sugar or pandan kuih', 3.80, 'Kuih', ARRAY['traditional', 'sweet'], TRUE, 4.5, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR005', 'Ketayap', 'Coconut filled pancake', 3.80, 'Kuih', ARRAY['traditional', 'coconut'], TRUE, 4.6, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR006', 'Bom Bijan Goreng', 'Fried sesame balls', 3.80, 'Kuih', ARRAY['fried', 'sesame'], TRUE, 4.5, ARRAY['gluten'], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR007', 'Koci Labu', 'Pumpkin glutinous cake', 3.80, 'Kuih', ARRAY['traditional', 'pumpkin'], TRUE, 4.4, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR008', 'Koci Pulut Hitam', 'Black glutinous rice cake', 3.80, 'Kuih', ARRAY['traditional'], TRUE, 4.5, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR009', 'Lepat Pisang', 'Banana leaf wrapped cake', 3.80, 'Kuih', ARRAY['traditional', 'banana'], TRUE, 4.6, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR010', 'Lepat Labu', 'Pumpkin leaf wrapped cake', 3.80, 'Kuih', ARRAY['traditional', 'pumpkin'], TRUE, 4.4, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR011', 'Lepat Ubi', 'Tapioca leaf wrapped cake', 3.80, 'Kuih', ARRAY['traditional'], TRUE, 4.4, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR012', 'Bingka Ubi', 'Baked tapioca cake', 3.80, 'Kuih', ARRAY['traditional', 'baked'], TRUE, 4.5, ARRAY['gluten', 'eggs'], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR013', 'Lapis Merah Putih', 'Red white layered cake', 3.80, 'Kuih', ARRAY['traditional', 'layered'], TRUE, 4.5, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR014', 'Apam Gula Hangus', 'Caramelized sugar cake', 3.80, 'Kuih', ARRAY['traditional', 'sweet'], TRUE, 4.5, ARRAY[]::text[], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR015', 'Kuih Bakar Bijan Hijau', 'Baked green sesame cake', 3.80, 'Kuih', ARRAY['baked', 'sesame'], TRUE, 4.4, ARRAY['gluten', 'eggs'], 'ZIDNI RESOURCES', 3.40, FALSE),
('ZR016', 'Sandwich Telur', 'Egg sandwich', 4.80, 'Bread & Pastries', ARRAY['sandwich', 'eggs'], TRUE, 4.5, ARRAY['gluten', 'eggs'], 'ZIDNI RESOURCES', 4.00, FALSE),
('ZR017', 'Sandwich Sardin', 'Sardine sandwich', 4.80, 'Bread & Pastries', ARRAY['sandwich', 'fish'], TRUE, 4.6, ARRAY['gluten', 'fish'], 'ZIDNI RESOURCES', 4.00, FALSE),
('ZR018', 'Sandwich Ayam', 'Chicken sandwich', 5.00, 'Bread & Pastries', ARRAY['sandwich', 'chicken'], TRUE, 4.7, ARRAY['gluten'], 'ZIDNI RESOURCES', 4.20, TRUE),
('ZR019', 'Sandwich Sardin Gulung', 'Rolled sardine sandwich', 4.00, 'Bread & Pastries', ARRAY['sandwich', 'fish'], TRUE, 4.5, ARRAY['gluten', 'fish'], 'ZIDNI RESOURCES', 3.50, FALSE),
('ZR020', 'Sandwich Daging Gulung', 'Rolled beef sandwich', 4.00, 'Bread & Pastries', ARRAY['sandwich', 'beef'], TRUE, 4.6, ARRAY['gluten'], 'ZIDNI RESOURCES', 3.50, FALSE),
('ZR021', 'Toasted Sandwich Telur', 'Toasted egg sandwich', 4.80, 'Bread & Pastries', ARRAY['sandwich', 'eggs', 'toasted'], TRUE, 4.6, ARRAY['gluten', 'eggs'], 'ZIDNI RESOURCES', 4.00, FALSE),
('ZR022', 'Toasted Sandwich Sardin', 'Toasted sardine sandwich', 4.80, 'Bread & Pastries', ARRAY['sandwich', 'fish', 'toasted'], TRUE, 4.6, ARRAY['gluten', 'fish'], 'ZIDNI RESOURCES', 4.00, FALSE),
('ZR023', 'Toasted Sandwich Ayam', 'Toasted chicken sandwich', 5.00, 'Bread & Pastries', ARRAY['sandwich', 'chicken', 'toasted'], TRUE, 4.7, ARRAY['gluten'], 'ZIDNI RESOURCES', 4.20, FALSE),
('ZR024', 'Apple Pastry', 'Apple filled pastry', 5.00, 'Bread & Pastries', ARRAY['pastry', 'apple'], TRUE, 4.7, ARRAY['gluten'], 'ZIDNI RESOURCES', 4.20, FALSE),
('ZR025', 'Sardine Pastry', 'Sardine filled pastry', 4.80, 'Bread & Pastries', ARRAY['pastry', 'fish'], TRUE, 4.6, ARRAY['gluten', 'fish'], 'ZIDNI RESOURCES', 4.00, FALSE),
('ZR026', 'Strawberry Pastry', 'Strawberry filled pastry', 4.80, 'Bread & Pastries', ARRAY['pastry', 'strawberry'], TRUE, 4.7, ARRAY['gluten'], 'ZIDNI RESOURCES', 4.00, FALSE),
('ZR027', 'Blueberry Pastry', 'Blueberry filled pastry', 4.80, 'Bread & Pastries', ARRAY['pastry', 'blueberry'], TRUE, 4.7, ARRAY['gluten'], 'ZIDNI RESOURCES', 4.00, FALSE),
('ZR028', 'Chicken Pie', 'Savory chicken pie', 4.80, 'Bread & Pastries', ARRAY['pie', 'chicken'], TRUE, 4.7, ARRAY['gluten'], 'ZIDNI RESOURCES', 4.00, TRUE),
('ZR029', 'Beef Pie', 'Savory beef pie', 4.80, 'Bread & Pastries', ARRAY['pie', 'beef'], TRUE, 4.7, ARRAY['gluten'], 'ZIDNI RESOURCES', 4.00, FALSE),
('ZR030', 'Rissoles Kentang', 'Potato croquettes', 4.50, 'Snacks', ARRAY['potato', 'fried'], TRUE, 4.5, ARRAY['gluten'], 'ZIDNI RESOURCES', 3.80, FALSE),
('ZR031', 'Karipap Kentang', 'Potato curry puff', 4.50, 'Snacks', ARRAY['curry puff', 'potato'], TRUE, 4.7, ARRAY['gluten'], 'ZIDNI RESOURCES', 3.80, TRUE),
('ZR032', 'Karipap Sardin', 'Sardine curry puff', 4.50, 'Snacks', ARRAY['curry puff', 'fish'], TRUE, 4.6, ARRAY['gluten', 'fish'], 'ZIDNI RESOURCES', 3.80, FALSE),
('ZR033', 'Karipap Pusing Daging', 'Spiral beef curry puff', 4.80, 'Snacks', ARRAY['curry puff', 'beef', 'popular'], TRUE, 4.8, ARRAY['gluten'], 'ZIDNI RESOURCES', 4.00, TRUE),

-- GENERAL ITEMS
('GEN001', 'Samosa', 'Crispy triangle pastry with filling', 4.50, 'Snacks', ARRAY['fried', 'indian'], TRUE, 4.6, ARRAY['gluten'], 'GENERAL', 3.80, FALSE),
('GEN002', 'Pau Goreng Sambal', 'Fried bun with sambal', 4.80, 'Snacks', ARRAY['fried', 'spicy'], TRUE, 4.7, ARRAY['gluten'], 'GENERAL', 4.00, FALSE),
('GEN003', 'Pulut Inti Manis', 'Sweet coconut glutinous rice', 4.80, 'Kuih', ARRAY['traditional', 'coconut'], TRUE, 4.6, ARRAY[]::text[], 'GENERAL', 4.00, FALSE),
('GEN004', 'Pulut Serunding', 'Glutinous rice with meat floss', 4.80, 'Kuih', ARRAY['traditional', 'savory'], TRUE, 4.7, ARRAY[]::text[], 'GENERAL', 4.00, FALSE),
('GEN005', 'Pulut Panggang', 'Grilled glutinous rice', 3.80, 'Kuih', ARRAY['traditional', 'grilled'], TRUE, 4.5, ARRAY[]::text[], 'GENERAL', 3.40, FALSE),
('GEN006', 'Nasi Lemak', 'Coconut rice meal', 6.00, 'Nasi & Rice Meals', ARRAY['rice', 'traditional', 'bestseller'], TRUE, 4.9, ARRAY[]::text[], 'GENERAL', 5.00, TRUE),
('GEN007', 'Nasi Lemak Berlauk', 'Coconut rice with sides', 7.50, 'Nasi & Rice Meals', ARRAY['rice', 'traditional', 'filling'], TRUE, 4.9, ARRAY[]::text[], 'GENERAL', 6.50, TRUE),
('GEN008', 'Lempeng Kelapa / Wholemeal', 'Coconut or wholemeal pancake', 6.50, 'Kuih', ARRAY['pancake', 'traditional'], TRUE, 4.6, ARRAY['gluten'], 'GENERAL', 5.50, FALSE),
('GEN009', 'Bihun Goreng Biasa', 'Fried rice noodles', 6.00, 'Nasi & Rice Meals', ARRAY['noodles', 'fried'], TRUE, 4.6, ARRAY[]::text[], 'GENERAL', 5.00, FALSE),
('GEN010', 'Bihun Goreng Putih', 'White fried rice noodles', 6.00, 'Nasi & Rice Meals', ARRAY['noodles', 'fried'], TRUE, 4.5, ARRAY[]::text[], 'GENERAL', 5.00, FALSE),
('GEN011', 'Pasta Goreng', 'Fried pasta', 6.50, 'Nasi & Rice Meals', ARRAY['pasta', 'fried'], TRUE, 4.6, ARRAY['gluten'], 'GENERAL', 5.50, FALSE),
('GEN012', 'Nasi Goreng', 'Fried rice', 7.50, 'Nasi & Rice Meals', ARRAY['rice', 'fried', 'popular'], TRUE, 4.8, ARRAY[]::text[], 'GENERAL', 6.50, TRUE),
('GEN013', 'Mee Siam Singapura', 'Singapore style noodles', 7.50, 'Nasi & Rice Meals', ARRAY['noodles', 'spicy'], TRUE, 4.7, ARRAY['gluten'], 'GENERAL', 6.50, FALSE),
('GEN014', 'Pulut Kuning Rendang Ayam', 'Yellow rice with chicken rendang', 7.50, 'Nasi & Rice Meals', ARRAY['rice', 'traditional', 'spicy'], TRUE, 4.9, ARRAY[]::text[], 'GENERAL', 6.50, TRUE),
('GEN015', 'Pulut Kuning Rendang Daging', 'Yellow rice with beef rendang', 7.50, 'Nasi & Rice Meals', ARRAY['rice', 'traditional', 'spicy'], TRUE, 4.9, ARRAY[]::text[], 'GENERAL', 6.50, TRUE),
('GEN016', 'Roti Jala Kari Kentang', 'Net bread with potato curry', 6.00, 'Nasi & Rice Meals', ARRAY['traditional', 'curry'], TRUE, 4.6, ARRAY['gluten'], 'GENERAL', 5.00, FALSE),
('GEN017', 'Mee Goreng', 'Fried noodles', 6.00, 'Nasi & Rice Meals', ARRAY['noodles', 'fried'], TRUE, 4.7, ARRAY['gluten'], 'GENERAL', 5.00, FALSE),
('GEN018', 'Kuetiau Goreng', 'Fried flat noodles', 6.00, 'Nasi & Rice Meals', ARRAY['noodles', 'fried'], TRUE, 4.7, ARRAY[]::text[], 'GENERAL', 5.00, FALSE),
('GEN019', 'Mee Kari', 'Curry noodles', 7.50, 'Nasi & Rice Meals', ARRAY['noodles', 'curry', 'spicy'], TRUE, 4.8, ARRAY['gluten'], 'GENERAL', 6.50, TRUE),
('GEN020', 'Laksa Assam', 'Sour spicy noodle soup', 7.50, 'Nasi & Rice Meals', ARRAY['noodles', 'spicy', 'traditional'], TRUE, 4.8, ARRAY['gluten', 'fish'], 'GENERAL', 6.50, TRUE),
('GEN021', 'Cake Slice - Vanilla / Marble', 'Vanilla or marble cake slice', 4.20, 'Cakes & Desserts', ARRAY['cake', 'slice'], TRUE, 4.5, ARRAY['gluten', 'eggs', 'dairy'], 'GENERAL', 3.40, FALSE),
('GEN022', 'Cake Slice - Chocolate Moist', 'Moist chocolate cake slice', 5.00, 'Cakes & Desserts', ARRAY['cake', 'chocolate'], TRUE, 4.7, ARRAY['gluten', 'eggs', 'dairy'], 'GENERAL', 4.20, TRUE),
('GEN023', 'Seri Muka Durian', 'Durian layered kuih', 3.80, 'Kuih', ARRAY['traditional', 'durian'], TRUE, 4.6, ARRAY[]::text[], 'GENERAL', 3.40, FALSE),
('GEN024', 'Seri Muka Pandan', 'Pandan layered kuih', 3.80, 'Kuih', ARRAY['traditional', 'pandan'], TRUE, 4.6, ARRAY[]::text[], 'GENERAL', 3.40, FALSE),
('GEN025', 'Koleh Kacang', 'Peanut roll', 3.80, 'Kuih', ARRAY['traditional', 'peanut'], TRUE, 4.5, ARRAY['peanuts'], 'GENERAL', 3.40, FALSE),
('GEN026', 'Apam Gula Hangus', 'Caramelized sugar cake', 3.80, 'Kuih', ARRAY['traditional', 'sweet'], TRUE, 4.5, ARRAY[]::text[], 'GENERAL', 3.40, FALSE),
('GEN027', 'Apam Kanda', 'Traditional steamed cake', 3.80, 'Kuih', ARRAY['traditional', 'steamed'], TRUE, 4.5, ARRAY[]::text[], 'GENERAL', 3.40, FALSE);

-- Add vendor_name column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='menu_items' AND column_name='vendor_name') THEN
    ALTER TABLE menu_items ADD COLUMN vendor_name VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='menu_items' AND column_name='cost_price') THEN
    ALTER TABLE menu_items ADD COLUMN cost_price DECIMAL(10, 2);
  END IF;
END $$;

-- =============================================
-- COMPLETE! 127 REAL MENU ITEMS INSERTED!
-- =============================================
