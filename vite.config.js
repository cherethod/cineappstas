import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Forzar carga de todas las variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      // Inyectar variables explícitamente
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_TDBM_API_URL': JSON.stringify(env.VITE_TDBM_API_URL),
      'import.meta.env.VITE_TDBM_API_TOKEN': JSON.stringify(env.VITE_TDBM_API_TOKEN),
      'import.meta.env.VITE_TDBM_API_KEY': JSON.stringify(env.VITE_TDBM_API_KEY),
      
      // Debug: Verificar en consola de producción
      'import.meta.env.NETLIFY_DEBUG': JSON.stringify('true')
    }
  };
});