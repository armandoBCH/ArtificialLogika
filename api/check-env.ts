// API endpoint para verificar variables de entorno en Vercel
// NECESARIO: La aplicación SÍ requiere este endpoint para funcionar correctamente
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Configurar CORS para permitir llamadas desde el frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Solo permitir GET requests
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // Verificar que las variables de entorno están disponibles en el servidor
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    // También verificar en process.env sin prefijo VITE_ (por si Vercel las mapea diferente)
    const altUrl = process.env.SUPABASE_URL;
    const altKey = process.env.SUPABASE_ANON_KEY;
    
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
        keyLength: supabaseKey ? supabaseKey.length : 0,
        // También verificar variables alternativas
        altUrlConfigured: !!altUrl,
        altKeyConfigured: !!altKey,
        altUrlPrefix: altUrl ? altUrl.substring(0, 30) + '...' : 'NOT_FOUND'
      },
      status: 'success'
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('API endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to check environment',
      message: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
}