import { createClient } from '@supabase/supabase-js';

// Use placeholder values during build if env vars are not yet set
// The real values must be added in Vercel Environment Variables settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Prevent browser crash if the user accidentally configured NEXT_PUBLIC_SUPABASE_ANON_KEY with a secret key
const isSecretKey = supabaseAnonKey.startsWith('sb_secret_') || supabaseAnonKey.includes('service_role');

let supabaseClient;
try {
  if (isSecretKey && typeof window !== 'undefined') {
    console.warn(
      'Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is configured with a secret key in the browser! ' +
      'Please use the Publishable/Anon API key instead.'
    );
    // Create a dummy client to prevent client-side crash
    supabaseClient = new Proxy({}, {
      get(target, prop) {
        return () => {
          console.error("Supabase client is not available due to secret key configuration in browser.");
          return Promise.resolve({ data: null, error: new Error("Supabase client unavailable: secret key configured in browser") });
        };
      }
    }) as any;
  } else {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.error('Failed to initialize Supabase client:', e);
  supabaseClient = {} as any;
}

export const supabase = supabaseClient;

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
