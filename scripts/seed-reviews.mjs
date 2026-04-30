import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env.local
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use anon key — reviews table allows anon insert (user_id = null)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const names = [
  'Ali Hassan, Karachi', 'Usman Malik, Lahore', 'Bilal Ahmed, Islamabad',
  'Hamza Khan, Rawalpindi', 'Fatima Zahra, Faisalabad', 'Ayesha Noor, Multan',
  'Sana Malik, Peshawar', 'Zain ul Abideen, Quetta', 'Faisal Raza, Sialkot',
  'Asad Mehmood, Gujranwala', 'Tariq Mahmood, Hyderabad', 'Imran Butt, Bahawalpur',
  'Shahid Iqbal, Sargodha', 'Kamran Siddiqui, Karachi', 'Adnan Qureshi, Lahore',
  'Waqas Javed, Islamabad', 'Omer Farooq, Karachi', 'Saad Nawaz, Lahore',
  'Muhammad Rizwan, Faisalabad', 'Abdul Rehman, Multan', 'Junaid Akram, Karachi',
  'Naeem Akhtar, Lahore', 'Raza Ali, Islamabad', 'Waseem Akram, Rawalpindi',
  'Salman Chaudhry, Faisalabad', 'Irfan Haider, Multan', 'Mehwish Hayat, Karachi',
  'Iqra Aziz, Lahore', 'Sajal Ali, Islamabad', 'Yumna Zaidi, Karachi',
  'Hira Baig, Lahore', 'Zara Ahmed, Islamabad', 'Maham Tariq, Rawalpindi',
  'Nadia Hussain, Faisalabad', 'Rabia Khalid, Multan', 'Amna Sheikh, Peshawar',
  'Sadia Awan, Quetta', 'Babar Azam, Lahore', 'Shoaib Akhtar, Rawalpindi',
  'Mawra Hocane, Karachi',
];

