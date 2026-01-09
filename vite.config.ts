
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Explicitly import process to ensure Node.js types are correctly used for cwd().
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // 현재 모드(development/production)에 맞는 환경 변수를 로드합니다.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 빌드 타임에 process.env.API_KEY를 실제 환경 변수 값으로 치환합니다.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    }
  };
});
