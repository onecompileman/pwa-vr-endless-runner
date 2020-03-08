import {
  WebGLRenderer,
  sRGBEncoding,
  ReinhardToneMapping,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Scene,
  Clock,
  Vector3
} from 'three';
import { ModelManager } from './model-manager';
import { Player } from './game-objects/player';
import { ObjectPoolManager } from './object-pool-manager';
import { MainPlatform } from './game-objects/platform';
import { MainPlatformManager } from './main-platform-manager';
import { CloudManager } from './cloud-manager';

export class GameManager {
  constructor() {}

  async initPlay() {
    this.isPlaying = true;

    await this.initModelManager();

    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initLights();
    this.initPlayer();
    this.initObjectPoolManager();
    this.initMainPlatforms();
    this.initClouds();
    this.render();
    this.bindEvents();
  }

  async initModelManager() {
    this.modelManager = new ModelManager();
    await this.modelManager.loadAllModels();
  }

  initPlayer() {
    this.player = new Player(this.modelManager.models.player, this.canvas);
    this.playerSpeed = 3;
    this.player.setForwardSpeed(this.playerSpeed);
    this.scene.add(this.player.object);
    this.directionalLight.target = this.player.object;
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
    (this.ambientLight = new AmbientLight(0xffffff, 0.6)),
      (this.directionalLight = new DirectionalLight(0xf9f9f9, 0.8));
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight).add(this.ambientLight);
  }

  render() {
    requestAnimationFrame(() => this.render());
    if (this.isPlaying) {
      this.updatePlayer(this.clock.getDelta());
      this.mainPlatformManager.updateMainPlatforms(
        this.player.object.position.z
      );
      this.cloudManager.updateClouds();
      this.updateCamera();
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

  updateCamera() {
    this.camera.position.z = this.player.object.position.z + 7;
  }

  updatePlayer(deltaTime) {
    this.player.update(deltaTime);
  }
}
