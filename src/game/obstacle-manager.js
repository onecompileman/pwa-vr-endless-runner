import { MathUtils, Vector3, Box3Helper } from 'three';
import { PowerUpType } from './enums/power-up-type';
import { ObstacleType } from './enums/obstacle-type';
import { PowerUp } from './game-objects/power-up';
import { Obstacle } from './game-objects/obstacle';
import { getRandomItem } from '../utils/random-item';

export class ObstacleManager {
  constructor(objectPoolManager, player) {
    this.objectPoolManager = objectPoolManager;

    this.player = player;
    // Probability numbers
    this.coinChance = 15;
    this.coinRangeChance = [5, 9];
    this.coinsToAdd = 0;
    this.coinsPerTile = 4;
    this.lastCoinColumn = 0;

    this.heartChance = this.starChance = 5;

    this.obstacleChance = 25;
    this.obstacleChances = {
      1: 75, // 75% chance to generate 1 obstacle
      2: 18, // 18% chance to generate 2 obstacles
      3: 7 // 7% chance to generate 3 obstacles
    };
    this.maxObstacleChance = 65;
    this.maxObstaclesChances = {
      1: 35,
      2: 38,
      3: 27
    };

    this.distanceFromPlayer = -24.1;
    this.distance = -13.6;
    this.tileRowXPosition = [-2, 0, 1.7];

    // 3 x 7 matrix to contain blueprint
    this.obstacleMatrix = [];
    this.powerUps = [];
    this.obstacles = [];

    this.onPlayerCollidesToPowerUp = () => {};
    this.onPlayerCollidesToObstacle = () => {};
  }

  reset() {
    this.obstacleMatrix = this.obstacleMatrix.filter(row => {
      // Dispose the allocation
      row.columns.forEach(col => {
        if (col instanceof Array) {
          col.forEach(item => {
            if (item) {
              this.freeObject(item.objectPool);
            }
          });
        } else {
          if (col) {
            this.freeObject(col.objectPool);
          }
        }
      });

      return false;
    });
  }

  canGenerate() {
    const lastRow = this.obstacleMatrix[this.obstacleMatrix.length - 1];

    if (!lastRow) {
      return true;
    } else {
      return (
        this.player.object.position.z +
          this.distanceFromPlayer -
          lastRow.positionZ <=
        this.distance
      );
    }
  }

  generateObstacle() {
    let row = [null, null, null];

    const positionZ = this.player.object.position.z + this.distanceFromPlayer;

    if (this.coinsToAdd <= 0) {
      const isGenerateCoins = MathUtils.randInt(0, 100) <= this.coinChance;
      if (isGenerateCoins) {
        const [min, max] = this.coinRangeChance;
        this.coinsToAdd = MathUtils.randInt(min, max);
      }
    }

    if (this.coinsToAdd) {
      row = this.generateCoin(row, positionZ);
    }

    // const isGenerateHeart = MathUtils.randInt(0, 100) <= this.heartChance;

    // if (isGenerateHeart) {
    //   const remainingIndexes = row.reduce(
    //     (acc, r, i) => (r === null ? [...acc, i] : acc),
    //     []
    //   );
    //   const heartIndex = getRandomItem(remainingIndexes);
    //   const heartObject = this.getObjectPoolPowerUp(PowerUpType.HEART);
    //   const heartPosition = new Vector3(
    //     this.tileRowXPosition[heartIndex],
    //     1,
    //     positionZ
    //   );
    //   const heart = new PowerUp(heartObject, heartPosition, PowerUpType.HEART);
    //   row[heartIndex] = heart;
    // }

    // const isGenerateStar = MathUtils.randInt(0, 100) <= this.starChance;
    // if (isGenerateStar) {
    //   const remainingIndexes = row.reduce(
    //     (acc, r, i) => (r === null ? [...acc, i] : acc),
    //     []
    //   );
    //   const starIndex = getRandomItem(remainingIndexes);
    //   const starObject = this.getObjectPoolPowerUp(PowerUpType.STAR);
    //   const starPosition = new Vector3(
    //     this.tileRowXPosition[starIndex],
    //     1,
    //     positionZ
    //   );
    //   const star = new PowerUp(starObject, starPosition, PowerUpType.STAR);
    //   row[starIndex] = star;
    // }

    const remainingIndexes = row.reduce(
      (acc, r, i) => (r === null ? [...acc, i] : acc),
      []
    );

    // Generate actual obstacles
    if (remainingIndexes.length) {
      const chance = MathUtils.randInt(0, 100);

      const numberOfObstacles = this.getNumberOfObstaclesFromPercentage(chance);

      const numberOfObstaclesToCreate =
        numberOfObstacles <= remainingIndexes.length
          ? numberOfObstacles
          : remainingIndexes.length;

      for (let i = 0; i < numberOfObstaclesToCreate; i++) {
        const obstacleIndex = MathUtils.randInt(0, remainingIndexes.length - 1);

        // Remove Index
        const remainingIndex = remainingIndexes.splice(obstacleIndex, 1);

        let forceJumpObstacle = false;

        if (
          numberOfObstaclesToCreate === 3 &&
          i === numberOfObstaclesToCreate - 1
        ) {
          forceJumpObstacle = row
            .filter(r => r)
            .every(r => {
              return r && !r.canJump;
            });
        }

        const obstacleType = forceJumpObstacle
          ? this.getRandomCanJumpObstacleType()
          : this.getRandomObstacleType();

        const obstacleObject = this.getObjectPoolObstacle(obstacleType);

        const obstaclePosition = new Vector3(
          this.tileRowXPosition[remainingIndex],
          0.8,
          positionZ
        );

        const obstacle = new Obstacle(
          obstacleObject,
          obstaclePosition,
          obstacleType,
          this.isCanJumpObstacleType(obstacleType)
        );

        // this.objectPoolManager.scene.add(
        //   new Box3Helper(obstacle.bBox, 0xff3333)
        // );

        row[remainingIndex] = obstacle;
      }
    }

    this.obstacleMatrix.push({
      positionZ,
      columns: row
    });
  }

