const componentStyles = `
    <style>
        .pause {
            height: 100%;
            width: 100%;
            background-color: rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .pause-container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

        .pause-title {
            font-family: Arial;
            font-size: 36px;
            color: #ffffff;
        }

        .action-container {
            margin-top: 50px;
            display: flex;
            justify-content: center;
        }

        .action-button {
            margin-left: 25px;
            height: 64px;
            width: 64px;
            border-radius: 100%;  
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        #play {
            background-color: #F15A24;
        }

        #exit {
            background-color: #35EC24;
        }
    </style>
`;
export class Pause extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      onPlayCallback: () => {},
      onExitCallback: () => {}
    };
    this.renderHTML();
    this.bindEvents();
  }

  get onPlayCallback() {
    return this.prop.onPlayCallback;
  }

  get onExitCallback() {
    return this.prop.onExitCallback;
  }

  set onPlayCallback(onPlayCallback) {
    this.prop.onPlayCallback = onPlayCallback;
  }

  set onExitCallback(onExitCallback) {
    this.prop.onExitCallback = onExitCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#play')
      .addEventListener('click', () => this.prop.onPlayCallback());
    this.root
      .querySelector('#exit')
      .addEventListener('click', () => this.prop.onExitCallback());
  }

  renderHTML() {
    this.root.innerHTML = `
            ${componentStyles}
            <div class="pause">
                <div class="pause-container">
                    <div class="pause-title">
                    Game Paused
                    </div>
                    <div class="action-container">
                     <div id="play" class="action-button">
                            <img src="assets/images/play.png" height="42">
                        </div>
                        <div id="exit" class="action-button">
                            <img id="exit" src="assets/images/exit.png" height="42">
                        </div>

                       
                    </div>
                </div>
            </div>  
        `;
  }

  static get observedAttributes() {
    return ['onPlayCallback', 'onExitCallback'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onPlayCallback':
        this.onPlayCallback = newValue;
        break;
      case 'onExitCallback':
        this.onExitCallback = newValue;
        break;
    }
  }
}

customElements.define('pause-screen', Pause);
