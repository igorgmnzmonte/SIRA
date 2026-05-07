import { defineConfig } from 'vite';

export default defineConfig({
  base:
    process.env.GITHUB_PAGES === 'true'
      ? '/SIRA-Sistema-de-Reserva-Salas-e-Equipamentos/'
      : '/',
});
