-- ========================================================
-- Averon Realty Seed Data
-- 9 Indian States, 9 Major Cities, 18 Realistic Properties
-- Mix of Sale/Rent, Types, Sold/Rented statuses, amenities & images
-- ========================================================

-- States
insert into states (id, name) values
  (1, 'Karnataka'),
  (2, 'Maharashtra'),
  (3, 'Telangana'),
  (4, 'Tamil Nadu'),
  (5, 'Haryana'),
  (6, 'West Bengal'),
  (7, 'Gujarat'),
  (8, 'Rajasthan')
on conflict (id) do nothing;

-- Cities
insert into cities (id, name, state_id) values
  (1, 'Bengaluru', 1),
  (2, 'Mumbai', 2),
  (3, 'Pune', 2),
  (4, 'Hyderabad', 3),
  (5, 'Chennai', 4),
  (6, 'Gurugram', 5),
  (7, 'Kolkata', 6),
  (8, 'Ahmedabad', 7),
  (9, 'Jaipur', 8)
on conflict (id) do nothing;

-- Reset sequence if needed
alter sequence states_id_seq restart with 9;
alter sequence cities_id_seq restart with 10;

-- Properties
-- 1. Bengaluru - Indiranagar Villa (Sale, Available, Featured)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111101',
  'The Glasshouse Sanctuary Villa',
  'Exquisite ultra-luxury 4-bedroom villa with private heated lap pool, Italian marble flooring, double-height living room, and bespoke landscaped terrace garden in prime Indiranagar.',
  'villa', 'sale', 68000000, 'INR', 4, 5, 4800,
  '100 Feet Road, HAL 2nd Stage, Indiranagar', 1, 1, 12.9784, 77.6408,
  'available', true
);

-- 2. Bengaluru - Whitefield Apartment (Sale, Available)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111102',
  'Skyline Panorama Residences',
  'High-floor modern 3BHK corner apartment offering panoramic green views, automated home systems, premium modular kitchen, and world-class clubhouse amenities.',
  'apartment', 'sale', 22500000, 'INR', 3, 3, 2150,
  'ECC Road, Whitefield', 1, 1, 12.9698, 77.7499,
  'available', false
);

-- 3. Bengaluru - Koramangala Penthouse (Rent, Available, Featured)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111103',
  'The Meridian Sky Penthouse',
  'Sprawling fully-furnished designer penthouse with rooftop deck, private jacuzzi, expansive entertainment hall, and 360-degree city views in Koramangala 4th Block.',
  'apartment', 'rent', 165000, 'INR', 4, 4, 3600,
  '80 Feet Road, Koramangala 4th Block', 1, 1, 12.9352, 77.6245,
  'available', true
);

-- 4. Bengaluru - Sarjapur Road Apartment (Rent, RENTED - §8.1 Social Proof)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111104',
  'Lakeview Serenade 2BHK',
  'Sun-drenched lake-facing 2BHK residence with private balcony, EV charging bay, and smart electronic locks. Leased to corporate executive.',
  'apartment', 'rent', 48000, 'INR', 2, 2, 1320,
  'Near Bellandur Junction, Sarjapur Road', 1, 1, 12.9260, 77.6762,
  'rented', false
);

-- 5. Mumbai - Worli Sea Face (Sale, Available, Featured)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111105',
  'Aura Oceanfront Horizon Suite',
  'Rare frontline sea-view duplex apartment with expansive floor-to-ceiling glass facades overlooking the Arabian Sea and Bandra-Worli Sea Link.',
  'apartment', 'sale', 185000000, 'INR', 4, 5, 4200,
  'Worli Sea Face, Worli', 2, 2, 19.0178, 72.8178,
  'available', true
);

