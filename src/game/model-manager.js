import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { cloneDeep } from 'lodash';
import { GameModels } from './data/game-models';

export class ModelManager {
  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  async loadAllModels() {
    const assetPath = 'assets/models/';

    this.models = cloneDeep(GameModels);
    for (let key of Object.keys(this.models)) {
      let model = this.models[key];
      if (model instanceof Array) {
        for (let r = 0; r < model.length; r++) {
          if (model[r] instanceof Array) {
            for (let c = 0; c < model[r].length; c++) {
              model[r][c] = await this.loadOBJ(assetPath + model[r][c]);
            }
          } else {
            model[r] = await this.loadOBJ(assetPath + model[r]);
          }
        }
      } else {
        model = await this.loadOBJ(assetPath + model);
      }

      this.models[key] = model;
    }
  }

  loadOBJ(objPath) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        objPath,
        object => {
          object.scene.castShadow = true;

          object.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material.metalness = 0;
              child.material.roughness = 0;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          return resolve(object);
        },
        () => {},
        error => {
          return reject(error);
        }
      );
    });
  }
}
