import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.demo.singularsdktest',
  appName: 'SingularDemo',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
