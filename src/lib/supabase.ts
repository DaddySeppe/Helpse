import { createClient } from "@supabase/supabase-js";

const fallbackSupabaseUrl = "https://wjwgovjmksglakopjbie.supabase.co";
const fallbackSupabasePublishableKey =
  "sb_publishable_K-uxyYphqtjZ1iniOVCtvg_jBlvflXj";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? fallbackSupabaseUrl;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  fallbackSupabasePublishableKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

// Client-side Supabase client. Zonder env-vars blijft de build werken.
export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
  : null;
