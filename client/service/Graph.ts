import cy from "cytoscape";
import dagre from "cytoscape-dagre";
import { cyGraphStyle } from "../style/graph";
import { ViewerData } from "../types";
import { BridgeService } from "./Bridge";

class GraphService {
  private _containerId: string;
  private _fgGraph: cy.Core | undefined;
  private _bgGraph: cy.Core | undefined;
  private _bridge: BridgeService;

  private _dagreLayoutConfig: Partial<CytoscapeDagreConfig>;

  private static instance: GraphService | undefined;

  private constructor(containerId: string) {
    this._containerId = containerId;
    this._bridge = BridgeService.getInstance();

    cy.use(dagre);

    this._dagreLayoutConfig = {
      name: "dagre",
      nodeDimensionsIncludeLabels: true,
      rankSep: 300,
      // Direction - from Top to Bottom
      rankDir: "TB",
      edgeSep: 150,
      ranker: "network-simplex",
    }
  }

  public static getInstance(): GraphService {
    if (!GraphService.instance) {
      GraphService.instance = new GraphService("graph-render");
    }
    return GraphService.instance;
  }

  public initGraph = (viewerData: ViewerData): void => {
    const { graph } = viewerData;
    console.log("graph", graph);
    const selfRefPackageNames: string[] = [];

    const nodes = Object.values(graph).map((value: any) => ({
      group: "nodes",
      data: {
        id: value.package.manifest.name,
      },
    }));
    const edges = Object.values(graph)
      .map((value: any) => {
        const { dependencies } = value;
        return dependencies
          .map((dependency: string) => {
            const source = value.package.manifest.name;
            const target = graph[dependency]?.package.manifest.name;
            if (!target) {
              // dependency is not in the graph, ignore
              return undefined;
            }
            if (source === target) {
              // self-ref
              selfRefPackageNames.push(source);
              return undefined;
            }
            return {
              group: "edges",
              data: {
                id: `${source}-${target}`,
                source,
                target,
              },
            };
          })
          .filter(Boolean);
      })
      .flat();

    console.log("self ref package names", selfRefPackageNames);

    const elements = [...nodes, ...edges];

    if (this._bgGraph) {
      this._bgGraph.destroy();
      delete this._bgGraph;
    }

    this._bgGraph = cy({
      headless: true,
      elements,
      style: cyGraphStyle,
      boxSelectionEnabled: false,
    });
  };

  public showAllProjects = (): void => {
    if (!this._bgGraph) {
      throw new Error("Graph has not initialized");
    }
    this._renderGraph(this._bgGraph.elements());
  };

  public setFilter = (filter: string[]): void => {
    console.log("filter", filter);
    this._bridge.updateFilter(
      filter.map((f) => {
        return {
          followProdDepsOnly: false,
          filter: f,
        };
      })
    );
  };

  public exportToPNG(): Promise<Blob> | undefined {
    if (this._fgGraph) {
      return this._fgGraph.png({
        full: true,
        output: 'blob-promise'
      });
    }
  }

  private _renderGraph = (elements: cy.Collection): void => {
    // clear fg
    if (this._fgGraph) {
      this._fgGraph.destroy();
      delete this._fgGraph;
    }

    const container = document.getElementById(this._containerId);
    this._fgGraph = cy({
      container,
      headless: false,
      style: cyGraphStyle,
      boxSelectionEnabled: false,
    });

    this._fgGraph.add(elements);

    this._fgGraph.elements().sort((a, b) => {
      return a.id().localeCompare(b.id());
    });

    this._fgGraph
      .layout(
        this._dagreLayoutConfig as CytoscapeDagreConfig)
      .run();

    this._fgGraph.fit().center().resize();
  };
}

export interface CytoscapeDagreConfig
  extends cy.BaseLayoutOptions,
    cy.AnimatedLayoutOptions {
  // dagre algo options, uses default value on undefined
  nodeSep: number; // the separation between adjacent nodes in the same rank
  edgeSep: number; // the separation between adjacent edges in the same rank
  rankSep: number; // the separation between each rank in the layout
  rankDir: "TB" | "LR"; // 'TB' for top to bottom flow, 'LR' for left to right,
  ranker: "network-simplex" | "tight-tree" | "longest-path"; // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
  minLen: (edge: cy.EdgeSingular) => number; // number of ranks to keep between the source and target of the edge
  edgeWeight: (edge: cy.EdgeSingular) => number; // higher weight edges are generally made shorter and straighter than lower weight edges

  // general layout options
  fit: boolean; // whether to fit to viewport
  padding: number; // fit padding
  spacingFactor: number; // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  nodeDimensionsIncludeLabels: boolean; // whether labels should be included in determining the space used by a node
  boundingBox:
    | { x1: number; y1: number; x2: number; y2: number }
    | { x1: number; y1: number; w: number; h: number }; // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  // transform: (node, pos) => cy.Position; // a function that applies a transform to the final node position
  ready: () => void; // on layoutready
  stop: () => void; // on layoutstop
}

export { GraphService };
