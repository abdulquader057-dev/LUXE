import { createClient } from '@supabase/supabase-js';

// Use placeholder values during build if env vars are not yet set
// The real values must be added in Vercel Environment Variables settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey && typeof window === 'undefined') {
  console.error(
    '\x1b[31m[FATAL] SUPABASE_SERVICE_ROLE_KEY is not configured. ' +
    'All admin database operations will fail. ' +
    'Set this environment variable in Vercel before deploying.\x1b[0m'
  );
}

// Initialize admin client with service role key to bypass RLS in backend operations (like webhooks)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || 'MISSING_SERVICE_ROLE_KEY', {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
