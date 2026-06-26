const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;


if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-service-role')) {
  console.warn('\n==================================================================');
  console.warn('⚠️  WARNING: Supabase URL atau Key belum dikonfigurasi dengan benar.');
  console.warn('Silakan edit berkas backend/.env untuk menyambungkan ke Supabase.');
  console.warn('==================================================================\n');
}

// Inisialisasi klien Supabase
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

module.exports = { supabase };
