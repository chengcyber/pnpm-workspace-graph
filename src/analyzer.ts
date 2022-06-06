import { Project, ViewerData } from "./types";
import {
  filterPackages,
  WorkspaceFilter,
} from "@pnpm/filter-workspace-packages";

export const getViewerData = async (
  allProjects: Project[],
  filter: WorkspaceFilter[],
  workspaceDir: string
): Promise<ViewerData> => {
  const { selectedProjectsGraph } = await filterPackages(allProjects, filter, {
    linkWorkspacePackages: true,
    prefix: workspaceDir,
    workspaceDir,
  });
  return {
    graph: selectedProjectsGraph,
  };
};
