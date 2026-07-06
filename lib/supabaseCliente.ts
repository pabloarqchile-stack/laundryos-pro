import { createClient } from "@supabase/supabase-js";

const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
const llaveAnonimaSupabase = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  urlSupabase && llaveAnonimaSupabase
    ? createClient(urlSupabase, llaveAnonimaSupabase)
    : null;
