// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iozmoqzvxthpcuwnaepa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvem1vcXp2eHRocGN1d25hZXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODIwNzMsImV4cCI6MjA2NDk1ODA3M30.DCtBm3Zkc3QjdDx2vEwRgYkZCsUc1xMk_87Rg04FEaI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);