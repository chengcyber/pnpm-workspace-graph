import { program } from "commander";
import path from "path";
import { startServer } from "./index";
import { projectRoot } from "./paths";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require(path.resolve(projectRoot, "./package.json"));

main();

async function main() {
  program
    .name("pnpm-workspace-graph")
    .version(version)
    .option("-C, --cwd <cwd>", "working directory", process.cwd())
    .option("-h, --host <host>", "host", "127.0.0.1")
    .option("-p, --port <port>", "port", "8888")
    .option("-o, --open", "open browser", true)
    .action(async (opts) => {
      await startServer(opts);
    });

  await program.parseAsync(process.argv);
}
