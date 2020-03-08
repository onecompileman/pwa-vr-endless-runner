import { cloneGltf } from '../../utils/clone-gltf';
import { Vector3 } from 'three';

export class MainPlatform {
  constructor(objectPool, position) {
    this.objectPool = objectPool;
    this.object = objectPool.object;
    this.object.position.copy(position);
  }
}
