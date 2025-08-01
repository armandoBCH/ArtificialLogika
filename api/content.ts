import { createClient } from '@supabase/supabase-js';

// Verificar configuración de variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export default async function handler(request: Request) {
  const method = request.method;

  // Verificar configuración antes de proceder
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(JSON.stringify({
      error: 'Supabase configuration missing',
      details: 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in Vercel',
      configured: {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    switch (method) {
      case 'GET': {
        // Obtener todo el contenido
        const { data: getAllData, error: getAllError } = await supabase
          .from('content')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (getAllError) {
          console.error('Supabase GET error:', getAllError);
          throw getAllError;
        }
        return new Response(JSON.stringify(getAllData || []), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      case 'POST': {
        // Crear nuevo contenido
        const body = await request.json();
        const { content_type, content_data, id } = body;
        
        const { data: createData, error: createError } = await supabase
          .from('content')
          .insert([{
            id: id || `${content_type}-${Date.now()}`,
            content_type,
            content_data,
            user_id: null // Permitir null para contenido público
          }])
          .select()
          .single();

        if (createError) {
          console.error('Supabase POST error:', createError);
          throw createError;
        }
        return new Response(JSON.stringify(createData), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      case 'PUT': {
        // Actualizar contenido existente
        const updateBody = await request.json();
        const { id: updateId, content_data: updateData } = updateBody;
        
        const { data: updateResult, error: updateError } = await supabase
          .from('content')
          .update({ 
            content_data: updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', updateId)
          .select()
          .single();

        if (updateError) {
          console.error('Supabase PUT error:', updateError);
          throw updateError;
        }
        return new Response(JSON.stringify(updateResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      case 'DELETE': {
        // Eliminar contenido
        const deleteBody = await request.json();
        const { id: deleteId } = deleteBody;
        
        const { error: deleteError } = await supabase
          .from('content')
          .delete()
          .eq('id', deleteId);

        if (deleteError) {
          console.error('Supabase DELETE error:', deleteError);
          throw deleteError;
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(`