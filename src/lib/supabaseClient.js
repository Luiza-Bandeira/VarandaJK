
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjfefeoxqejiwzxfldbw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZmVmZW94cWVqaXd6eGZsZGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTE5MTksImV4cCI6MjA2MjM2NzkxOX0.Mbk6wbhukI5KEa0b8xUytGANaROYJ4nipXVuCGaAjeA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
