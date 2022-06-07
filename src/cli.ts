#!/usr/bin/env node

import { InvalidArgumentError, program } from "commander";
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
    .option<number>(
      "-p, --port <port>",
      "port",
      (value: string) => {
        // parseInt takes a string and a radix
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) {
          throw new InvalidArgumentError("Not a number.");
        }
        return parsedValue;
      },
      8188
    )
    .option("-o, --open", "open browser", true)
    .action(async (opts) => {
      await startServer(opts);
    });

  await program.parseAsync(process.argv);
}
