import {
  Box3,
  Vector3,
  AnimationMixer,
  AnimationClip,
  LoopRepeat,
  LoopOnce,
  MathUtils,
  Box3Helper
} from 'three';
import * as Hammer from 'hammerjs';
import { PlayerStates } from '../enums/player-state';

export class Player {
  constructor(model, canvas) {
    this.canvas = canvas;
    this.clips = model.animations.map(animation => {
      animation.name = animation.name.split('_')[1] || animation.name;
      return animation;
    });
    this.object = model.scene;
    this.object.scale.set(0.6, 0.6, 0.6);
    this.object.position.set(0, 0, 0);
    this.bBox = new Box3().setFromObject(this.object);
    this.boxHelper = new Box3Helper(this.bBox);
    this.state = PlayerStates.CLAPPING;
    this.horizontalSpeed = 7;
    this.horizontalAccelerationSpeed = 0.01;
    this.horizontalAcceleration = 0.5;
    this.oldState = this.state;
    this.jumpForce = new Vector3(0, 0.3, 0);
    this.lastDeltaTime = 1;
    this.gravity = new Vector3(0, -1, 0);
    this.lastTouchX = null;
    this.velocity = new Vector3();
    this.forwardSpeed = 0;
    this.life = 3;
    this.onPlayerJumpListener = () => {};
    this.initAnimations();
    this.playAnimation();
    this.bindEvents();
  }

  initAnimations() {
    this.mixer = new AnimationMixer(this.object);
    const clip = AnimationClip.findByName(this.clips, this.state);
    this.action = this.mixer.clipAction(clip);
    this.action.play();
  }

  setForwardSpeed(forwardSpeed) {
    this.forwardSpeed = forwardSpeed;
  }

  bindEvents() {
    addEventListener('keyup', event => {
      switch (event.key) {
        case ' ':
          this.jump();
          break;
        case 'a':
        case 'd':
          this.velocity.x = 0;
          break;
      }
    });

    addEventListener('keydown', event => {
      switch (event.key) {
        case 'a':
          this.moveHorizontal(-this.horizontalSpeed, event.key);
          break;
        case 'd':
          this.moveHorizontal(this.horizontalSpeed, event.key);
          break;
      }
    });

    this.canvas.addEventListener('touchmove', event => {
      this.lastTouchX = event.targetTouches[0].clientX;
    });

    this.hammerEvent = new Hammer(this.canvas);
    this.hammerEvent.set({ enable: true });
    this.hammerEvent.add(
      new Hammer.Swipe({
        direction: Hammer.DIRECTION_ALL,
        threshold: 2,
        velocity: 0.2
      })
    );
    this.hammerEvent.on('swipeup', ev => this.jump());
  }

  moveHorizontalMobile() {
    if (this.checkIfJumpAvailable() && this.lastTouchX) {
      const moveToX = MathUtils.mapLinear(
        this.lastTouchX,
        35,
        this.canvas.clientWidth - 35,
        -2,
        2
      );
      this.object.position.x = MathUtils.lerp(
        this.object.position.x,
        moveToX,
        0.2
      );
      this.lastTouchX = null;
    }
  }

  moveHorizontal(speed, key) {
    if (this.lastKey !== key) {
      this.horizontalAccelerationSpeed = 0.4;
      this.lastKey = key;
    }

    if (this.checkIfJumpAvailable()) {
      this.velocity.x =
        speed * this.lastDeltaTime * this.horizontalAccelerationSpeed;
      this.horizontalAccelerationSpeed += this.horizontalAcceleration;
      this.horizontalAccelerationSpeed = MathUtils.clamp(
        this.horizontalAccelerationSpeed,
        0,
        1.5
      );
    }
  }

  jump() {
    if (this.checkIfJumpAvailable()) {
      this.velocity.add(this.jumpForce);
      this.onPlayerJumpListener();
    }
  }

  checkIfJumpAvailable() {
    return this.object.position.y === 0;
  }

  playAnimation(loop = LoopRepeat, clampWhenFinished = false) {
    if (this.state !== this.oldState) {
      if (this.action) {
        this.action.stop();
      }
      this.oldState = this.state;
      const clip = AnimationClip.findByName(this.clips, this.state);
      this.action = this.mixer.clipAction(clip);
      this.action.setLoop(loop);
      this.action.clampWhenFinished = clampWhenFinished;
      this.action.play();
    }
  }

  update(deltaTime) {
    this.lastDeltaTime = deltaTime;
    this.velocity.z = -this.forwardSpeed * deltaTime;
    this.object.position.add(this.velocity.clone());
    this.bBox.setFromObject(this.object);
    this.bBox.expandByVector(new Vector3(-0.6, -0.2, -0.4));

    this.mixer.update(deltaTime * 1.2);

    this.moveHorizontalMobile();

    this.clampPosition();

    if (this.object.position.y > 0) {
      this.velocity.add(this.gravity.clone().multiplyScalar(deltaTime));
    } else {
      this.velocity.multiplyScalar(0);
    }
  }

  clampPosition() {
    this.object.position.x = MathUtils.clamp(this.object.position.x, -2.4, 2.4);
    this.object.position.y = MathUtils.clamp(this.object.position.y, 0, 11);
  }
}
