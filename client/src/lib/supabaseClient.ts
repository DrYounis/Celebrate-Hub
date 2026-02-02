
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://onvzumdnchknkxyltzvv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'MISSING_KEY'

if (supabaseAnonKey === 'MISSING_KEY') {
    console.warn('⚠️ Supabase Anon Key is missing! Data fetching will fail.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
