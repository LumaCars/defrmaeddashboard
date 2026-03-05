import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function deleteAllOrders() {
  console.log('Deleting all card orders...')
  
  const { error } = await supabase
    .from('card_orders')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows
  
  if (error) {
    console.error('Error deleting orders:', error.message)
    process.exit(1)
  }
  
  console.log('All card orders deleted successfully!')
}

deleteAllOrders()
