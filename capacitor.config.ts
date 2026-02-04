
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mnac.virtualexperience',
  appName: 'MNAC Virtual',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#A6192E",
      androidSplashResourceName: "splash"
    },
    StatusBar: {
      style: "DARK",
      overlaysWebView: true
    }
  }
};

export default config;
