// Endpoint simple para verificar el estado de la aplicación
export default async function handler(_request: Request) {
  try {
    // Logs detallados para debugging
    console.log('🔍 Environment variables check:');
    console.log('All process.env keys:', Object.keys(process.env));
    console.log('SUPABASE related keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'FOUND' : 'NOT_FOUND');
    console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'FOUND' : 'NOT_FOUND');
    
    // En API routes del servidor, usar process.env
    const hasSupabaseUrl = !!(process.env.VITE_SUPABASE_URL);
    const hasSupabaseKey = !!(process.env.VITE_SUPABASE_ANON_KEY);
    
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: {
        configured: hasSupabaseUrl && hasSupabaseKey,
        urlConfigured: hasSupabaseUrl,
        keyConfigured: hasSupabaseKey,
        urlLength: process.env.VITE_SUPABASE_URL?.length || 0,
        keyLength: process.env.VITE_SUPABASE_ANON_KEY?.length || 0
      },
      debug: {
        allEnvKeys: Object.keys(process.env),
        supabaseKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE')),
        nodeEnv: process.env.NODE_ENV
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
      message: 'Status check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  }
} 