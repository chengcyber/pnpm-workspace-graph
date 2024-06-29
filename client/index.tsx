import { render } from "react-dom";
import { App } from "./App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

const $viewer = document.getElementById("viewer-app");

if ($viewer) {
  render(
    <FluentProvider
      theme={webLightTheme}
      style={{ display: "flex", width: "100%", height: "100%" }}
    >
      <App />
    </FluentProvider>,
    $viewer
  );
}