const reviews = [
  { rating: 5, title: 'Zabardast product hai!', body: 'Yaar bilkul sahi cheez hai. COD pe mangwaya tha, delivery 3 din mein aa gayi. Quality ekdum first class. Sultania Gadgets se dobara zaroor mangwaunga.' },
  { rating: 5, title: 'Ekdum mast hai bhai', body: 'Pehle thoda doubt tha online order karne mein, lekin yaar delivery time pe aayi aur product bhi genuine nikla. Packaging bhi achi thi. 5 star deta hoon.' },
  { rating: 4, title: 'Acha product, delivery thodi late', body: 'Product quality se khush hoon, bas delivery mein ek din extra laga. Warna sab theek tha. Price bhi reasonable hai market se compare karein toh.' },
  { rating: 5, title: '100% genuine maal', body: 'Bhai tested product hai, koi fake nahi. Maine pehle bhi yahan se liya tha aur is baar bhi same quality mili. Highly recommend karta hoon sab ko.' },
  { rating: 5, title: 'Mast experience raha', body: 'COD option tha toh risk nahi tha. Product receive kiya, check kiya, bilkul sahi tha. Bhai Sultania Gadgets trust worthy hai. Apne doston ko bhi bataunga.' },
  { rating: 4, title: 'Value for money', body: 'Is price mein itna acha product milna mushkil hai. Quality dekh ke khush ho gaya. Ek star isliye kam diya ke packaging thodi simple thi, warna product perfect hai.' },
  { rating: 5, title: 'Superb quality!', body: 'Yaar sach mein bahut acha product hai. Pehle Amazon se mangwata tha lekin ab local se hi mangwaunga. Delivery fast thi aur product genuine. Shukria Sultania Gadgets!' },
  { rating: 3, title: 'Theek hai', body: 'Product average hai, na zyada acha na bura. Kaam chal raha hai. Price ke hisaab se theek hai. Delivery time pe aayi thi.' },
  { rating: 5, title: 'Bhai kya cheez hai!', body: 'Seriously yaar, is se pehle itna acha product nahi mila tha. Build quality solid hai. COD pe liya tha, koi tension nahi thi. Definitely recommend!' },
  { rating: 4, title: 'Acha hai, recommend karunga', body: 'Overall experience acha raha. Product quality theek hai, delivery bhi 2-3 din mein aa gayi. Sultania Gadgets ka customer service bhi responsive hai WhatsApp pe.' },
  { rating: 5, title: 'Ekdum original maal', body: 'Maine pehle local market se liya tha jo 2 hafte mein kharab ho gaya. Yahan se liya toh 3 mahine ho gaye, abhi tak perfect chal raha hai. Genuine product hai.' },
  { rating: 5, title: 'Fast delivery, great quality', body: 'Order kiya aur 2 din mein Lahore mein deliver ho gaya. Product bilkul waise hi tha jaise website pe dikhaya tha. Packaging bhi achi thi. 5/5!' },
  { rating: 4, title: 'Pasand aaya', body: 'Pehli baar is site se liya. Thoda hesitation tha lekin COD option ne confident kiya. Product acha nikla. Agli baar bhi yahan se hi lunga.' },
  { rating: 5, title: 'Mujhe bahut pasand aaya', body: 'Ghar mein sab ne tarif ki. Quality ekdum top notch hai. Price bhi market se kam hai. Bhai Sultania Gadgets ne dil jeet liya. Zaroor try karein.' },
  { rating: 5, title: 'Trusted seller hai', body: 'Maine apne 3 doston ko bhi recommend kiya hai. Sab ne order kiya aur sab khush hain. Genuine products, fast delivery, aur COD. Kya chahiye aur?' },
  { rating: 5, title: 'Bilkul sahi product', body: 'Bhai pehle local market mein gaya tha, wahan se 2 guna zyada price tha. Yahan se liya toh sasta bhi aur genuine bhi. Bahut khush hoon.' },
  { rating: 4, title: 'Acha experience', body: 'Delivery 3 din mein aayi Karachi mein. Product check kiya, sab theek tha. COD tha toh koi risk nahi tha. Overall satisfied hoon.' },
  { rating: 5, title: 'Recommend karta hoon', body: 'Yaar mere bhai ne pehle liya tha, phir maine bhi liya. Dono baar quality same thi. Consistent seller hai. Zaroor try karein.' },
  { rating: 5, title: 'Kharidne ke baad khushi hui', body: 'Sach mein bahut acha product hai. Pehle soch raha tha ke online se lena chahiye ya nahi, lekin COD option dekh ke order kar diya. Bilkul sahi decision tha.' },
  { rating: 4, title: 'Theek hai, dobara lunga', body: 'Product quality se satisfied hoon. Delivery thodi slow thi lekin product genuine tha. Agli baar bhi yahan se hi lunga.' },
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const dayOptions = [2, 4, 7, 10, 14, 18, 22, 28, 35, 45, 55, 60];

async function main() {
  // Get all active products
  const { data: products, error: pErr } = await supabase
    .from('products')
    .select('id, title')
    .eq('is_active', true);

  if (pErr) { console.error('Error fetching products:', pErr); process.exit(1); }
  console.log(`Found ${products.length} products`);

  let totalInserted = 0;

  for (const product of products) {
    // Check existing reviews
    const { count } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('product_id', product.id);

    if (count >= 4) {
      console.log(`  Skipping ${product.title} (already has ${count} reviews)`);
      continue;
    }

    const needed = 4 - (count || 0);
    const toInsert = [];
    const usedNames = new Set();

    for (let i = 0; i < needed; i++) {
      let name;
      do { name = rand(names); } while (usedNames.has(name));
      usedNames.add(name);

      const review = rand(reviews);
      toInsert.push({
        product_id: product.id,
        user_id: null,
        author_name: name,
        rating: review.rating,
        title: review.title,
        body: review.body,
        is_verified: true,
        is_approved: true,
        created_at: daysAgo(rand(dayOptions)),
      });
    }

    const { error: iErr } = await supabase.from('reviews').insert(toInsert);
    if (iErr) {
      console.error(`  Error inserting for ${product.title}:`, iErr.message);
    } else {
      console.log(`  ✓ ${product.title} — inserted ${toInsert.length} reviews`);
      totalInserted += toInsert.length;
    }
  }

  console.log(`\nDone! Total reviews inserted: ${totalInserted}`);
}

main().catch(console.error);
