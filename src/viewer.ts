import http from "http";
import sirv from "sirv";
import WebSocket from "ws";
import chalk from "chalk";
import findWorkspacePackages from "@pnpm/find-workspace-packages";
import Logger from "./Logger";
import { open } from "./utils";
import { projectRoot } from "./paths";
import { renderClient } from "./render";
import { getViewerData } from "./analyzer";

import type { AddressInfo, Socket } from "net";
import type { ViewerData, Project } from "./types";
import type { WorkspaceFilter } from "@pnpm/filter-workspace-packages";

const { bold, redBright } = chalk;

interface ViewerServerOptions {
  port?: number;
  host?: string;
  open?: boolean;
  logger?: Logger;
  cwd?: string;
}

class ViewerServer {
  private _port: number;
  private _host: string;
  private _openBrowser: boolean;
  private _logger: Logger;
  private _cwd: string;
  private _allProjects: Project[] | undefined;
  private _viewerData: ViewerData | undefined;
  private _server: http.Server | undefined;
  private _wss: WebSocket.Server | undefined;

  public constructor(opts: ViewerServerOptions = {}) {
    this._port = opts.port || 8888;
    this._host = opts.host || "127.0.0.1";
    this._cwd = opts.cwd || process.cwd();
    this._openBrowser = opts.open || true;
    this._logger = opts.logger || new Logger();
  }

  private _createViewerData = async (
    filter: WorkspaceFilter[] = []
  ): Promise<ViewerData> => {
    if (!this._allProjects) {
      const allProjects = await findWorkspacePackages(this._cwd);
      this._allProjects = allProjects;
    }

    const allProjects = this._allProjects;

    const viewerData = await getViewerData(allProjects, filter, this._cwd);
    return viewerData;
  };

  public filterProjects = async (filter: WorkspaceFilter[] = []) => {
    if (!this._wss) {
      return;
    }
    const viewerData = await this._createViewerData(filter);
    this._wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            command: "viewerDataUpdated",
            data: viewerData,
          })
        );
      }
    });
  };

  public startServer = async () => {
    if (this._server) {
      return;
    }

    if (!this._viewerData) {
      this._viewerData = await this._createViewerData();

      if (!this._allProjects?.length) {
        this._logger.error(redBright(`No projects found in ${this._cwd}`));
        process.exit(1);
      }
    }

    const sirvMiddleware = sirv(`${projectRoot}/public`, {
      dev: true,
    });

    const server = http.createServer((req, res) => {
      if (req.method === "GET" && req.url === "/") {
        const html = renderClient({
          title: "pnpm workspace graph",
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          viewerData: this._viewerData!,
          enableWebSocket: true,
        });
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } else {
        sirvMiddleware(req, res);
      }
    });

    const port = this._port;
    const host = this._host;
    const logger = this._logger;
    const openBrowser = this._openBrowser;

    await new Promise<void>((resolve, reject) => {
      if (!server) {
        reject();
      }
      server.listen(port, host, () => {
        resolve();

        const url = `http://${host}:${(server.address() as AddressInfo).port}`;

        logger.info(
          `${bold("pnpm-workspace-graph")} is started at ${bold(url)}\n` +
            `Use ${bold("Ctrl+C")} to close it`
        );

        if (openBrowser) {
          open(url, logger);
        }
      });
    });

    const wss = new WebSocket.Server({ noServer: true });
    this._wss = wss;

    server.on("upgrade", (req, socket, head) => {
      // Only handle upgrades to requests from this package, ignore others.
      if (req.headers["sec-websocket-protocol"] !== "pnpm-workspace-graph") {
        return;
      }
      wss.handleUpgrade(req, socket as Socket, head, (client) => {
        wss.emit("connection", client, req);
      });
    });

    wss.on("connection", (socket) => {
      socket.on("message", (data) => {
        const message = JSON.parse(data.toString());
        logger.debug(`Received message: ${JSON.stringify(message)}`);
        switch (message.command) {
          case "filterUpdated": {
            const filter = message.data.filter as WorkspaceFilter[];
            this.filterProjects(filter);
            break;
          }
        }
      });
      socket.on("error", (err) => {
        // Ignore network errors like `ECONNRESET`, `EPIPE`, etc.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((err as any).errno) return;

        logger.info(err.message);
      });
    });
  };
}

export { ViewerServer, ViewerServerOptions };
