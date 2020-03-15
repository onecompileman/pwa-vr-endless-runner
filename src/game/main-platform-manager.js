import { MainPlatform } from './game-objects/platform';
import { Vector3 } from 'three';

export class MainPlatformManager {
  constructor(scene, objectPoolManager, platformCount) {
    this.scene = scene;
    this.objectPoolManager = objectPoolManager;
    this.platformCount = platformCount;
    this.mainPlatforms = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.platformCount; i++) {
      this.generateMainPlatform();
    }
  }

  reset() {
    this.mainPlatforms = this.mainPlatforms.filter(mainPlatform => {
      Object.keys(mainPlatform).forEach(platformName => {
        const objectPoolInstance = mainPlatform[platformName].objectPool;

        this.objectPoolManager.free(
          objectPoolInstance.name,
          objectPoolInstance.index
        );
      });

      return false;
    });
  }

  updateMainPlatforms(playerZLocation) {
    this.mainPlatforms = this.mainPlatforms.filter(mainPlatform => {
      const position = mainPlatform.platform1.object.position;
      // free object pool if player has already passed the main platform
      if (position.z > playerZLocation + 7) {
        Object.keys(mainPlatform).forEach(platformName => {
          const objectPoolInstance = mainPlatform[platformName].objectPool;
          this.objectPoolManager.free(
            objectPoolInstance.name,
            objectPoolInstance.index
          );
        });
        return false;
      }
      return true;
    });

    const missingPlatformCount = this.platformCount - this.mainPlatforms.length;

    for (let i = 0; i < missingPlatformCount; i++) {
      this.generateMainPlatform();
    }
  }

  generateMainPlatform() {
    const platformTopCenter = this.objectPoolManager.allocate(
      'platformTopCenter'
    );
    const platformBottomCenter = this.objectPoolManager.allocate(
      'platformBottomCenter'
    );
    const platformTopLeft = this.objectPoolManager.allocate('platformTopLeft');
    const platformBottomLeft = this.objectPoolManager.allocate(
      'platformBottomLeft'
    );
    const platformTopRight = this.objectPoolManager.allocate(
      'platformTopRight'
    );
    const platformBottomRight = this.objectPoolManager.allocate(
      'platformBottomRight'
    );

    const lastMainPlatform =
      this.mainPlatforms[this.mainPlatforms.length - 1] || null;
    const lastMainPlatformZ = lastMainPlatform
      ? lastMainPlatform.platform1.object.position.z - 1.8
      : -0.8;

    const platform1 = new MainPlatform(
      platformTopCenter,
      new Vector3(0, -0.85, lastMainPlatformZ)
    );
    const platform2 = new MainPlatform(
      platformBottomCenter,
      new Vector3(0, -1.85, lastMainPlatformZ)
    );
    const platform3 = new MainPlatform(
      platformTopLeft,
      new Vector3(-2, -0.85, lastMainPlatformZ)
    );
    const platform4 = new MainPlatform(
      platformBottomLeft,
      new Vector3(-2, -1.85, lastMainPlatformZ)
    );
    const platform5 = new MainPlatform(
      platformTopRight,
      new Vector3(2, -0.85, lastMainPlatformZ)
    );
    const platform6 = new MainPlatform(
      platformBottomRight,
      new Vector3(2, -1.85, lastMainPlatformZ)
    );

    const mainPlatformGroup = {
      platform1,
      platform2,
      platform3,
      platform4,
      platform5,
      platform6
    };

    this.mainPlatforms.push(mainPlatformGroup);
  }
}
