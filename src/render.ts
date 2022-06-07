import path from "path";
import fs from "fs";
import { ViewerData } from "./types";
import { escape } from "lodash";
import { assetsRoot } from "./paths";

export interface RenderData {
  title: string;
  viewerData: ViewerData;
  enableWebSocket: boolean;
}

export const renderClient = ({
  title,
  viewerData,
  enableWebSocket,
}: RenderData) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>${escape(title)}</title>
      <link rel="shortcut icon" href="/assets/pwg-logo.png" type="image/x-icon" />
      <style>
        html, body, #viewer-app {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }
      </style>
      <script>
        window.enableWebSocket = ${escapeJson(enableWebSocket)};
        if (window.enableWebSocket && 'WebSocket' in window) {
          (function() {
            var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
            var socketUrl = protocol + location.host + '/';
            var socket = new WebSocket(socketUrl, 'pnpm-workspace-graph');
            window.ws = socket;
            console.log('[PWG] WebScoket is running...');
          })()
        } else {
          console.log('[PWG] WebSocket is not supported.');
        }
      </script>
    </head>
    <body>
      <div id="viewer-app"></div>
      <script>
        window.viewerData = ${escapeJson(viewerData)};
      </script>
      ${getScript("viewer.js")}
    </body>
  </html>`;
};

/**
 * Escapes `<` characters in JSON to safely use it in `<script>` tag.
 */
function escapeJson(json: unknown) {
  return JSON.stringify(json).replace(/</gu, "\\u003c");
}

function getScript(filename: string) {
  if (process.env.NODE_ENV !== "production") {
    return `<script src="/${filename}"></script>`;
  }
  return `<!-- ${escape(filename)} -->
<script>${getAssetContent(filename)}</script>`;
}

function getAssetContent(filename: string) {
  const assetPath = path.join(assetsRoot, filename);

  if (!assetPath.startsWith(assetsRoot)) {
    throw new Error(`"${filename}" is outside of the assets root`);
  }

  return fs.readFileSync(assetPath, "utf8");
}
