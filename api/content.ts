import { createClient } from '@supabase/supabase-js';

// Verificar configuración de variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
        return new Response(`Method ${method} Not Allowed`, {
          status: 405,
          headers: { 
            'Allow': 'GET, POST, PUT, DELETE',
            'Content-Type': 'text/plain'
          }
        });
    }
  } catch (error: any) {
    console.error('Content API Error:', error);
    
    // Determinar el tipo de error
    let errorMessage = 'Database operation failed';
    let errorDetails = error.message || 'Unknown error';
    let statusCode = 500;
    
    if (error.code === 'PGRST116') {
      errorMessage = 'No content found';
      errorDetails = 'The requested content does not exist';
      statusCode = 404;
    } else if (error.code === '23505') {
      errorMessage = 'Duplicate content';
      errorDetails = 'Content with this ID already exists';
      statusCode = 409;
    } else if (error.message?.includes('Supabase configuration missing')) {
      errorMessage = 'Configuration error';
      errorDetails = 'Supabase is not properly configured';
      statusCode = 503;
    } else if (!supabaseUrl || !supabaseAnonKey) {
      errorMessage = 'Environment variables missing';
      errorDetails = 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required';
      statusCode = 503;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: errorDetails,
      hint: 'Check Supabase configuration and table setup',
      timestamp: new Date().toISOString(),
      env: {
        urlConfigured: !!supabaseUrl,
        keyConfigured: !!supabaseAnonKey
      }
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}