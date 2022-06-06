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

Specify working directory, this directory must contains `pnpm-workspace.yaml` file.

# Development in local

```shell
pnpm install
pnpm dev:client
pnpm dev  # in another shell
```
