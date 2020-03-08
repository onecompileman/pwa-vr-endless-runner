import { MathUtils, Vector3 } from 'three';
import { Cloud } from './game-objects/cloud';

export class CloudManager {
  constructor(objectPoolManager, player, cloudsCount) {
    this.objectPoolManager = objectPoolManager;
    this.player = player;
    this.cloudsCount = cloudsCount;
    this.clouds = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.cloudsCount; i++) {
      this.generateCloud(true);
    }
  }

  // Range of x1 = -4 to -2.4, x2 = 2.4 to 4, z = 10 - 30, y 3 - 7

  generateCloud(init = false) {
    // 1 Left, 2 Right
    const side = MathUtils.randInt(1, 2);

    const x =
      side === 1
        ? MathUtils.randFloat(-6.5, -3.5)
        : MathUtils.randFloat(3.5, 6.5);
    const y = MathUtils.randFloat(2, 13);
    const z = MathUtils.randFloat(-30, -1);

    const addZ = init ? 0 : -20;
    const cloudPosition = new Vector3(
      x,
      y,
      this.player.object.position.z + z + addZ
    );

    const cloudType = MathUtils.randFloat(1, 3);

    const cloudObject = this.getCloudObject(cloudType);

    const cloud = new Cloud(cloudObject, cloudPosition);

    this.clouds.push(cloud);
  }

  updateClouds() {
    this.clouds = this.clouds.filter(cloud => {
      if (cloud.object.position.z > this.player.object.position.z + 7) {
        const { name, index } = cloud.objectPool;
        this.objectPoolManager.free(name, index);
        return false;
      }
      return true;
    });

    const cloudCountDifference = this.cloudsCount - this.clouds.length;
    for (let i = 0; i < cloudCountDifference; i++) {
      this.generateCloud();
    }
  }

  getCloudObject(type) {
    switch (type) {
      case 1:
        return this.objectPoolManager.allocate('cloud1');
      case 2:
        return this.objectPoolManager.allocate('cloud2');
      case 3:
        return this.objectPoolManager.allocate('cloud3');
      default:
        return this.objectPoolManager.allocate('cloud1');
    }
  }
}
