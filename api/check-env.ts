// API endpoint para verificar variables de entorno en Vercel
export default function handler(req: any, res: any) {
  try {
    // Verificar que las variables de entorno están disponibles en el servidor
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    // Información de debug (sin exponer datos sensibles)
    const response = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      vercel: {
        region: process.env.VERCEL_REGION || 'unknown',
        env: process.env.VERCEL_ENV || 'unknown'
      },
      supabase: {
        urlConfigured: !!supabaseUrl,
        urlValid: supabaseUrl ? supabaseUrl.includes('.supabase.co') : false,
        keyConfigured: !!supabaseKey,
        keyValid: supabaseKey ? supabaseKey.length > 50 : false,
        urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT_FOUND',
        keyLength: supabaseKey ? supabaseKey.length : 0
      },
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.startsWith('VITE_') || 
        key.startsWith('VERCEL_') || 
        key === 'NODE_ENV'
      )
    };
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to check environment',
      message: (error as Error).message 
    });
  }
}