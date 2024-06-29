import { useEffect } from "react";
import { GraphService } from "./service/Graph";
import { BridgeService } from "./service/Bridge";

const gs = GraphService.getInstance();
const bridge = BridgeService.getInstance();
const { useBridge } = bridge;

export const GraphRender = () => {
  const { viewerData } = useBridge();
  useEffect(() => {
    gs.initGraph(viewerData);
    gs.showAllProjects();
  }, [viewerData]);
  return (
    <div
      id="graph-render"
      style={{
        flexGrow: 1,
      }}
    ></div>
  );
};
