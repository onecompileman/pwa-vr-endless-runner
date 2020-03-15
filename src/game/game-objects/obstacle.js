import { Box3, Vector3 } from 'three';
import { ObstacleType } from '../enums/obstacle-type';

export class Obstacle {
  constructor(objectPool, position, type, canJump = false) {
    this.objectPool = objectPool;
    this.object = objectPool.object;
    this.object.scale.set(0.7, 0.7, 0.7);
    this.object.position.copy(position);

    this.type = type;
    this.canJump = canJump;

    this.scaleDown();
    // Move Obstacle a little bit upwards
    if ([ObstacleType.SPIKE, ObstacleType.TREE].includes(type)) {
      this.object.position.y = -0.5;
    }

    this.object.position.x += 0.5;
    this.bBox = new Box3().setFromObject(this.object);
    if ([ObstacleType.SPIKE, ObstacleType.TREE].includes(type)) {
      this.bBox.expandByScalar(-0.3);
    }
  }

  scaleDown() {
    switch (this.type) {
      case ObstacleType.TREE:
        this.object.scale.set(0.4, 0.6, 0.6);
        break;
    }
  }
}
