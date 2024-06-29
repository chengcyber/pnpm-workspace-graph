import { Dispatch, SetStateAction, useState } from "react";
import { ViewerData } from "../types";
import type { WorkspaceFilter } from "@pnpm/filter-workspace-packages";

class BridgeService {
  private static _instance: BridgeService | undefined;
  private _setViewerData: Dispatch<SetStateAction<ViewerData>> | undefined;
  private constructor() {
    if (window.ws) {
      window.ws.addEventListener("message", (event) => {
        const msg = JSON.parse(event.data.toString());
        switch (msg.command) {
          case "viewerDataUpdated": {
            const viewerData = msg.data;
            if (viewerData) {
              window.viewerData = viewerData;
              this._setViewerData?.(viewerData);
            }
            break;
          }
          case "reportError": {
            const errorMessage = msg.data.errorMessage
            if (errorMessage) {
              console.error(`Receive error from server: ${errorMessage}`);
            }
            break;
          }
          default: {
            console.error(`Unsupported command type ${msg.command}`);
            break;
          }
        }
      });
    }
  }

  public useBridge = () => {
    // it's ok if there is only one component using this hook
    const [viewerData, setViewerData] = useState(window.viewerData);
    this._setViewerData = setViewerData;
    return {
      viewerData,
    };
  };

  public static getInstance(): BridgeService {
    if (!BridgeService._instance) {
      BridgeService._instance = new BridgeService();
    }
    return BridgeService._instance;
  }
  public updateFilter(filter: WorkspaceFilter[]): void {
    if (!window.ws) {
      console.error("The websocket is not running.");
      return;
    }

    window.ws.send(
      JSON.stringify({
        command: "filterUpdated",
        data: {
          filter,
        },
      })
    );
  }
}

export { BridgeService };
