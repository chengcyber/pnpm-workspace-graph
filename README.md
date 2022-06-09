# pnpm-workspace-graph

Visualize project relationships in your [PNPM](https://pnpm.io/) workspace

## Quick start

1. Install the tool:

   ```shell
   # Install the tool globally so that you can invoke it in any folder:
   $ pnpm install --global pnpm-workspace-graph
   ```

2. Invoke the tool:

   If your monorepo is using a regular [PNPM workspace](https://pnpm.io/workspaces):

   ```shell
   $ cd my-pnpm-monorepo
   $ pnpm-workspace-graph

   pnpm-workspace-graph is started at http://127.0.0.1:8188
   Use Ctrl+C to close it
   ```

   If your monorepo is using a [Rush workspace for PNPM](https://rushjs.io/pages/maintainer/package_managers/), the  `pnpm-workspace.yaml` file is generated in the `common/temp` folder:

   ```shell
   $ cd my-rush-monorepo
   $ rush install

   # NOTE: Ensure that useWorkspaces=true in your rush.json config file
   $ pnpm-workspace-graph --cwd common/temp

   pnpm-workspace-graph is started at http://127.0.0.1:8188
   Use Ctrl+C to close it
   ```

3. A typical monorepo will have too many projects to meaningfully visualize.  When the web browser page appears, click the `[Open Panel]` button and use PNPM's `--filter` syntax to select the subset of projects that you are interested in:

   <img src="assets/example-settings.png" style="max-width: 700px;" alt="Settings Panel" />
   <p><i>Using the Settings Panel to select a subset of projects</i></p>

   In separate boxes, enter the full package names to be analyzed.  They must be local workspace projects from `pnpm-workspace.yaml`.  To indicate all workspace projects that are dependencies of `my-package`, specify `...my-package`.  To indicate all workspace projects that depend on `my-package`, specify `my-package...`.  Refer to the [PNPM documentation](https://pnpm.io/filtering) for more information about the `--filter` syntax.

4. After you have selected a subset of projects, click the `X` to close the Settings Panel.  Using the mouse, you can move the nodes to make a nice presentation. Use the mouse wheel to zoom in or out.

   <img src="assets/example-graph.png" style="max-width: 700px;" alt="Example graph" />
   <p><i>An example graph made by cloning the <a href="https://github.com/pnpm/pnpm">https://github.com/pnpm/pnpm</a> workspace</i></p>


## CLI parameters

```shell
$ pnpm --help

Usage: pnpm-workspace-graph [options]

Options:
  -V, --version      output the version number
  -C, --cwd <cwd>    working directory
  -h, --host <host>  host (default: "127.0.0.1")
  -p, --port <port>  port (default: 8188)
  -o, --open         open browser (default: true)
  --help             display help for command
```

### `-C, --cwd`

Default: `process.cwd()`

Specify working directory. This directory must contain the `pnpm-workspace.yaml` file that defines your workspace.

### `-h, --host`

Default: `127.0.0.1`

Specify network interface where the local web server will run.

### `-p --port`

Default: `8188`

Specify the localhost port where the local web server will run.

NOTE: If you want to invoke multiple instances of the tool, you must specify different ports.  This will be improved in the future.

### `-o --open`

Default: `true`

Whether to launch the web browser automatically to show the specified host/port.


## Contributing

To build and debug the project:

```shell
$ git clone https://github.com/chengcyber/pnpm-workspace-graph.git
$ cd pnpm-workspace-graph

# Install dependencies
$ pnpm install

# Launch the Webpack localhost dev server
$ pnpm dev:client

# (In a separate shell window)
# Launch the TypeScript compiler in "watch mode"
$ pnpm dev  # in another shell

# (In a separate shell window)
# Invoke the CLI tool using the "fixture/basic" testing workspace
$ node lib/cli.js -C fixture/basic
```

## LICENSE

MIT @[chengcyber](https://github.com/chengcyber)
