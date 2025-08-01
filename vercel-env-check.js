// Script para verificar variables de entorno en Vercel
// Ejecutar: node vercel-env-check.js

import https from 'https';

async function checkVercelEnv() {
  const domain = 'artificial-logika.vercel.app'; // Cambia por tu dominio
  
  console.log('🔍 Verificando variables de entorno en Vercel...');
  console.log(`🌐 Dominio: ${domain}`);
  
  const options = {
    hostname: domain,
    port: 443,
    path: '/api/check-env',
    method: 'GET',
    headers: {
      'User-Agent': 'Vercel-Env-Check/1.0'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Respuesta del servidor:');
          console.log(JSON.stringify(response, null, 2));
          resolve(response);
        } catch (error) {
          console.error('❌ Error parsing response:', error);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.setTimeout(10000, () => {
      console.error('❌ Request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Ejecutar el check
checkVercelEnv()
  .then(() => {
    console.log('\n✅ Verificación completada');
  })
  .catch((error) => {
    console.error('\n❌ Error en verificación:', error.message);
  }); 