import {
  WebGLRenderer,
  sRGBEncoding,
  ReinhardToneMapping,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Scene,
  Clock,
  Vector3,
  LoopOnce
} from 'three';
import { ModelManager } from './model-manager';
import { Player } from './game-objects/player';
import { ObjectPoolManager } from './object-pool-manager';
import { MainPlatform } from './game-objects/platform';
import { MainPlatformManager } from './main-platform-manager';
import { CloudManager } from './cloud-manager';
import { ObstacleManager } from './obstacle-manager';
import { PlayerStates } from './enums/player-state';
import { AudioManager } from './audio-manager';
import { ScreenManager } from './screen-manager';
import { GameScreens } from './enums/game-screens';
import { HighScoreService } from '../services/high-score-service';

export class GameManager {
  constructor() {}

  async init() {
    this.initScreenManager();
    this.initHighScoreService();

    const loadingScreen = this.screenManager.getScreen(GameScreens.LOADING);
    //  Show loading indicator first
    this.screenManager.showScreen(GameScreens.LOADING);

    await this.initModelManager(loadingScreen);

    this.initRenderer();
    this.initScene();
    this.initCamera();

    this.initLights();
    this.initPlayer();
    this.initObjectPoolManager();
    this.initMainPlatforms();
    this.initClouds();
    this.initObstacleManager();
    this.render();
    this.bindEvents();
    this.bindScreenEvents();

    await this.initAudioManager(loadingScreen);

    // After loading all game assets show Menu Screen
    this.screenManager.showScreen(GameScreens.MENU);
    this.audioManager.playSound('background', 0.3, true);
  }

  startGame() {
    this.scoreIncrement = 10;
    this.scoreIncrementTime = 200;
    // Clears score interval if there exists
    if (this.scoreInterval) {
      clearInterval(this.scoreInterval);
    }

    this.scoreInterval = setInterval(() => {
      if (this.isPlaying) {
        this.score += this.scoreIncrement;
      }
    }, this.scoreIncrementTime);

    this.player.object.rotation.y = Math.PI;
    this.player.state = PlayerStates.RUN;
    this.player.playAnimation();
  }

  resetGame() {
    this.score = 0;
    this.coins = 0;
    this.isPlaying = false;

    this.camera.position.z = 7;

    this.initPlayer();
    this.player.object.rotation.y = 0;

    this.obstacleManager.player = this.player;
    this.obstacleManager.reset();

    this.mainPlatformManager.reset();
    this.mainPlatformManager.init();
  }

  play() {
    this.isPlaying = true;

    this.player.state = PlayerStates.RUN;
    this.player.playAnimation();

    this.player.setForwardSpeed(this.playerSpeed);
  }

  pause() {
    this.isPlaying = false;

    this.player.state = PlayerStates.IDLE;
    this.player.playAnimation();
    // Stops the player's movement
    this.player.setForwardSpeed(0);
  }

  gameOver() {
    this.player.setForwardSpeed(0);
    this.player.state = PlayerStates.DEATH;
    this.player.playAnimation(LoopOnce, true);

    this.isPlaying = false;

    const gameOverScreen = this.screenManager.getScreen(GameScreens.GAME_OVER);

    // Show player scores
    gameOverScreen.score = this.score;
    gameOverScreen.coins = this.coins;

    this.screenManager.showScreen(GameScreens.GAME_OVER);
  }

  initScreenManager() {
    this.screenManager = new ScreenManager();
  }

