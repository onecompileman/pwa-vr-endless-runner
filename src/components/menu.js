const componentStyles = `
    <style>

    .menu {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .play-wrapper {
      padding-top: 150px;
      display: flex;
      justify-content: center;
      font-size: 32px;
      align-items: center;
      color: white;
      font-family: Arial;
    }

    .play-container {
      cursor: pointer;
      height: 100px;
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #F15A24;
      border-radius: 100%;
    }

    .top-bar-container, .bottom-container {
      display: flex;
      justify-content: space-between;
      padding: 10px;
    }
    .bottom-container {
      margin-bottom: 20px;
    }

    .top-bar-btn {
      height: 64px;
      width: 64px;
      border-radius: 100%;  
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

    }

    .bottom-btn {
      width: 140px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      color: white;
      border-radius: 5px;
      font-family: Arial;
      font-size: 16px;
    }

    .game-title {
      text-align: center;
      font-size: 36px;
      font-family: Arial;
      color: #FDE366;
      text-shadow: 2px 3px #444;
      font-weight: 700;
    }

    .bottom-btn img {
      height: 24px;
    }

    .top-bar-btn img {
      height: 32px;
      width: 32px;
    }

    .play-container img {
      height: 86px;
      width: auto;
    }
    </style>
`;

export class Menu extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      onPlayCallback: () => {},
      onAboutCallback: () => {},
      onHighScoreCallback: () => {},
      onHowToPlayCallback: () => {},
      onStoreCallback: () => {}
    };
    this.renderHTML();
    this.bindEvents();
  }

  get onPlayCallback() {
    return this.prop.onPlayCallback;
  }

  get onAboutCallback() {
    return this.prop.onAboutCallback;
  }

  get onHighScoreCallback() {
    return this.prop.onHighScoreCallback;
  }

  get onStoreCallback() {
    return this.prop.onStoreCallback;
  }

  get onHowToPlayCallback() {
    return this.prop.onHowToPlayCallback;
  }

  set onPlayCallback(onPlayCallback) {
    this.prop.onPlayCallback = onPlayCallback;
  }

  set onAboutCallback(onAboutCallback) {
    this.prop.onAboutCallback = onAboutCallback;
  }

  set onHighScoreCallback(onHighScoreCallback) {
    this.prop.onHighScoreCallback = onHighScoreCallback;
  }

  set onStoreCallback(onStoreCallback) {
    this.prop.onStoreCallback = onStoreCallback;
  }

  set onHowToPlayCallback(onHowToPlayCallback) {
    this.prop.onHowToPlayCallback = onHowToPlayCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#play')
      .addEventListener('click', () => this.prop.onPlayCallback());
    this.root
      .querySelector('#about')
      .addEventListener('click', () => this.prop.onAboutCallback());
    this.root
      .querySelector('#store')
      .addEventListener('click', () => this.prop.onStoreCallback());
    this.root
      .querySelector('#highScore')
      .addEventListener('click', () => this.prop.onHighScoreCallback());
    this.root
      .querySelector('#howToPlay')
      .addEventListener('click', () => this.prop.onHowToPlayCallback());
  }

  renderHTML() {
    this.root.innerHTML = `
        ${componentStyles}
        <div class="menu">
          <div class="top-bar-container">
            <div class="top-bar-btn" id="store" style="background-color: #35EC24;">
              <img src="assets/images/store.png">
            </div>
            <div class="top-bar-btn" id="about" style="background-color: #24ABF2;">
              <img src="assets/images/question.png">
            </div>
          </div>

          <div class="game-title">
            ALIEN RUNNER
          </div>

          <div id="play" class="play-wrapper">
            Tap to play
           
          </div>
          <div class="bottom-container">
            <div class="bottom-btn" id="highScore" style="background-color:#F15A24;">
              <img src="assets/images/leaderboards.png">&nbsp; HighScore
            </div>
            <div class="bottom-btn" id="howToPlay" style="background-color: #ECB22E">
              <img src="assets/images/phone.png">&nbsp; How to play
            </div>
          </div>
        </div>
        `;
  }

  static get observedAttributes() {
    return [
      'onAboutCallback',
      'onPlayCallback',
      'onHighScoreCallback',
      'onHowToPlayCallback',
      'onStoreCallback'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onAboutCallback':
        this.onAboutCallback = newValue;
        break;
      case 'onPlayCallback':
        this.onPlayCallback = newValue;
        break;
      case 'onHighScoreCallback':
        this.onHighScoreCallback = newValue;
        break;
      case 'onHowToPlayCallback':
        this.onHowToPlayCallback = newValue;
        break;
      case 'onStoreCallback':
        this.onStoreCallback = newValue;
        break;
    }
  }
}

customElements.define('menu-screen', Menu);
