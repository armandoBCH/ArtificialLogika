import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(request: Request) {
  const method = request.method;
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (!type) {
    return new Response(JSON.stringify({ error: 'Content type is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    switch (method) {
      case 'GET':
        // Obtener contenido por tipo
        const { data: getTypeData, error: getTypeError } = await supabase
          .from('content')
          .select('*')
          .eq('content_type', type)
          .order('created_at', { ascending: false });
        
        if (getTypeError) throw getTypeError;
        return new Response(JSON.stringify(getTypeData || []), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'POST':
        // Crear o actualizar contenido de un tipo específico
        const body = await request.json();
        const { content_data, id } = body;
        const contentId = id || `${type}-${Date.now()}`;
        
        // Usar upsert para crear o actualizar
        const { data: upsertData, error: upsertError } = await supabase
          .from('content')
          .upsert({
            id: contentId,
            content_type: type,
            content_data,
            user_id: null,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (upsertError) throw upsertError;
        return new Response(JSON.stringify(upsertData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(`Method ${method} Not Allowed`, {
          status: 405,
          headers: { 
            'Allow': 'GET, POST',
            'Content-Type': 'text/plain'
          }
        });
    }
  } catch (error: any) {
    console.error('Content by Type API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database operation failed',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}