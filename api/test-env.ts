// Endpoint de prueba para variables de entorno
export default async function handler(_request: Request) {
  try {
    // Información detallada de las variables
    const envInfo = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      allKeys: Object.keys(process.env),
      supabaseKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE')),
      viteKeys: Object.keys(process.env).filter(k => k.startsWith('VITE_')),
      specificVars: {
        VITE_SUPABASE_URL: {
          exists: !!process.env.VITE_SUPABASE_URL,
          length: process.env.VITE_SUPABASE_URL?.length || 0,
          value: process.env.VITE_SUPABASE_URL ? `${process.env.VITE_SUPABASE_URL.substring(0, 30)}...` : 'NOT_FOUND'
        },
        VITE_SUPABASE_ANON_KEY: {
          exists: !!process.env.VITE_SUPABASE_ANON_KEY,
          length: process.env.VITE_SUPABASE_ANON_KEY?.length || 0,
          value: process.env.VITE_SUPABASE_ANON_KEY ? `${process.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT_FOUND'
        }
      }
    };
    
    return new Response(JSON.stringify(envInfo, null, 2), {
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