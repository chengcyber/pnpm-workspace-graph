import type { PackageNode, Package } from "pkgs-graph";

export type { Project } from "@pnpm/find-workspace-packages";

export type ViewerData = {
  graph: {
    [id: string]: PackageNode<Package>;
  };
};
