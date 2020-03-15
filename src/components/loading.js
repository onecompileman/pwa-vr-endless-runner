const componentStyles = `
    <style>
       .loading {
           width: 100%;
           height: 100%;
           display: flex;
           justify-content: center;
           align-items: center;
           background-color: #0078B9;
        }

        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 20px;
            width: 100%;
        }

        .progress-bar {
            width: 100%;
            height: 5px;
        }

        .progress-bar-thumb {
            height: 5px;
            width: 100%;
            background-color: #2ABEEF;
        }

        .loading-text {
            font-family: Arial;
            font-size: 16px;
            color: white;
        }

        .loading-title {
            font-family: Arial;
            font-size: 26px;
            color: #f0f0f0;
            margin-bottom: 15px;
        } 
    </style>
`;

export class Loading extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      loadingProgress: 100,
      loadingText: ''
    };
    this.renderHTML();
  }

  get loadingProgress() {
    return this.prop.loadingProgress;
  }

  get loadingText() {
    return this.prop.loadingText;
  }

  set loadingProgress(loadingProgress) {
    this.prop.loadingProgress = loadingProgress;
    this.root.querySelector(
      '#loadingProgress'
    ).style.width = `${loadingProgress}%`;
  }

  set loadingText(loadingText) {
    this.prop.loadingText = loadingText;
    this.root.querySelector('#loadingText').innerHTML = loadingText;
  }

  renderHTML() {
    this.root.innerHTML = `
            ${componentStyles}
            <div class="loading">
                <div class="loading-container">
                    <span class="loading-title">
                        Loading...
                    </span>
                    <img src="assets/images/loading.gif">
                    <div class="progress-bar">
                        <div id="loadingProgress" class="progress-bar-thumb">
                        </div>
                    </div>
                    
                    <span id="loadingText" class="loading-text"></span>
                </div>   
            </div>
        `;
  }

  static get observedAttributes() {
    return ['loadingProgress', 'loadingText'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'loadingProgress':
        this.loadingProgress = newValue;
        break;
      case 'loadingText':
        this.loadingText = newValue;
        break;
    }
  }
}

customElements.define('loading-screen', Loading);
