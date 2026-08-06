import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Missing Supabase server environment variables.');
}

// ==============================================================================
// WARNING: Never import this file into client components.
// The secret key is server-only and bypasses RLS (Row Level Security).
// Using it in the browser will expose full database access to the public.
// ==============================================================================

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);
