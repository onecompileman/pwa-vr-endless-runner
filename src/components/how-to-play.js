import { checkIfMobile } from '../utils/check-if-mobile';

const componentStyles = `
    <style>
        .how-to-play {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            font-family: Arial;
            background-color: rgba(0,0,0,0.3);
            padding: 10px;
            color: white;
        }

        .top-bar {
            display: flex;
            width: 100%; 
            justify-content: flex-end;
        }

        .how-to-play-container {
            margin-bottom: 100px;
        }

        .swipe-up-text {
            font-size: 16px;
        }

        .swipe-up-container {
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .instruction-arrow-up {
            height: 40px;
            width: 0;
            border: 2px dashed rgba(255, 255, 255, 0.7);
        }

        .instruction-arrow-left,
        .instruction-arrow-right {
            height: 0;
            width: 30px;
            border: 2px dashed rgba(255, 255, 255, 0.7);
        }

        .move-horizontal-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        .move-horizontal-text {
            margin-top: 5px;
            font-size: 16px;
        }

        #close {
            font-size: 28px;
            cursor: pointer;
        }
        
        .key-box {
            padding: 5px;
            font-size: 16px;
            letter-spacing: 2px;
            border: 1px solid white;
            margin: 3px;
            background-color: rgba(0, 0, 0, 0.5);
        }

    </style>
`;
export class HowToPlay extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      onCloseCallback: () => {}
    };
    this.renderHTML();
    this.bindEvents();
  }

  get onCloseCallback() {
    return this.prop.onCloseCallback;
  }

  set onCloseCallback(onCloseCallback) {
    this.prop.onCloseCallback = onCloseCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#close')
      .addEventListener('click', () => this.prop.onCloseCallback());
  }

  renderHTML() {
    if (checkIfMobile()) {
      this.root.innerHTML = `
            ${componentStyles}
            <div class="how-to-play">
                <div class="top-bar">
                    <span id="close">
                        X
                    </span>
                </div>
                <div class="how-to-play-container">
                    <div class="swipe-up-container">
                        <div class="swipe-up-text">
                            Swipe up to Jump
                        </div>
                        <img src="assets/images/pointer.png" height="70">
                        <div class="instruction-arrow-up">
                        </div>
                    </div>

                    <div class="move-horizontal-container">
                        <img src="assets/images/left.png" height="40">
                        <div class="instruction-arrow-left">
                        </div>

                        <img class="instuction-pointer" src="assets/images/pointer.png" height="70">

                        <div class="instruction-arrow-right">
                        </div>
                        <img src="assets/images/right.png" height="40">
                    </div>
                    <div class="move-horizontal-text">
                        Drag the player to move left or right
                    </div>
                </div>
            </div>
        `;
    } else {
      this.root.innerHTML = `
            ${componentStyles}
            <div class="how-to-play">
                <div class="top-bar">
                    <span id="close">
                        X
                    </span>
                </div>
                <div class="how-to-play-container">
                    <div class="swipe-up-container">
                        <div class="swipe-up-text">
                            Press <b>spacebar</b> to Jump
                        </div>
                        <div class="key-box">
                            SPACE
                        </div>
                        <div class="instruction-arrow-up">
                        </div>
                    </div>

                    <div class="move-horizontal-container">
                        <img src="assets/images/left.png" height="40">
                        <div class="instruction-arrow-left">
                        </div>

                        <div class="key-box">
                            A
                        </div>

                        <div class="key-box">
                            D
                        </div>

                        <div class="instruction-arrow-right">
                        </div>
                        <img src="assets/images/right.png" height="40">
                    </div>
                    <div class="move-horizontal-text">
                       Press <b>A</b> or <b>D</b> to move left or right 
                    </div>
                </div>
            </div>
        `;
    }
  }

  static get observedAttributes() {
    return ['onCloseCallback'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onCloseCallback':
        this.onCloseCallback = newValue;
        break;
    }
  }
}

customElements.define('how-to-play', HowToPlay);

/*
    
*/
