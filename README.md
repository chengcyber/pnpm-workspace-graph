# pnpm-workspace-graph

A visualizer let you display pnpm workspace graph

# Usage

```
pnpx pnpm-workspace-graph
pnpx pnpm-workspace-graph -C <your-workspace-dir>
```

visit http://localhost:8888 to see the graph

# CLI parameters

## `-C, --cwd`

Default: `process.cwd()`

Specify working directory, this directory must contains `pnpm-workspace.yaml` file.

## `-h, --host`

Default: `127.0.0.1`

Specify host.

## `-p --port`

Default: `8888`

Specify port.

## `-o --open`

Default: `true`

Whether to open browser after server started.

# Development in local

```shell
pnpm install
pnpm dev:client
pnpm dev  # in another shell
```
