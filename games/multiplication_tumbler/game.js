class MultiplicationGame {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.timeLeft = 60;
        this.gameStarted = false;
        this.timer = null;
        this.currentProblem = null;

        // DOM Elements
        this.factor1Element = document.getElementById('factor1');
        this.factor2Element = document.getElementById('factor2');
        this.productElement = document.getElementById('product');
        this.answerInput = document.getElementById('answer');
        this.submitButton = document.getElementById('submit');
        this.messageElement = document.getElementById('message');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.streakElement = document.getElementById('streak');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');

        // Event Listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.submitButton.addEventListener('click', () => this.checkAnswer());
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }

    startGame() {
        this.gameStarted = true;
        this.score = 0;
        this.streak = 0;
        this.timeLeft = 60;
        this.startScreen.classList.add('hidden');
        this.updateStats();
        this.generateProblem();
        this.startTimer();
        this.answerInput.focus();
    }

    restartGame() {
        this.gameOverScreen.classList.add('hidden');
        this.startGame();
    }

    generateProblem() {
        const factor1 = Math.floor(Math.random() * 12) + 1;
        const factor2 = Math.floor(Math.random() * 12) + 1;
        const product = factor1 * factor2;
        
        // Randomly hide one of the factors
        const hideFirst = Math.random() < 0.5;
        
        this.currentProblem = {
            factor1,
            factor2,
            product,
            hiddenFactor: hideFirst ? factor1 : factor2
        };

        this.factor1Element.textContent = hideFirst ? '?' : factor1;
        this.factor2Element.textContent = hideFirst ? factor2 : '?';
        this.productElement.textContent = product;
        this.answerInput.value = '';
    }

    checkAnswer() {
        if (!this.gameStarted) return;

        const userAnswer = parseInt(this.answerInput.value);
        if (isNaN(userAnswer)) {
            this.showMessage('Please enter a number!', 'wrong');
            return;
        }

        if (userAnswer === this.currentProblem.hiddenFactor) {
            this.streak++;
            this.score += 10 * this.streak;
            this.showMessage(`Correct! +${10 * this.streak} points`, 'correct');
            this.generateProblem();
        } else {
            this.streak = 0;
            this.score = Math.max(0, this.score - 5);
            this.showMessage('Wrong! Try again (-5 points)', 'wrong');
        }

        this.updateStats();
        this.answerInput.value = '';
        this.answerInput.focus();
    }

    showMessage(text, type) {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
        setTimeout(() => {
            this.messageElement.textContent = '';
            this.messageElement.className = 'message';
        }, 2000);
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateStats();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.timer);
        this.gameStarted = false;
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('finalStreak').textContent = `Best Streak: ${this.streak}`;
        this.gameOverScreen.classList.remove('hidden');
    }

    updateStats() {
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.timerElement.textContent = `Time: ${this.timeLeft}`;
        this.streakElement.textContent = `Streak: ${this.streak}`;
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new MultiplicationGame();
}); 