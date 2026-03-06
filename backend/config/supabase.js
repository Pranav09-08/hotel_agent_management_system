import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Environment configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // better for backend
    detectSessionInUrl: false
  }
});

console.log("✓ Supabase client initialized");
console.log(`  URL: ${supabaseUrl.substring(0, 50)}...`);

export default supabase;