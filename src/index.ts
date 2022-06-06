import { ViewerServer } from "./viewer";

import type { ViewerServerOptions } from "./viewer";

export interface StartServerOptions extends ViewerServerOptions {
  cwd: string;
}

export const startServer = async (opts: StartServerOptions) => {
  const vs = new ViewerServer(opts);
  await vs.startServer();
};
