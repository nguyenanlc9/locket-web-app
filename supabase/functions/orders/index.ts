import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customer, items, total, paymentMethod } = await req.json()

    const orderId = 'ORD' + Date.now()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { data, error } = await supabaseClient
      .from('orders')
      .insert({
        order_id: orderId,
        customer_name: customer.fullName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        items: items,
        total: total,
        payment_method: paymentMethod,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Lỗi tạo đơn hàng: ' + error.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderId,
        message: 'Đơn hàng đã được tạo thành công'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
