import { render } from 'react-dom';
import { App } from './App';

const $viewer = document.getElementById('viewer-app')

if ($viewer) {
  render(<App />, $viewer);
}