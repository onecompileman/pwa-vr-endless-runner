import { Box3 } from 'three';

export class PowerUp {
  constructor(objectPool, position, type) {
    this.objectPool = objectPool;
    this.object = objectPool.object;
    this.object.position.copy(position);
    this.type = type;
    this.bBox = new Box3().setFromObject(this.object);
    this.rotationSpeed = 0.5;
  }

  update(deltaTime) {
    this.object.rotation.y += this.rotationSpeed * deltaTime;
  }
}
