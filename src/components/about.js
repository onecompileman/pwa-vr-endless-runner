const componentStyles = `
    <style>
        .about {
            height: 100%;
            width: 100%;
            background-color: rgba(0,0,0,0.4);
        }

        .top-bar-container {
            display: flex;
            justify-content: flex-end;
            font-family: Arial;
            color: white;
            padding: 10px;
        }  

        .about-title {
            color: white;
            font-weight: bold;
            font-size: 24px;
        }

        #close {
            font-size: 28px;
            cursor: pointer;
        }

        .about-container {
            margin: 8px;
            margin-top: 30px;
            background-color: rgba(241, 90, 36, 0.8);
            color: white;
            font-size: 18px;
            font-family: Arial;
            padding: 15px;
            line-height: 30px;
        }

        a {
            color: white;
        }

    </style>
`;

export class About extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      onCloseCallback: () => {}
    };
    this.renderHTML();
    this.bindEvents();
  }

  set onCloseCallback(onCloseCallback) {
    this.prop.onCloseCallback = onCloseCallback;
  }

  get onCloseCallback() {
    return this.prop.onCloseCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#close')
      .addEventListener('click', () => this.prop.onCloseCallback());
  }

  renderHTML() {
    this.root.innerHTML = `
        ${componentStyles}
        <div class="about">
            <div class="top-bar-container">
               
                <span id="close">
                    X
                </span>
            </div>

            <div class="about-container">
                <span class="about-title">
                    About the Game
                </span>
                <p>
                This game is created by Stephen Vinuya 
                using Three.js, Web components, Workbox, Webpack and Hammer.js
                </p>
                <p>
                    3d models by: <a target="_blank" href="http://quaternius.com/?i=1">Quaternious</a> <br>
                    Github repo: <a target="_blank" href="https://github.com/onecompileman/pwa-vr-endless-runner">here</a>
                </p>


            </div>
        </div>
        `;
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

customElements.define('about-screen', About);
