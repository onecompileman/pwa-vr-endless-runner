const componentStyles = `
    <style>
        .game-over {
            display: flex;
            height: 100%;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            align-items: center;
            justify-content: center;
            font-family: Arial;
        }

        .game-over-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
        }

        .score-container {
            display: flex;
            flex-direction: column;   
            align-items: center;
        }

        .game-over-title {
            font-size: 36px;
            color: white;
        }

        .score-title {
            color: #FDE366;
            font-size: 24px;
            margin-top: 10px;
        }

        .score-text {
           margin-top: 15px; 
           width: 120px;
           padding: 7px 15px;
           color: white;
           text-align: center;
           font-size: 20px; 
           background-color: rgba(241, 90, 36, 0.95);
           border-radius: 4px;
           border: 3px dashed white;
        }

        .coins-text {
            color: white;
            font-size: 16px;
            margin-left: 10px;
        }

        .coins-container {
           padding: 7px;
           width: 60px;
           background-color: rgba(241, 90, 36, 0.95);
           box shadow: 4px 4px 4px black;
           display: flex;
           align-items: center; 
        }

        .action-container {
            margin: 20px;
            width: 100%;
            padding: 20px;
            display: flex;
            justify-content: center;
        }

        .action-btn {
            height: 48px;
            width: 48px;
            border-radius: 100%;  
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin: 25px;
        }

        #play {
            background-color: #35EC24;
        }

        #menu {
            background-color: #F15A24;
        }
    </style>
`;
export class GameOver extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      onPlayCallback: () => {},
      onMenuCallback: () => {},
      coins: 0,
      score: 0
    };
    this.renderHTML();
    this.bindEvents();
  }

  get onPlayCallback() {
    return this.prop.onPlayCallback;
  }

  get onMenuCallback() {
    return this.prop.onMenuCallback;
  }

  get coins() {
    return this.prop.coins;
  }

  get score() {
    return this.prop.score;
  }

  set onPlayCallback(onPlayCallback) {
    this.prop.onPlayCallback = onPlayCallback;
  }

  set onMenuCallback(onMenuCallback) {
    this.prop.onMenuCallback = onMenuCallback;
  }

  set coins(coins) {
    this.prop.coins = coins;
    this.root.querySelector('#coins').innerHTML = coins;
  }

  set score(score) {
    this.prop.score = score;
    this.root.querySelector('#score').innerHTML = score;
  }

  bindEvents() {
    this.root
      .querySelector('#play')
      .addEventListener('click', () => this.prop.onPlayCallback());
    this.root
      .querySelector('#menu')
      .addEventListener('click', () => this.prop.onMenuCallback());
  }

  renderHTML() {
    this.root.innerHTML = `
            ${componentStyles}
            <div class="game-over">
                <div class="game-over-container">
                    <span class="game-over-title">
                        Game Over
                    </span>
                    <div class="score-container">
                        <span class="score-title">Score</span>
                        <div id="score" class="score-text">
                            0
                        </div>
                        <div class="coins-container">
                            <img src="assets/images/coin.png" height="18">
                            <div id="coins" class="coins-text">0</div>
                        </div>
                    </div>
                    <div class="action-container">
                        <div id="menu" class="action-btn">
                            <img src="assets/images/home.png" height="32">
                        </div>

                        <div id="play" class="action-btn">
                            <img src="assets/images/play.png" height="32">
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  static get observedAttributes() {
    return ['onPlayCallback', 'onMenuCallback', 'score', 'coins'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'score':
        this.score = newValue;
        break;
      case 'coins':
        this.coins = newValue;
        break;
      case 'onPlayCallback':
        this.onPlayCallback = newValue;
        break;
      case 'onMenuCallback':
        this.onMenuCallback = newValue;
        break;
    }
  }
}

customElements.define('game-over', GameOver);
