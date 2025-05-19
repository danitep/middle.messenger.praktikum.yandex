// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
  plugins: [handlebars({
    partialDirectory: [
      './src/components/errorPage',
      './src/components/form',
      './src/components/inputField',
      './src/components/slider',
      './src/components/profileInfo',
      './src/components/profileForm',
      './src/components/profileRow',
      './src/components/profileLink',
      './src/components/profilePopup',
      './src/components/chatList',
      './src/components/chatLabel',
      './src/components/chatBorderLine',
      './src/components/chat',
      './src/components/chatHeader',
      './src/components/chatSettingsPopup',
      './src/components/chatSettingsRow',
      './src/components/chatMessage',
      './src/components/chatPopup',
    ],
  })],
});
