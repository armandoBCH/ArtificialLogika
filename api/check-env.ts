// API endpoint para verificar variables de entorno en Vercel
export default async function handler(_request: Request) {
  try {
    // En Vercel, las variables de entorno están disponibles en process.env
    // pero las variables VITE_ están pensadas para el cliente
    // Usar las variables sin el prefijo VITE_ para el servidor
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
    // Log para debugging
    console.log('🔍 Environment check:', {
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT_FOUND',
      supabaseKey: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT_FOUND',
      allEnvVars: Object.keys(process.env).filter(k => k.includes('SUPABASE')),
      nodeEnv: process.env.NODE_ENV
    });
    
    // Respuesta detallada para debugging
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      supabase: {
        urlConfigured: !!supabaseUrl,
        keyConfigured: !!supabaseKey,
        urlValid: supabaseUrl ? supabaseUrl.includes('.supabase.co') : false,
        urlLength: supabaseUrl?.length || 0,
        keyLength: supabaseKey?.length || 0
      },
      availableEnvVars: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('❌ Error in check-env:', error);
    return new Response(JSON.stringify({ 
      status: 'error',
      message: 'Failed to check environment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  }
}