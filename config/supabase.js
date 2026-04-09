import { createClient } from '@supabase/supabase-client';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERROR: URL atau KEY Supabase tidak ditemukan di environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