  update(deltaTime) {
    this.obstacleMatrix.forEach(row => {
      row.columns.forEach(col => {
        if (col instanceof Array) {
          col.forEach(item => {
            if (item instanceof PowerUp) {
              item.update(deltaTime);
            }

            if (item) {
              // Check if game object collides to player
              this.checkObjectCollidesToPlayer(item);
            }
          });
        } else {
          if (col) {
            this.checkObjectCollidesToPlayer(col);
          }
          if (col instanceof PowerUp) {
            col.update(deltaTime);
          }
        }
      });
    });

    if (this.canGenerate()) {
      this.generateObstacle();
    }

    this.returnOffCameraObjects();
  }

  returnOffCameraObjects() {
    this.obstacleMatrix = this.obstacleMatrix.filter(rowObject => {
      // Game object is outside the player's field of vision
      if (rowObject.positionZ > this.player.object.position.z + 7) {
        // Dispose the allocation
        rowObject.columns.forEach(col => {
          if (col instanceof Array) {
            col.forEach(item => {
              if (item) {
                this.freeObject(item.objectPool);
              }
            });
          } else {
            if (col) {
              this.freeObject(col.objectPool);
            }
          }
        });

        return false;
      }

      return true;
    });
  }

  freeObject(objectPool) {
    this.objectPoolManager.free(objectPool.name, objectPool.index);
  }

  checkObjectCollidesToPlayer(object) {
    if (!object.collided && this.player.bBox.intersectsBox(object.bBox)) {
      if (object instanceof Obstacle) {
        this.onPlayerCollidesToObstacle();
      } else {
        this.freeObject(object.objectPool);
        this.onPlayerCollidesToPowerUp();

        object.collided = true;
      }
    }
  }

  getRandomObstacleType() {
    return ObstacleType[getRandomItem(Object.keys(ObstacleType))];
  }

  getRandomCanJumpObstacleType() {
    return getRandomItem([ObstacleType.CRATE, ObstacleType.SPIKE]);
  }

  isCanJumpObstacleType(obstacleType) {
    return [ObstacleType.CRATE, ObstacleType.SPIKE].includes(obstacleType);
  }

  getNumberOfObstaclesFromPercentage(percentage) {
    let minPercentage = 0;

    for (let obstacleCount of Object.keys(this.obstacleChances)) {
      const obstaclePercentage =
        minPercentage + this.obstacleChances[obstacleCount] - 1;

      if (minPercentage >= percentage && percentage <= obstaclePercentage) {
        return obstacleCount;
      } else {
        minPercentage += obstaclePercentage;
      }
    }
  }

  generateCoin(row, positionZ) {
    const coinNextColumn = MathUtils.clamp(
      this.lastCoinColumn + getRandomItem([-1, 1]),
      0,
      2
    );

    this.lastCoinColumn = coinNextColumn;

    const coinsToAdd =
      this.coinsToAdd >= this.coinsPerTile
        ? this.coinsPerTile
        : this.coinsToAdd;
    this.coinsToAdd -= this.coinsPerTile;

    const coins = [];

    for (let i = 0; i < coinsToAdd; i++) {
      const coinObjectPool = this.getObjectPoolPowerUp(PowerUpType.COIN);

      const coinPosition = new Vector3(
        this.tileRowXPosition[this.lastCoinColumn],
        1,
        positionZ - 1.5 * i
      );

      const coin = new PowerUp(coinObjectPool, coinPosition, PowerUpType.COIN);

      coins.push(coin);
    }

    row[this.lastCoinColumn] = coins;
    return row;
  }

  getObjectPoolObstacle(type) {
    switch (type) {
      case ObstacleType.CRATE:
        return this.objectPoolManager.allocate('crate');

      case ObstacleType.SPIKE:
        return this.objectPoolManager.allocate('spikeGroup');

      case ObstacleType.TREE:
        return this.objectPoolManager.allocate(
          `tree${MathUtils.randInt(1, 2)}`
        );
    }
  }

  getObjectPoolPowerUp(type) {
    switch (type) {
      case PowerUpType.COIN:
        return this.objectPoolManager.allocate('coin');

      case PowerUpType.HEART:
        return this.objectPoolManager.allocate('heart');

      case PowerUpType.STAR:
        return this.objectPoolManager.allocate('star');
    }
  }

  resetObstacles() {
    this.obstacleChance = 25;

    this.obstacleChances = {
      1: 75, // 75% chance to generate 1 obstacle
      2: 18, // 18% chance to generate 2 obstacles
      3: 7 // 7% chance to generate 3 obstacles
    };
  }
}