  bindScreenEvents() {
    const menuScreen = this.screenManager.getScreen(GameScreens.MENU);
    const inGameUI = this.screenManager.getScreen(GameScreens.IN_GAME_UI);
    const gameOverScreen = this.screenManager.getScreen(GameScreens.GAME_OVER);
    const pauseScreen = this.screenManager.getScreen(GameScreens.PAUSE);

    menuScreen.onPlayCallback = () => {
      this.resetGame();
      this.startGame();
      this.play();

      this.screenManager.showScreen(GameScreens.IN_GAME_UI);
    };

    inGameUI.onPauseCallback = () => {
      this.pause();

      console.log('here');
      this.screenManager.showScreen(GameScreens.PAUSE);
    };

    gameOverScreen.onPlayCallback = () => {
      this.saveHighScore();

      this.resetGame();
      this.startGame();
      this.play();

      this.screenManager.showScreen(GameScreens.IN_GAME_UI);
    };

    gameOverScreen.onMenuCallback = () => {
      this.saveHighScore();

      this.resetGame();

      this.screenManager.showScreen(GameScreens.MENU);
    };

    pauseScreen.onPlayCallback = () => {
      this.play();

      this.screenManager.showScreen(GameScreens.IN_GAME_UI);
    };

    pauseScreen.onExitCallback = () => {
      this.resetGame();

      this.screenManager.showScreen(GameScreens.MENU);
    };
  }

  updateScreenManager() {
    const inGameUI = this.screenManager.getScreen(GameScreens.IN_GAME_UI);

    // Update player stats
    inGameUI.score = this.score;
    inGameUI.coins = this.coins;
  }

  async initModelManager(loadingScreen) {
    this.modelManager = new ModelManager();
    await this.modelManager.loadAllModels(loadingScreen);
  }

  async initAudioManager(loadingScreen) {
    this.audioManager = new AudioManager(this.camera);
    await this.audioManager.loadAllSoundFiles(loadingScreen);
    this.player.onPlayerJumpListener = () =>
      this.audioManager.playSound('jump', 0.6, false);
  }

  initHighScoreService() {
    this.highScore = new HighScoreService();

    this.initHighScoreScreen();
  }

  initHighScoreScreen() {
    const highScore = this.highScore.getHighScore();
    const highScoreScreen = this.screenManager.getScreen(
      GameScreens.HIGH_SCORE
    );

    highScoreScreen.score = highScore.score;
    highScoreScreen.coins = highScore.coins;
  }

  saveHighScore() {
    this.highScore.setHighScore(this.score, this.coins);

    this.initHighScoreScreen();
  }

  initPlayer() {
    this.player = new Player(this.modelManager.models.player, this.canvas);

    this.playerSpeed = 7;
    this.playerSpeedIncrement = 0.4;
    this.playerSpeedIncrementTime = 20000;

    // Clear playerSpeedInterval if its already set
    if (this.playerSpeedInterval) {
      clearInterval(this.playerSpeedInterval);
    }

    this.playerSpeedInterval = setInterval(() => {
      this.playerSpeed += this.playerSpeedIncrement;

      if (this.isPlaying) {
        this.player.setForwardSpeed(this.playerSpeed);
      }
    }, this.playerSpeedIncrementTime);

    // Add Player to scene
    // this.scene.add(this.player.boxHelper);
    this.scene.add(this.player.object);
  }

