import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.finapp.app',
  appName: 'FinApp',
  webDir: 'dist',
  android: {
    backgroundColor: '#0F172A',
  },
  plugins: {
    AdMob: {
      testDevices: [''],
      initialize: true,
    },
  },
};

export default config;
