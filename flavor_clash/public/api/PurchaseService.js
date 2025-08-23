// /public/api/PurchaseService.js
import { supabase } from '../supabaseClient.js';

const PurchaseService = {
  async buyCard(cardId, cost = 5, qty = 1) {
    const { data, error } = await supabase.rpc('purchase_item', {
      p_item_id: cardId,
      p_item_type: 'card',
      p_cost: cost,
      p_qty: qty,
    });
    if (error) throw error;
    return data?.[0] || null; // { purchase_id, inventory_id, remaining_points }
  },
};

export default PurchaseService;
