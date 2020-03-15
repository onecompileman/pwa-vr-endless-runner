const componentStyles = `
    <style>
        .in-game-ui {
            display: flex;
            width: 100%;
            padding: 15px;
            justify-content: space-between;
        }

        .stats-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            font-family: Arial;
            font-size: 18px;
        }

        .score-container,
        .coins-container {
            display: flex;
            align-items: center;
            padding: 7px;
            border-radius: 3px;
            width: 110px;
            background-color: rgba(0,0,0,0.4);
        }

        #pause {
            height: 48px;
            width: 48px;
            border-radius: 100%;  
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            background-color: #F15A24;
        }

    </style>
`;

export class InGameUI extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      score: 0,
      coins: 0,
      onPauseCallback: () => {}
    };
    this.renderHTML();
    this.bindEvents();
  }

  get score() {
    return this.prop.score;
  }

  get coins() {
    return this.prop.coins;
  }

  get onPauseCallback() {
    return this.prop.onPauseCallback;
  }

  set score(score) {
    this.prop.score = score;
    this.root.querySelector('#score').innerHTML = score;
  }

  set coins(coins) {
    this.prop.coins = coins;
    this.root.querySelector('#coins').innerHTML = coins;
  }

  set onPauseCallback(onPauseCallback) {
    this.prop.onPauseCallback = onPauseCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#pause')
      .addEventListener('click', () => this.prop.onPauseCallback());
  }

  renderHTML() {
    this.root.innerHTML = `
            ${componentStyles}
            <div class="in-game-ui">
                <div id="pause">
                    <img src="assets/images/pause.png" height="32">
                </div>

                <div class="stats-container">
                    <div id="score" class="score-container">
                        Score: 0
                    </div>
                    <div class="coins-container">
                        <img src="assets/images/coin.png" height="24"> 
                        <span id="coins">
                            0
                        </span>
                    </div>
                </div>
            </div>
        `;
  }

  static get observedAttributes() {
    return ['score', 'coins', 'onPauseCallback'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'score':
        this.score = newValue;
        break;
      case 'coins':
        this.coins = newValue;
        break;
      case 'onPauseCallback':
        this.onPauseCallback = newValue;
        break;
    }
  }
}

customElements.define('in-game-ui', InGameUI);
