import { createClient } from '@supabase/supabase-js'

// Pegando as variáveis do .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Criando o client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
