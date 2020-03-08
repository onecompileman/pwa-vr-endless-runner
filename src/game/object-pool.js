import { cloneGltf } from '../utils/clone-gltf';
import { Vector3 } from 'three';

export class ObjectPool {
  constructor(name, object, poolSize, scene) {
    this.name = name;
    this.objectPoolSceneLocation = new Vector3(0, 0, 20);
    this.object = cloneGltf(object).scene;
    this.scene = scene;
    this.initObjectPool(poolSize);
  }

  initObjectPool(poolSize) {
    this.objectPools = Array(poolSize)
      .fill(1)
      .map((n, i) => {
        const clonedObject = this.getCopyOfObject();
        clonedObject.position.copy(this.objectPoolSceneLocation);
        // add to scene the object pool
        this.scene.add(clonedObject);
        return {
          index: i,
          name: this.name,
          object: clonedObject,
          allocated: false
        };
      });
  }

  getCopyOfObject() {
    return cloneGltf(this.object).scene;
  }

  allocate() {
    const objectToAllocate = this.objectPools.find(object => !object.allocated);

    if (objectToAllocate) {
      objectToAllocate.allocated = true;
      return objectToAllocate;
    }

    // Object pool size exceeded, create a new object and return it to the user
    const newObjectPool = {
      index: this.objectPools.length,
      name: this.name,
      object: this.getCopyOfObject(),
      allocated: true
    };
    newObjectPool.object.position.copy(this.objectPoolSceneLocation);
    this.scene.add(newObjectPool.object); // add to scene the object pool
    this.objectPools.push(newObjectPool);

    return newObjectPool;
  }

  free(index) {
    const objectToFree = this.objectPools.find(
      object => object.index === index
    );
    if (objectToFree) {
      objectToFree.allocated = false;
      objectToFree.object.position.copy(this.objectPoolSceneLocation);
    }
  }

  disposeAll() {
    this.objectPools.forEach(objectPool => {
      this.scene.remove(objectPool.object);
    });
  }
}
