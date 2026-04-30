-- ============================================================
-- Pakistani Customer Reviews — Seed Data
-- Run in Supabase SQL Editor
-- ============================================================
-- This inserts 3-5 realistic Pakistani reviews per product
-- with is_approved = true and is_verified = true
-- ============================================================

DO $$
DECLARE
  p RECORD;
  review_data JSONB;
  r JSONB;
  review_dates TIMESTAMPTZ[] := ARRAY[
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '21 days',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '60 days'
  ];
  idx INT;

  -- Pakistani names pool
  names TEXT[] := ARRAY[
    'Ali Hassan','Usman Malik','Bilal Ahmed','Hamza Khan','Zain ul Abideen',
    'Faisal Raza','Asad Mehmood','Tariq Mahmood','Imran Butt','Shahid Iqbal',
    'Kamran Siddiqui','Adnan Qureshi','Waqas Javed','Omer Farooq','Saad Nawaz',
    'Fatima Zahra','Ayesha Noor','Sana Malik','Hira Baig','Zara Ahmed',
    'Maham Tariq','Nadia Hussain','Rabia Khalid','Amna Sheikh','Sadia Awan',
    'Muhammad Rizwan','Abdul Rehman','Junaid Akram','Naeem Akhtar','Raza Ali',
    'Waseem Akram','Salman Chaudhry','Irfan Haider','Babar Azam','Shoaib Akhtar',
    'Mehwish Hayat','Iqra Aziz','Sajal Ali','Yumna Zaidi','Mawra Hocane'
  ];

  -- Pakistani cities pool
  cities TEXT[] := ARRAY[
    'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad',
    'Multan','Peshawar','Quetta','Sialkot','Gujranwala',
    'Hyderabad','Bahawalpur','Sargodha','Sukkur','Larkana',
    'Abbottabad','Mardan','Kasur','Rahim Yar Khan','Sheikhupura'
  ];

  -- Generic positive review templates (title + body pairs)
  generic_reviews JSONB[] := ARRAY[
    '{"rating":5,"title":"Zabardast product hai!","body":"Yaar bilkul sahi cheez hai. COD pe mangwaya tha, delivery 3 din mein aa gayi. Quality ekdum first class. Sultania Gadgets se dobara zaroor mangwaunga."}'::JSONB,
    '{"rating":5,"title":"Bhai ekdum mast hai","body":"Pehle thoda doubt tha online order karne mein, lekin yaar delivery time pe aayi aur product bhi genuine nikla. Packaging bhi achi thi. 5 star deta hoon."}'::JSONB,
    '{"rating":4,"title":"Acha product, delivery thodi late","body":"Product quality se khush hoon, bas delivery mein ek din extra laga. Warna sab theek tha. Price bhi reasonable hai market se compare karein toh."}'::JSONB,
    '{"rating":5,"title":"100% genuine maal","body":"Bhai tested product hai, koi fake nahi. Maine pehle bhi yahan se liya tha aur is baar bhi same quality mili. Highly recommend karta hoon sab ko."}'::JSONB,
    '{"rating":5,"title":"Mast experience raha","body":"COD option tha toh risk nahi tha. Product receive kiya, check kiya, bilkul sahi tha. Bhai Sultania Gadgets trust worthy hai. Apne doston ko bhi bataunga."}'::JSONB,
    '{"rating":4,"title":"Value for money","body":"Is price mein itna acha product milna mushkil hai. Quality dekh ke khush ho gaya. Ek star isliye kam diya ke packaging thodi simple thi, warna product perfect hai."}'::JSONB,
    '{"rating":5,"title":"Superb quality!","body":"Yaar sach mein bahut acha product hai. Pehle Amazon se mangwata tha lekin ab local se hi mangwaunga. Delivery fast thi aur product genuine. Shukria Sultania Gadgets!"}'::JSONB,
    '{"rating":3,"title":"Theek hai","body":"Product average hai, na zyada acha na bura. Kaam chal raha hai. Price ke hisaab se theek hai. Delivery time pe aayi thi."}'::JSONB,
    '{"rating":5,"title":"Bhai kya cheez hai!","body":"Seriously yaar, is se pehle itna acha product nahi mila tha. Build quality solid hai. COD pe liya tha, koi tension nahi thi. Definitely recommend!"}'::JSONB,
    '{"rating":4,"title":"Acha hai, recommend karunga","body":"Overall experience acha raha. Product quality theek hai, delivery bhi 2-3 din mein aa gayi. Sultania Gadgets ka customer service bhi responsive hai WhatsApp pe."}'::JSONB,
    '{"rating":5,"title":"Ekdum original maal","body":"Maine pehle local market se liya tha jo 2 hafte mein kharab ho gaya. Yahan se liya toh 3 mahine ho gaye, abhi tak perfect chal raha hai. Genuine product hai."}'::JSONB,
    '{"rating":5,"title":"Fast delivery, great quality","body":"Order kiya aur 2 din mein Lahore mein deliver ho gaya. Product bilkul waise hi tha jaise website pe dikhaya tha. Packaging bhi achi thi. 5/5!"}'::JSONB,
    '{"rating":4,"title":"Pasand aaya","body":"Pehli baar is site se liya. Thoda hesitation tha lekin COD option ne confident kiya. Product acha nikla. Agli baar bhi yahan se hi lunga."}'::JSONB,
    '{"rating":5,"title":"Mujhe bahut pasand aaya","body":"Ghar mein sab ne tarif ki. Quality ekdum top notch hai. Price bhi market se kam hai. Bhai Sultania Gadgets ne dil jeet liya. Zaroor try karein."}'::JSONB,
    '{"rating":5,"title":"Trusted seller hai","body":"Maine apne 3 doston ko bhi recommend kiya hai. Sab ne order kiya aur sab khush hain. Genuine products, fast delivery, aur COD. Kya chahiye aur?"}'::JSONB
  ];

BEGIN
  -- Loop through all active products
  FOR p IN SELECT id, title FROM products WHERE is_active = true LOOP

    -- Insert 4-5 reviews per product
    FOR idx IN 1..5 LOOP
      -- Pick a random review template
      r := generic_reviews[1 + floor(random() * array_length(generic_reviews, 1))::int];

      -- Skip if already has enough reviews (avoid duplicates on re-run)
      IF (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) >= 5 THEN
        EXIT;
      END IF;

      INSERT INTO reviews (
        product_id,
        user_id,
        author_name,
        rating,
        title,
        body,
        is_verified,
        is_approved,
        created_at
      ) VALUES (
        p.id,
        NULL,
        names[1 + floor(random() * array_length(names, 1))::int] || ', ' || cities[1 + floor(random() * array_length(cities, 1))::int],
        (r->>'rating')::smallint,
        r->>'title',
        r->>'body',
        true,
        true,
        review_dates[1 + floor(random() * array_length(review_dates, 1))::int]
      );
    END LOOP;

  END LOOP;

  RAISE NOTICE 'Reviews seeded successfully!';
END $$;
