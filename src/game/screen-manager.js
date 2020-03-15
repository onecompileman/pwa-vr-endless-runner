import { GameScreens } from './enums/game-screens';

export class ScreenManager {
  constructor() {
    // Initialize Screens
    this.screens = Object.keys(GameScreens).reduce((acc, key) => {
      return {
        [key]: document.querySelector(GameScreens[key]),
        ...acc
      };
    }, {});
    // Bind events
    this.bindEvents();
  }

  bindEvents() {
    this.getScreen(GameScreens.ABOUT).onCloseCallback = () => {
      this.showScreen(GameScreens.MENU);
    };

    this.getScreen(GameScreens.GAME_OVER).onMenuCallback = () => {
      this.showScreen(GameScreens.MENU);
    };

    this.getScreen(GameScreens.HIGH_SCORE).onMenuCallback = () => {
      this.showScreen(GameScreens.MENU);
    };

    this.getScreen(GameScreens.HOW_TO_PLAY).onCloseCallback = () => {
      this.showScreen(GameScreens.MENU);
    };

    const menuScreen = this.getScreen(GameScreens.MENU);

    menuScreen.onAboutCallback = () => {
      this.showScreen(GameScreens.ABOUT);
    };

    menuScreen.onHighScoreCallback = () => {
      this.showScreen(GameScreens.HIGH_SCORE);
    };

    menuScreen.onHowToPlayCallback = () => {
      this.showScreen(GameScreens.HOW_TO_PLAY);
    };
  }

  getScreen(gameScreen) {
    const key = this.getGameScreenKeyByValue(gameScreen);
    return this.screens[key];
  }

  hideAllScreens() {
    Object.keys(this.screens).forEach(
      key => (this.screens[key].style.display = 'none')
    );
  }

  showScreen(gameScreen) {
    this.hideAllScreens();

    const key = this.getGameScreenKeyByValue(gameScreen);

    this.screens[key].style.display = 'flex';
  }

  getGameScreenKeyByValue(value) {
    return Object.keys(GameScreens).find(key => GameScreens[key] === value);
  }
}
