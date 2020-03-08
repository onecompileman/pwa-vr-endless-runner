import { ObjectPool } from './object-pool';

export class ObjectPoolManager {
  constructor(scene) {
    this.scene = scene;

    this.objectPools = {};
  }

  createPool(name, object, size) {
    const newObjectPool = new ObjectPool(name, object, size, this.scene);

    this.objectPools[name] = newObjectPool;
  }

  deletePool(name) {
    //  Dispose and remove object pool to the scene
    if (this.objectPools.hasOwnProperty(name)) {
      this.objectPools[name].disposeAll();
      // Delete object reference
      delete this.objectPools[name];
    }
  }

  allocate(name) {
    return this.objectPools[name].allocate();
  }

  free(name, index) {
    this.objectPools[name].free(index);
  }
}
