import { turso } from '../db/turso';

export default async function handler(_request: Request) {
  try {
    // Verificar variables de entorno
    const tursoUrl = process.env.VITE_TURSO_DATABASE_URL;
    const tursoToken = process.env.VITE_TURSO_AUTH_TOKEN;
    
    const envCheck = {
      urlConfigured: !!tursoUrl,
      tokenConfigured: !!tursoToken,
      urlLength: tursoUrl?.length || 0,
      tokenLength: tursoToken?.length || 0
    };

    // Intentar conexión real a Turso
    let connectionTest = null;
    let tableTest = null;
    
    try {
      // Test 1: Conexión básica
      const pingResult = await turso.execute('SELECT 1 as test');
      connectionTest = {
        success: true,
        message: 'Conexión exitosa a Turso',
        data: pingResult.rows?.[0] || null
      };
      
      // Test 2: Verificar tabla content
      const tableResult = await turso.execute('SELECT COUNT(*) as count FROM content');
      tableTest = {
        success: true,
        message: 'Tabla content encontrada',
        count: tableResult.rows?.[0]?.count || 0
      };
      
    } catch (dbError: any) {
      connectionTest = {
        success: false,
        message: 'Error de conexión a Turso',
        error: dbError.message
      };
      tableTest = {
        success: false,
        message: 'No se pudo verificar la tabla',
        error: dbError.message
      };
    }

    const response = {
      timestamp: new Date().toISOString(),
      environment: {
        ...envCheck,
        nodeEnv: process.env.NODE_ENV || 'unknown'
      },
      connection: connectionTest,
      table: tableTest,
      summary: {
        configured: envCheck.urlConfigured && envCheck.tokenConfigured,
        connected: connectionTest?.success || false,
        tableExists: tableTest?.success || false
      }
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({
      error: 'Test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 