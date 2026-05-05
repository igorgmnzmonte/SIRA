import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/SIRA-Sistema-de-Reserva-Salas-e-Equipamentos/',
});
