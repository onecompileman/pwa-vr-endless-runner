import { Box3 } from 'three';

export class Obstacle {
  constructor(objectPool, position, type, canJump = false) {
    this.objectPool = objectPool;
    this.object = objectPool.object;
    this.object.position.copy(position);
    this.bBox = new Box3().setFromObject(this.object);
    this.type = type;
    this.canJump = canJump;
  }
}
