import { MathUtils, Vector3 } from 'three';
import { PowerUpType } from './enums/power-up-type';
import { ObstacleType } from './enums/obstacle-type';
import { PowerUp } from './game-objects/power-up';
import { Obstacle } from './game-objects/obstacle';

export class ObstacleManager {
  constructor(objectPoolManager, player) {
    this.objectPoolManager = objectPoolManager;
    this.player = player;
    // Probability numbers
    this.coinChance = 10;
    this.coinRangeChance = [3, 7];
    this.coinsToAdd = 0;
    this.coinsPerTile = 2;
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
    this.distanceFromPlayer = -34.1;
    this.distance = -3.6;
    this.tileRowXPosition = [-2, 0, 2];
    // 3 x 7 matrix to contain blueprint
    this.obstacleMatrix = [];
    this.powerUps = [];
    this.obstacles = [];
  }

  init() {}

  generateObstacle() {
    const row = [null, null, null];
    const positionZ = this.player.object.position.z + this.distanceFromPlayer;

    if (!this.coinsToAdd) {
      const isGenerateCoins = MathUtils.randInt(0, 100) <= this.coinChance;

      if (isGenerateCoins) {
        const [min, max] = this.coinRangeChance;
        this.coinsToAdd = MathUtils.randInt(min, max);
      }
    }

    if (this.coinsToAdd) {
      this.generateCoin(row);
    }

    const isGenerateHeart = MathUtils.random(0, 100) <= this.heartChance;

    if (isGenerateHeart) {
      const remainingIndexes = row.reduce(
        (acc, r, i) => (r === null ? [...acc, i] : acc),
        []
      );
      const heartIndex = getRandomItem(remainingIndexes);
      const heartObject = this.getObjectPoolPowerUp(PowerUpType.HEART);
      const heartPosition = new Vector3(
        this.tileRowXPosition[heartIndex],
        0,
        positionZ
      );
      const heart = new PowerUp(heartObject, heartPosition, PowerUpType.HEART);
      row[heartIndex] = heart;
    }

    const isGenerateStar = MathUtils.random(0, 100) <= this.starChance;
    if (isGenerateStar) {
      const remainingIndexes = row.reduce(
        (acc, r, i) => (r === null ? [...acc, i] : acc),
        []
      );
      const starIndex = getRandomItem(remainingIndexes);
      const starObject = this.getObjectPoolPowerUp(PowerUpType.STAR);
      const starPosition = new Vector3(
        this.tileRowXPosition[starIndex],
        0,
        positionZ
      );
      const star = new PowerUp(starObject, starPosition, PowerUpType.STAR);
      row[starIndex] = star;
    }

    const remainingIndexes = row.reduce(
      (acc, r, i) => (r === null ? [...acc, i] : acc),
      []
    );

    // Generate actual obstacles
    if (remainingIndexes.length) {
      const chance = MathUtils.randomInt(0, 100);
      const numberOfObstacles = this.getNumberOfObstaclesFromPercentage(chance);
      const numberOfObstaclesToCreate =
        numberOfObstacles < remainingIndexes.length
          ? numberOfObstacles
          : remainingIndexes.length;

      for (let i = 0; i < numberOfObstaclesToCreate; i++) {
        const obstacleIndex = getRandomItem(remainingIndexes);
        let forceJumpObstacle = false;
        if (numberOfObstaclesToCreate === 3) {
          forceJumpObstacle = row.every(r => !r.canJump);
        }
        const obstacleType = forceJumpObstacle
          ? this.getRandomCanJumpObstacleType()
          : this.getRandomObstacleType();
        const obstacleObject = this.getObjectPoolObstacle(obstacleType);
        const obstaclePosition = new Vector3(
          this.tileRowXPosition[obstacleIndex],
          0,
          positionZ
        );
        const obstacle = new Obstacle(
          obstacleObject,
          obstaclePosition,
          obstacleType,
          this.isCanJumpObstacleType(obstacleType)
        );

        row[obstacleIndex] = obstacle;
      }
    }

    this.obstacleMatrix.push(row);
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
    if (this.coinsToAdd >= 2) {
      this.coinsToAdd -= this.coinsPerTile;

      const coin1ObjectPool = this.getObjectPoolPowerUp(PowerUpType.COIN);
      const coin2ObjectPool = this.getObjectPoolPowerUp(PowerUpType.COIN);

      const coin1Position = new Vector3(
        this.tileRowXPosition[this.lastCoinColumn],
        0,
        positionZ
      );
      const coin2Position = new Vector3(
        this.tileRowXPosition[this.lastCoinColumn],
        0,
        positionZ - 1.8
      );

      const coin1 = new PowerUp(
        coin1ObjectPool,
        coin1Position,
        PowerUpType.COIN
      );
      const coin2 = new PowerUp(
        coin2ObjectPool,
        coin2Position,
        PowerUpType.COIN
      );

      row[this.lastCoinColumn] = [coin1, coin2];
    } else {
      this.coinsToAdd = 0;
      const coinObjectPool = this.getObjectPoolPowerUp(PowerUpType.COIN);

      const coinPosition = new Vector3(
        this.tileRowXPosition[this.lastCoinColumn],
        0,
        positionZ
      );

      const coin = new PowerUp(coinObjectPool, coinPosition, PowerUpType.COIN);
      row[this.lastCoinColumn] = coin;
    }
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
