// Endpoint simple para verificar el estado de la aplicación
export default async function handler(_request: Request) {
  try {
    // Verificación básica sin operaciones pesadas
    const hasSupabaseUrl = !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
    const hasSupabaseKey = !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY);
    
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: {
        configured: hasSupabaseUrl && hasSupabaseKey,
        urlConfigured: hasSupabaseUrl,
        keyConfigured: hasSupabaseKey
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