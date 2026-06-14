import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zestify.ai',
  appName: 'Zestify',
  webDir: 'out',
  server: {
    url: 'https://zestify.vercel.app',
    cleartext: true
  }
};

export default config;
