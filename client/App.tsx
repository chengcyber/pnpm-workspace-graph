import { initializeIcons } from '@fluentui/react/lib/Icons';

import { ControlPanel } from "./ControlPanel"
import { GraphRender } from "./GraphRender"

initializeIcons(/* optional base url */);

export const App = () => {
  return <div style={{
    display: 'flex',
    width: '100%',
    height: '100%',
  }}>
    <ControlPanel />
    <GraphRender />
  </div>
}