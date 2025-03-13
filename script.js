class MartingaleSimulator {
  constructor() {
    this.balance = 100000;
    this.initialBalance = this.balance;
    this.maxBalance = this.balance;
    this.wins = 0;
    this.losses = 0;
    this.currentBet = 1000;
    this.initialBet = 1000;
    this.lossStreak = 0;
    this.totalLoss = 0;
    this.isAutoPlaying = false;
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    this.balanceEl = document.getElementById("balance");
    this.winsEl = document.getElementById("wins");
    this.lossesEl = document.getElementById("losses");
    this.maxBalanceEl = document.getElementById("maxBalance");
    this.betAmountEl = document.getElementById("betAmount");
    this.historyListEl = document.getElementById("historyList");
    this.autoPlayBtn = document.getElementById("autoPlay");
    this.resetBtn = document.getElementById("reset");
  }

  setupEventListeners() {
    document
      .getElementById("betRed")
      .addEventListener("click", () => this.placeBet("red"));
    document
      .getElementById("betBlack")
      .addEventListener("click", () => this.placeBet("black"));
    this.autoPlayBtn.addEventListener("click", () => this.toggleAutoPlay());
    this.resetBtn.addEventListener("click", () => this.reset());
    this.betAmountEl.addEventListener("change", () => {
      this.initialBet = parseInt(this.betAmountEl.value);
      this.currentBet = this.initialBet;
      this.lossStreak = 0;
      this.totalLoss = 0;
    });
  }

  calculateNextBet() {
    return this.initialBet * Math.pow(2, this.lossStreak);
  }

  placeBet(choice) {
    const nextBet = this.calculateNextBet();

    if (this.balance < nextBet) {
      alert("잔액이 부족합니다!");
      this.stopAutoPlay();
      return;
    }

    const result = Math.random() < 0.5 ? "red" : "black";
    const isWin = choice === result;

    if (isWin) {
      this.balance += nextBet;
      this.wins++;
      this.addHistoryItem(true, nextBet, this.totalLoss);
      // 승리시 초기화
      this.currentBet = this.initialBet;
      this.lossStreak = 0;
      this.totalLoss = 0;
    } else {
      this.balance -= nextBet;
      this.losses++;
      this.totalLoss += nextBet;
      this.lossStreak++;
      this.currentBet = this.calculateNextBet();
      this.addHistoryItem(false, nextBet, this.totalLoss);
    }

    if (this.balance > this.maxBalance) {
      this.maxBalance = this.balance;
    }

    this.updateUI();

    if (this.isAutoPlaying && this.balance >= this.currentBet) {
      setTimeout(() => this.placeBet(choice), 500);
    }
  }

  addHistoryItem(isWin, amount, totalLoss) {
    const item = document.createElement("div");
    item.className = `history-item ${isWin ? "win" : "lose"}`;
    const balanceChange = isWin
      ? `+${amount.toLocaleString()}`
      : `-${amount.toLocaleString()}`;
    const stage = this.lossStreak > 0 ? `(${this.lossStreak}단계)` : "";
    item.innerHTML = `
      <div class="history-result">${isWin ? "승리" : "패배"} ${stage}</div>
      <div class="history-amount">${amount.toLocaleString()}원</div>
      <div class="history-change ${
        isWin ? "positive" : "negative"
      }">${balanceChange}원 (누적 ${totalLoss.toLocaleString()}원)</div>
    `;
    this.historyListEl.insertBefore(item, this.historyListEl.firstChild);

    if (this.historyListEl.children.length > 50) {
      this.historyListEl.removeChild(this.historyListEl.lastChild);
    }
  }

  toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;
    this.autoPlayBtn.textContent = this.isAutoPlaying
      ? "자동 베팅 중지"
      : "자동 베팅";
    if (this.isAutoPlaying) {
      this.placeBet("red");
    }
  }

  stopAutoPlay() {
    this.isAutoPlaying = false;
    this.autoPlayBtn.textContent = "자동 베팅";
  }

  reset() {
    this.balance = this.initialBalance;
    this.maxBalance = this.balance;
    this.wins = 0;
    this.losses = 0;
    this.currentBet = this.initialBet;
    this.lossStreak = 0;
    this.totalLoss = 0;
    this.stopAutoPlay();
    this.historyListEl.innerHTML = "";
    this.updateUI();
  }

  updateUI() {
    this.balanceEl.textContent = this.balance.toLocaleString();
    this.winsEl.textContent = this.wins;
    this.lossesEl.textContent = this.losses;
    this.maxBalanceEl.textContent = this.maxBalance.toLocaleString();
    this.betAmountEl.value = this.initialBet;
  }
}

// 시뮬레이터 초기화
const simulator = new MartingaleSimulator();
