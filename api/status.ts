// Endpoint simple para verificar el estado de la aplicación
export default async function handler(_request: Request) {
  try {
    // Verificación básica usando import.meta.env para consistencia con el cliente
    const hasSupabaseUrl = !!(import.meta.env.VITE_SUPABASE_URL);
    const hasSupabaseKey = !!(import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: {
        configured: hasSupabaseUrl && hasSupabaseKey,
        urlConfigured: hasSupabaseUrl,
        keyConfigured: hasSupabaseKey,
        urlLength: import.meta.env.VITE_SUPABASE_URL?.length || 0,
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
      }
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error',
      message: 'Status check failed'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  }
} 