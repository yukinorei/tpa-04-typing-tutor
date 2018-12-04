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
    this.correctCharCount = 0;
    this.wrongCharCount = 0;
    this.targetText = null;
    this.hasGameEnded();
  }

  displayScore(correctChar, targetTotalCountCharCount) {
    const accuracyRate = Math.round((correctChar / targetTotalCountCharCount) * 100);
    console.log(`${accuracyRate}%正解`);
  }

  hasGameEnded(targetTotalCountCharCount) {
    return targetTotalCountCharCount === this.correctCharCount + this.wrongCharCount;
  }

  handleKeyStroke(key) {
    if (!this.isRoundInProgress) return;
    this.currentStrokeCount += 1;
    const targetChar = this.targetText[this.currentStrokeCount];
    if (key === targetChar) {
      this.correctCharCount += 1;
    } else {
      this.wrongCharCount += 1;
    }
    this.view.renderKeystroke(key, targetChar);
    const targetTotalCountCharCount = this.targetText.length;
    if (this.hasGameEnded(targetTotalCountCharCount)) {
      this.isRoundInProgress = false;
      this.displayScore(this.correctCharCount, targetTotalCountCharCount);
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
