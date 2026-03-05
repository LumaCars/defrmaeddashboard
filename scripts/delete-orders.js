import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllOrders() {
  console.log('Deleting all orders from card_orders table...');
  
  const { error } = await supabase
    .from('card_orders')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (error) {
    console.error('Error deleting orders:', error.message);
  } else {
    console.log('All orders deleted successfully!');
  }
}

deleteAllOrders();