-- 6. Mumbai - Bandra West Boutique Flat (Rent, Available)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111106',
  'Pali Hill Parisian Loft',
  'Elegantly styled 2BHK boutique apartment featuring teakwood floors, custom brass accents, and serene treetop views in prestigious Bandra West.',
  'apartment', 'rent', 140000, 'INR', 2, 2, 1150,
  'Pali Hill, Bandra West', 2, 2, 19.0607, 72.8277,
  'available', false
);

-- 7. Mumbai - Powai High-Rise (Sale, SOLD - §8.1 Social Proof)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111107',
  'Hiranandani Regent Tower',
  'Neoclassical 3BHK residence overlooking Powai Lake. Successfully closed at record valuation by Averon Realty Advisory.',
  'apartment', 'sale', 42000000, 'INR', 3, 3, 1780,
  'Central Avenue, Hiranandani Gardens, Powai', 2, 2, 19.1197, 72.9051,
  'sold', false
);

-- 8. Pune - Koregaon Park Villa (Sale, Available, Featured)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111108',
  'The Banyan Tree Estate Villa',
  'Serene colonial-contemporary 5-bedroom private villa surrounded by mature canopy trees, private swimming pool, guest suite, and security quarter.',
  'villa', 'sale', 52500000, 'INR', 5, 6, 5400,
  'Lane 5, Koregaon Park', 3, 2, 18.5362, 73.8940,
  'available', true
);

-- 9. Pune - Baner Commercial Office (Rent, Available)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111109',
  'Apex Platinum Tech Suite',
  'Grade-A fully-furnished plug-and-play corporate office space with 60 workstations, 2 conference rooms, director cabins, and high-speed fiber backbone.',
  'office', 'rent', 280000, 'INR', 0, 4, 3850,
  'Baner-Balewadi High Street', 3, 2, 18.5590, 73.7785,
  'available', false
);

-- 10. Pune - Kharadi Premium 3BHK (Sale, SOLD - §8.1 Social Proof)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111110',
  'Eon Waterfront Residences',
  'River-facing luxury condominium near EON IT Park. Deal closed within 14 days of listing.',
  'apartment', 'sale', 19500000, 'INR', 3, 3, 1920,
  'Grant Road, Kharadi', 3, 2, 18.5514, 73.9534,
  'sold', false
);

-- 11. Hyderabad - Jubilee Hills Mansion (Sale, Available, Featured)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111111',
  'Hilltop Crown Manor',
  'Monumental 6-bedroom architectural marvel perched on Jubilee Hills rocky ridge with infinity pool overlooking KBR Park skyline.',
  'villa', 'sale', 125000000, 'INR', 6, 7, 7800,
  'Road No. 36, Jubilee Hills', 4, 3, 17.4319, 78.4073,
  'available', true
);

-- 12. Hyderabad - Gachibowli High-Rise (Rent, Available)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111112',
  'Financial District Skyview',
  'Sleek 3BHK residence walking distance to major tech campuses. Equipped with German appliances and clubhouse access.',
  'apartment', 'rent', 75000, 'INR', 3, 3, 2200,
  'Nanakramguda, Financial District', 4, 3, 17.4156, 78.3489,
  'available', false
);

-- 13. Chennai - ECR Beachside Villa (Sale, Available)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111113',
  'Azure Coastline Coastal Haven',
  'Private gated beach villa on East Coast Road with direct beach access, private coconut grove lawn, and open-air gazebo.',
  'villa', 'sale', 49000000, 'INR', 4, 4, 4100,
  'East Coast Road (ECR), Injambakkam', 5, 4, 12.9234, 80.2520,
  'available', false
);

-- 14. Gurugram - Golf Course Road (Sale, Available, Featured)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111114',
  'The Magnolia Verandas Penthouse',
  'Magnificent golf course facing residence featuring 14-ft ceilings, bespoke walk-in wardrobes, VRV air-conditioning, and 4 dedicated parking slots.',
  'apartment', 'sale', 110000000, 'INR', 4, 5, 5200,
  'Sector 42, Golf Course Road', 6, 5, 28.4619, 77.0984,
  'available', true
);

