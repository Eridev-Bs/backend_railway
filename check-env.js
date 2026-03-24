// Script para verificar variables de entorno en Railway
console.log('🔍 Verificando variables de entorno...\n');

const requiredVars = [
  'MYSQLHOST',
  'MYSQLPORT', 
  'MYSQLDATABASE',
  'MYSQLUSER',
  'MYSQLPASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD'
];

console.log('Variables de MySQL (Railway):');
requiredVars.slice(0, 5).forEach(varName => {
  const value = process.env[varName];
  console.log(`  ${varName}: ${value ? '✅ Configurada' : '❌ NO configurada'}`);
  if (value) {
    console.log(`    Valor: ${varName.includes('PASSWORD') ? '***' : value}`);
  }
});

console.log('\nVariables de MySQL (Locales):');
requiredVars.slice(5).forEach(varName => {
  const value = process.env[varName];
  console.log(`  ${varName}: ${value ? '✅ Configurada' : '❌ NO configurada'}`);
  if (value) {
    console.log(`    Valor: ${varName.includes('PASSWORD') ? '***' : value}`);
  }
});

console.log('\n📋 Todas las variables de entorno disponibles:');
Object.keys(process.env)
  .filter(key => key.includes('MYSQL') || key.includes('DB_'))
  .forEach(key => {
    console.log(`  ${key}: ${key.includes('PASSWORD') ? '***' : process.env[key]}`);
  });

console.log('\n💡 Si no ves las variables MYSQL*, necesitas:');
console.log('   1. Ir a Railway → Tu servicio backend → Variables');
console.log('   2. Click "+ New Variable" → "Add Reference"');
console.log('   3. Seleccionar el servicio MySQL');
