import type { ViewerData } from "./types";

declare global {
  interface Window {
    viewerData: ViewerData;
    enableWebSocket: boolean;
    ws?: WebSocket;
  }
}
