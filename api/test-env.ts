// Endpoint de prueba para variables de entorno - VERSIÓN SIMPLIFICADA
export default async function handler(_request: Request) {
  try {
    // Respuesta inmediata sin operaciones pesadas
    const response = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV || 'unknown',
      supabase: {
        VITE_SUPABASE_URL: {
          exists: !!process.env.VITE_SUPABASE_URL,
          length: process.env.VITE_SUPABASE_URL?.length || 0
        },
        VITE_SUPABASE_ANON_KEY: {
          exists: !!process.env.VITE_SUPABASE_ANON_KEY,
          length: process.env.VITE_SUPABASE_ANON_KEY?.length || 0
        }
      },
      totalEnvVars: Object.keys(process.env).length,
      supabaseVars: Object.keys(process.env).filter(k => k.includes('SUPABASE')).length
    };
    
    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  }
} 