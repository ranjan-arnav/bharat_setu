import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bharatsetu.app',
  appName: 'Bharat Setu',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#0a1628',
    allowMixedContent: true,
    captureInput: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a1628',
      showSpinner: false
    }
  }
};

export default config;
