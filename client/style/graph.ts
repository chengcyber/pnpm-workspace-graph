import type cy from "cytoscape";

export const cyGraphStyle: cy.Stylesheet[] = [
  {
    selector: "node",
    style: {
      label: "data(id)",
      "text-halign": "center" as const,
      "text-valign": "center" as const,
      shape: "round-rectangle",
      width: (node: any) => {
        return node.data("id").length * 16;
      },
    },
  },
  {
    selector: "edge",
    style: {
      width: "2px",
      "curve-style": "unbundled-bezier",
      "target-arrow-shape": "triangle",
      "target-arrow-fill": "filled",
    },
  },
];