  initObjectPoolManager() {
    this.objectPoolManager = new ObjectPoolManager(this.scene);

    this.objectPoolManager.createPool(
      'platformTopCenter',
      this.modelManager.models.platforms[0][1].scene,
      30
    );

    this.objectPoolManager.createPool(
      'platformBottomCenter',
      this.modelManager.models.platforms[1][1].scene,
      30
    );
    this.objectPoolManager.createPool(
      'platformTopLeft',
      this.modelManager.models.platforms[0][0].scene,
      30
    );

    this.objectPoolManager.createPool(
      'platformBottomLeft',
      this.modelManager.models.platforms[1][0].scene,
      30
    );
    this.objectPoolManager.createPool(
      'platformTopRight',
      this.modelManager.models.platforms[0][2].scene,
      30
    );

    this.objectPoolManager.createPool(
      'platformBottomRight',
      this.modelManager.models.platforms[1][2].scene,
      30
    );

    this.objectPoolManager.createPool(
      'cloud1',
      this.modelManager.models.clouds[0].scene,
      5
    );

    this.objectPoolManager.createPool(
      'cloud2',
      this.modelManager.models.clouds[1].scene,
      5
    );

    this.objectPoolManager.createPool(
      'cloud3',
      this.modelManager.models.clouds[2].scene,
      5
    );

    this.objectPoolManager.createPool(
      'fence',
      this.modelManager.models.fence.scene,
      15
    );

    this.objectPoolManager.createPool(
      'coin',
      this.modelManager.models.coin.scene,
      30
    );

    this.objectPoolManager.createPool(
      'heart',
      this.modelManager.models.heart.scene,
      15
    );

    this.objectPoolManager.createPool(
      'tree1',
      this.modelManager.models.trees[0].scene,
      10
    );

    this.objectPoolManager.createPool(
      'tree2',
      this.modelManager.models.trees[1].scene,
      10
    );

    this.objectPoolManager.createPool(
      'spikeGroup',
      this.modelManager.models.spikeGroup.scene,
      10
    );

    this.objectPoolManager.createPool(
      'star',
      this.modelManager.models.star.scene,
      15
    );

    this.objectPoolManager.createPool(
      'crate',
      this.modelManager.models.crate.scene,
      15
    );
  }

  initClouds() {
    this.cloudManager = new CloudManager(
      this.objectPoolManager,
      this.player,
      10
    );
  }

  initMainPlatforms() {
    this.mainPlatformManager = new MainPlatformManager(
      this.scene,
      this.objectPoolManager,
      18
    );
  }

  initObstacleManager() {
    this.obstacleManager = new ObstacleManager(
      this.objectPoolManager,
      this.player
    );

    this.obstacleManager.onPlayerCollidesToPowerUp = () => {
      this.coins++;
      this.audioManager.playSound('coin', 0.2, false);
    };

    this.obstacleManager.onPlayerCollidesToObstacle = () => {
      this.gameOver();
      this.audioManager.playSound('gameOver', 0.4, false);
    };
  }

  initRenderer() {
    this.canvas = document.querySelector('#mainCanvas');
    this.renderer = new WebGLRenderer({ canvas: this.canvas });
    this.renderer.setClearColor(0xcceeff);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.gammaFactor = 2.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = ReinhardToneMapping;
  }

  initScene() {
    this.scene = new Scene();
    this.clock = new Clock();
  }

  initCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      80
    );
    this.camera.rotation.x = -0.2;
    this.camera.position.z = 7;
    this.camera.position.y = 5;
    this.scene.add(this.camera);
  }

  initLights() {
    (this.ambientLight = new AmbientLight(0xffffff, 0.8)),
      (this.directionalLight = new DirectionalLight(0xf9f9f9, 0.8));
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight).add(this.ambientLight);
  }

  updateLights() {
    this.directionalLight.position.z = this.player.object.position.z;
  }

  render() {
    requestAnimationFrame(() => this.render());
    if (this.isPlaying) {
      this.updatePlayer(this.clock.getDelta());

      this.mainPlatformManager.updateMainPlatforms(
        this.player.object.position.z
      );
      this.cloudManager.updateClouds();
      this.updateObstacleManager(this.clock.getDelta());
      this.updateLights();
      this.updateCamera();

      this.updateScreenManager();
    } else {
      this.updatePlayer(this.clock.getDelta());
    }
    this.renderer.render(this.scene, this.camera);
  }

  bindEvents() {
    addEventListener('resize', () => {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.camera.updateProjectionMatrix();
    });
  }

  updateObstacleManager(deltaTime) {
    this.obstacleManager.update(deltaTime);
  }

  updateCamera() {
    this.camera.position.z = this.player.object.position.z + 7;
  }

  updatePlayer(deltaTime) {
    this.player.update(deltaTime);
  }
}
