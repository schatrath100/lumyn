import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whyteboard.lumyn',
  appName: 'Lumyn',
  webDir: 'dist',
  ios: {
    scheme: 'App',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
