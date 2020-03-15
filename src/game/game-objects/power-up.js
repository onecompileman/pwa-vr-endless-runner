import { Box3, Vector3 } from 'three';

export class PowerUp {
  constructor(objectPool, position, type) {
    this.objectPool = objectPool;
    this.object = objectPool.object;
    this.position = position.clone();
    this.object.position.copy(position);
    this.type = type;
    this.bBox = new Box3().setFromObject(this.object);
    this.collided = false;
    this.rotationSpeed = 100;
  }

  update(deltaTime) {
    this.object.rotation.y += this.rotationSpeed * deltaTime;
  }
}
