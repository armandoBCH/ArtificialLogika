// API endpoint para verificar variables de entorno en Vercel
export default async function handler(_request: Request) {
  try {
    // En API routes del servidor, usar process.env
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    // Respuesta inmediata sin logs pesados
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