
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Iniciando build para desktop...');

// Verificar se Tauri está configurado
const tauriPath = path.join(process.cwd(), 'src-tauri');
if (!fs.existsSync(tauriPath)) {
  console.log('❌ Tauri não configurado. Execute: npm run tauri:init');
  process.exit(1);
}

try {
  // Build da aplicação web
  console.log('📦 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Build do Tauri
  console.log('🦀 Building Tauri application...');
  execSync('npm run tauri build', { stdio: 'inherit' });

  console.log('✅ Build concluído com sucesso!');
  console.log('📁 Arquivos gerados em: src-tauri/target/release/bundle/');
  
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
