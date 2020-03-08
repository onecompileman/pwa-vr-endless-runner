export class Cloud {
  constructor(objectPool, position) {
    this.objectPool = objectPool;
    this.object = objectPool.object;
    this.object.position.copy(position);
    this.position = position.clone();
  }
}
