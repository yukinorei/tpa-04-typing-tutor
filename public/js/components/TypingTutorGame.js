import { fetchRandomQuote } from '../api-client.js';
import TypingTutorView from './TypingTutorView.js';

class TypingTutorGame {
  constructor() {
    this.isRoundInProgress = false;
    this.currentStrokeCount = -1;
    this.targetText = null;
  }

  init() {
    this.view = new TypingTutorView();
    this.view.registerStartRoundCallback(this.startRound.bind(this));
    this.view.registerHandleKeystrokeCallback(this.handleKeyStroke.bind(this));
    this.view.initDOMAndListeners();
  }

  startRound() {
    this.isRoundInProgress = true;
    this.currentStrokeCount = -1;
    this.initTargetText();
    this.correctChar = 0;
    this.wrongChar = 0;
    this.targetText = null;
  }

  displayScore(correctChar, targetTotalCountChar) {
    const accuracyRate = Math.round(correctChar / targetTotalCountChar * 100);
    console.log(`${accuracyRate}%正解`);
  }

  handleKeyStroke(key) {
    if (!this.isRoundInProgress) return;
    this.currentStrokeCount += 1;
    const targetChar = this.targetText[this.currentStrokeCount];
    if (key === targetChar) {
      this.correctChar += 1;
    } else {
      this.wrongChar += 1;
    }
    this.view.renderKeystroke(key, targetChar);
    const targetTotalCountChar = this.targetText.length;
    if (targetTotalCountChar === this.correctChar + this.wrongChar) {
      this.isRoundInProgress = false;
      this.displayScore(this.correctChar, targetTotalCountChar);
    }
  }

  initTargetText() {
    fetchRandomQuote()
      .then((quoteText) => {
        this.view.renderTargetText(quoteText);
        this.targetText = quoteText.split('');
      });
  }
}

export default TypingTutorGame;
