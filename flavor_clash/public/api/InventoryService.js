// /public/api/InventoryService.js
import { supabase } from '../supabaseClient.js';

const InventoryService = {
  async listMine() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

export default InventoryService;