-- 15. Gurugram - Cyber City Commercial (Rent, Under Negotiation)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111115',
  'One Horizon Corporate Floor',
  'Prestigious commercial office floor with LEED Platinum certification, state-of-the-art security, and high-speed elevators.',
  'office', 'rent', 650000, 'INR', 0, 6, 6200,
  'DLF Phase 5, Golf Course Road', 6, 5, 28.4744, 77.0934,
  'under_negotiation', false
);

-- 16. Kolkata - Alipore Heritage Bungalow (Sale, Available)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111116',
  'Royal Alipore Courtyard Bungalow',
  'Stately colonial residential estate with expansive manicured lawns, classical portico, and modern interior renovations in Kolkata''s most elite zip code.',
  'villa', 'sale', 85000000, 'INR', 5, 5, 6500,
  'Burdwan Road, Alipore', 7, 6, 22.5284, 88.3289,
  'available', false
);

-- 17. Ahmedabad - SG Highway Plot (Sale, Available)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111117',
  'Grand Orchid Residential Plot',
  'Clear-title corner NA villa plot inside prestigious gated community with club membership, water & electricity connections ready for immediate construction.',
  'plot', 'sale', 31000000, 'INR', 0, 0, 7200,
  'Near Vaishnodevi Circle, SG Highway', 8, 7, 23.1255, 72.5401,
  'available', false
);

-- 18. Jaipur - C-Scheme Royal Penthouse (Rent, Available)
insert into properties (
  id, title, description, property_type, listing_type, price, price_unit,
  bedrooms, bathrooms, area_sqft, address, city_id, state_id, latitude, longitude,
  status, featured
) values (
  '11111111-1111-1111-1111-111111111118',
  'Jaipur Heritage Heights Penthouse',
  'Traditional Rajasthani jharokha styling paired with contemporary European luxury, rooftop terrace garden, and views of central Jaipur.',
  'apartment', 'rent', 65000, 'INR', 3, 3, 2400,
  'Subhash Marg, C-Scheme', 9, 8, 26.9124, 75.8033,
  'available', false
);

