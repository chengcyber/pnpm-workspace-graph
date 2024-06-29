import { ControlPanel } from "./ControlPanel"
import { GraphRender } from "./GraphRender"

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