export {};

declare global {
  interface Window {
    electronApp?: {
      platform: string;
      showNotification: (title: string, body: string) => void;
    };
  }
}