-- Property Images
-- High resolution curated architectural and interior photos
insert into property_images (property_id, image_url, is_primary, sort_order) values
-- Indiranagar Villa
('11111111-1111-1111-1111-111111111101', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111101', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', false, 2),
('11111111-1111-1111-1111-111111111101', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', false, 3),
('11111111-1111-1111-1111-111111111101', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', false, 4),

-- Whitefield Apartment
('11111111-1111-1111-1111-111111111102', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111102', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', false, 2),
('11111111-1111-1111-1111-111111111102', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', false, 3),

-- Koramangala Penthouse
('11111111-1111-1111-1111-111111111103', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111103', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', false, 2),
('11111111-1111-1111-1111-111111111103', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', false, 3),

-- Sarjapur Road Apartment (Rented)
('11111111-1111-1111-1111-111111111104', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111104', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', false, 2),

-- Worli Sea Face
('11111111-1111-1111-1111-111111111105', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111105', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', false, 2),
('11111111-1111-1111-1111-111111111105', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', false, 3),

-- Bandra West
('11111111-1111-1111-1111-111111111106', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111106', 'https://images.unsplash.com/photo-1502005229762-ee1b403487c8?auto=format&fit=crop&w=1200&q=80', false, 2),

-- Powai (Sold)
('11111111-1111-1111-1111-111111111107', 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111107', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80', false, 2),

-- Koregaon Park Villa
('11111111-1111-1111-1111-111111111108', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111108', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80', false, 2),

-- Baner Commercial Office
('11111111-1111-1111-1111-111111111109', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111109', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', false, 2),

-- Kharadi (Sold)
('11111111-1111-1111-1111-111111111110', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80', true, 1),

-- Jubilee Hills Mansion
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80', true, 1),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1200&q=80', false, 2),

-- Gachibowli
('11111111-1111-1111-1111-111111111112', 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80', true, 1),

-- ECR Beachside Villa
('11111111-1111-1111-1111-111111111113', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80', true, 1),

-- Golf Course Road Gurugram
('11111111-1111-1111-1111-111111111114', 'https://images.unsplash.com/photo-1502005229762-ee1b403487c8?auto=format&fit=crop&w=1600&q=80', true, 1),

-- Cyber City Gurugram
('11111111-1111-1111-1111-111111111115', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80', true, 1),

-- Alipore Kolkata
('11111111-1111-1111-1111-111111111116', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80', true, 1),

-- SG Highway Ahmedabad
('11111111-1111-1111-1111-111111111117', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80', true, 1),

-- Jaipur Penthouse
('11111111-1111-1111-1111-111111111118', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80', true, 1);

-- Property Amenities
insert into property_amenities (property_id, amenity) values
-- Indiranagar
('11111111-1111-1111-1111-111111111101', 'Private Heated Pool'),
('11111111-1111-1111-1111-111111111101', 'Smart Home Automation'),
('11111111-1111-1111-1111-111111111101', 'Landscaped Garden'),
('11111111-1111-1111-1111-111111111101', 'Private Elevator'),
('11111111-1111-1111-1111-111111111101', '3-Car Covered Parking'),

-- Whitefield
('11111111-1111-1111-1111-111111111102', 'Clubhouse & Gym'),
('11111111-1111-1111-1111-111111111102', 'Infinity Swimming Pool'),
('11111111-1111-1111-1111-111111111102', 'Tennis Court'),
('11111111-1111-1111-1111-111111111102', '24/7 Security & CCTV'),

-- Koramangala
('11111111-1111-1111-1111-111111111103', 'Rooftop Jacuzzi Deck'),
('11111111-1111-1111-1111-111111111103', 'Fully Furnished Interior'),
('11111111-1111-1111-1111-111111111103', 'Private Terrace Lounge'),
('11111111-1111-1111-1111-111111111103', '100% Power Backup'),

-- Worli Sea Face
('11111111-1111-1111-1111-111111111105', 'Unobstructed Sea View'),
('11111111-1111-1111-1111-111111111105', 'Private Concierge'),
('11111111-1111-1111-1111-111111111105', 'Infinity Sky Pool'),
('11111111-1111-1111-1111-111111111105', 'High-Speed Elevators'),

-- Koregaon Park
('11111111-1111-1111-1111-111111111108', 'Lush Private Orchard'),
('11111111-1111-1111-1111-111111111108', 'Swimming Pool'),
('11111111-1111-1111-1111-111111111108', 'Servant Quarters'),
('11111111-1111-1111-1111-111111111108', 'Gated Perimeter Security'),

-- Baner Commercial Office
('11111111-1111-1111-1111-111111111109', '60 Workstations Ready'),
('11111111-1111-1111-1111-111111111109', '2 Boardrooms with AV'),
('11111111-1111-1111-1111-111111111109', 'Dedicated Cafeteria'),
('11111111-1111-1111-1111-111111111109', 'Multi-Level Car Parking'),

-- Jubilee Hills
('11111111-1111-1111-1111-111111111111', 'Infinity Edge Cliff Pool'),
('11111111-1111-1111-1111-111111111111', 'Home Cinema Theatre'),
('11111111-1111-1111-1111-111111111111', 'Wine Cellar & Bar'),
('11111111-1111-1111-1111-111111111111', 'Staff Accommodations'),

-- Golf Course Road
('11111111-1111-1111-1111-111111111114', 'Direct Golf Course Views'),
('11111111-1111-1111-1111-111111111114', 'Private Lap Pool'),
('11111111-1111-1111-1111-111111111114', 'Double Height Living Room'),
('11111111-1111-1111-1111-111111111114', '4 Covered Parking Bays');
