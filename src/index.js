import './components/menu';
import './components/about';
import './components/loading';
import './components/in-game-ui';
import './components/pause';
import './components/game-over';
import './components/high-score';
import './components/how-to-play';

import { GameManager } from './game/game-manager';

const gameManager = new GameManager();
gameManager.init();

// Registers Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}
