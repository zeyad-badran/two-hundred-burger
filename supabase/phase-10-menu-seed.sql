-- ==============================================================================
-- PHASE 10: SEED MENU DATA
-- ==============================================================================

INSERT INTO public.menu_items (
    sort_order, slug, category, price, is_featured, tags, image_path,
    name_en, description_en,
    name_ar, description_ar
) VALUES
(
    10, 'classic-burger', 'burgers', 4.50, false, '{"Popular"}', '/images/classic-burger.jpg',
    'Classic Smash Burger', '100% Angus beef patty smashed to perfection, melted cheddar, crisp lettuce, fresh tomato, and our signature house sauce on a toasted brioche bun.',
    'برغر كلاسيك سماش', 'قرص لحم أنجوس 100% مسحوق بإتقان، جبنة شيدر ذائبة، خس مقرمش، طماطم طازجة، وصوصنا الخاص في خبز بريوش محمص.'
),
(
    20, 'double-smash', 'burgers', 6.00, true, '{"Best Seller"}', '/images/double-smash.jpg',
    'Double Smash Burger', 'Two smashed premium beef patties, double melted cheddar, caramelized onions, and our secret smash sauce for the ultimate bold flavor.',
    'دبل سماش برغر', 'قرصين من اللحم الممتاز، شيدر مضاعف، بصل مكرمل، وصوص السماش السري لنكهة قوية لا تُقاوم.'
),
(
    30, 'crispy-chicken', 'burgers', 5.00, false, '{"Crispy"}', '/images/crispy-chicken.jpg',
    'Crispy Chicken Burger', 'Golden buttermilk-fried chicken thigh, zesty pickles, and spicy mayo served in a soft, buttery toasted bun.',
    'برغر دجاج مقرمش', 'فخذ دجاج مقرمش متبل بالحليب الرائب، مخلل، ومايونيز حار يقدم في خبز طري محمص بالزبدة.'
),
(
    40, 'loaded-fries', 'sides', 3.25, false, '{}', '/images/loaded-fries.jpg',
    'Loaded Fries', 'Crispy hand-cut fries smothered in melted cheddar cheese, signature smash sauce, and savory beef bits.',
    'بطاطا محمّلة', 'بطاطا مقرمشة مغطاة بصوص السماش، جبنة شيدر ذائبة، وقطع اللحم اللذيذة.'
),
(
    50, 'chicken-wings', 'sides', 4.00, false, '{}', '/images/wings.jpg',
    'Chicken Wings', '6-piece tender chicken wings tossed in your choice of our house glaze, served with a creamy dipping sauce.',
    'أجنحة دجاج', '6 قطع من أجنحة الدجاج الطرية بصوص المطعم الخاص، تقدم مع صوص للتغميس.'
),
(
    60, 'soft-drinks', 'drinks', 1.00, false, '{}', '/images/soft-drinks.jpg',
    'Soft Drinks', 'Pepsi, 7Up, Mirinda — ice cold, 330ml can.',
    'مشروبات غازية', 'بيبسي، سفن أب، ميرندا — باردة جداً، عبوة 330 مل.'
)
ON CONFLICT (slug) DO NOTHING;
