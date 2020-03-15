export class HighScoreService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('highScore')) {
      const highScoreObject = {
        score: 0,
        coins: 0
      };

      localStorage.setItem('highScore', JSON.stringify(highScoreObject));
    }
  }

  setHighScore(score, coins) {
    this.init();
    const highScore = this.getHighScore();
    // Check if new highscore
    if (highScore.score < score) {
      //Assign values to the highScore object
      highScore.score = score;
      highScore.coins = coins;
      // set new highscore
      localStorage.setItem('highScore', JSON.stringify(highScore));
    }
  }

  getHighScore() {
    this.init();
    return JSON.parse(localStorage.getItem('highScore'));
  }
}
