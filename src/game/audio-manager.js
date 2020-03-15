import { AudioLoader, AudioListener, Audio } from 'three';
import { SoundFiles } from './data/sound-files';

export class AudioManager {
  constructor(camera) {
    this.camera = camera;
    this.audioLoader = new AudioLoader();
    this.listener = new AudioListener();
    this.camera.add(this.listener);
  }

  async loadAllSoundFiles(loadingScreen) {
    const soundsPath = 'assets/sounds/';

    this.sounds = {};

    let progress = 0;

    loadingScreen.loadingProgress = 0;
    loadingScreen.loadingText = `Loading ${progress} out of ${
      Object.keys(SoundFiles).length
    } sounds`;

    for (let key of Object.keys(SoundFiles)) {
      this.sounds[key] = await this.loadSound(soundsPath + SoundFiles[key]);

      // Update loading indicator
      progress++;
      loadingScreen.loadingText = `Loading ${progress} out of ${
        Object.keys(SoundFiles).length
      } sounds`;
    }
  }

  playSound(key, volume = 0.5, loop = false) {
    const sound = this.sounds[key];
    if (sound.isPlaying) {
      sound.stop();
    }
    sound.setLoop(loop);
    sound.setVolume(volume);
    sound.play();
  }

  stopAllSounds() {
    Object.key(this.sounds).forEach(key => {
      if (this.sounds[key].isPlaying) {
        this.sounds[key].stop();
      }
    });
  }

  loadSound(path) {
    return new Promise((resolve, reject) => {
      this.audioLoader.load(path, buffer => {
        const audio = new Audio(this.listener);
        audio.setBuffer(buffer);

        return resolve(audio);
      });
    });
  }
}
