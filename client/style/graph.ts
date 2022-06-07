import type cy from "cytoscape";
import { palette } from "./palette";

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
      color: palette.black,
      "border-width": "1px",
      "border-style": "solid",
      "border-color": palette.neutralTertiary,
      "background-color": palette.themeLighter,
    },
  },
  {
    selector: "edge",
    style: {
      width: "1px",
      "line-color": palette.neutralTertiary,
      "curve-style": "unbundled-bezier",
      "target-arrow-shape": "triangle",
      "target-arrow-fill": "filled",
      "target-arrow-color": palette.neutralQuaternary,
    },
  },
];
