class MultiplicationGame {
    constructor() {
        // Game state
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.timeLeft = 60;
        this.gameStarted = false;
        this.timer = null;
        this.currentProblem = null;
        this.soundEnabled = true;

        // DOM Elements
        this.elements = {
            factor1: document.getElementById('factor1'),
            factor2: document.getElementById('factor2'),
            product: document.getElementById('product'),
            answer: document.getElementById('answer'),
            submit: document.getElementById('submit'),
            message: document.getElementById('message'),
            score: document.getElementById('score'),
            timer: document.getElementById('timer'),
            streak: document.getElementById('streak'),
            startButton: document.getElementById('startButton'),
            restartButton: document.getElementById('restartButton'),
            startScreen: document.getElementById('startScreen'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            finalScore: document.getElementById('finalScore'),
            bestStreak: document.getElementById('bestStreak')
        };

        // Event Listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.elements.startButton.addEventListener('click', () => this.startGame());
        this.elements.restartButton.addEventListener('click', () => this.restartGame());
        this.elements.submit.addEventListener('click', () => this.checkAnswer());
        
        // Handle Enter key press
        this.elements.answer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });

        // Handle number input validation
        this.elements.answer.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value && (isNaN(value) || value < 1 || value > 144)) {
                e.target.value = value.slice(0, -1);
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.gameStarted) {
                this.endGame();
            }
        });
    }

    startGame() {
        this.gameStarted = true;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.timeLeft = 60;
        
        this.elements.startScreen.classList.add('hidden');
        this.updateStats();
        this.generateProblem();
        this.startTimer();
        this.elements.answer.focus();

        // Add active game class to container
        document.querySelector('.game-container').classList.add('game-active');
    }

    restartGame() {
        this.elements.gameOverScreen.classList.add('hidden');
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
            hiddenFactor: hideFirst ? factor1 : factor2,
            startTime: Date.now()
        };

        this.elements.factor1.textContent = hideFirst ? '?' : factor1;
        this.elements.factor2.textContent = hideFirst ? factor2 : '?';
        this.elements.product.textContent = product;
        this.elements.answer.value = '';

        // Add animation class
        this.elements.product.classList.add('pop');
        setTimeout(() => this.elements.product.classList.remove('pop'), 300);
    }

    checkAnswer() {
        if (!this.gameStarted) return;

        const userAnswer = parseInt(this.elements.answer.value);
        if (isNaN(userAnswer)) {
            this.showMessage('Please enter a number!', 'wrong');
            return;
        }

        const timeTaken = (Date.now() - this.currentProblem.startTime) / 1000;
        let points = 10;

        if (userAnswer === this.currentProblem.hiddenFactor) {
            // Bonus points for quick answers
            if (timeTaken < 3) points += 5;
            if (timeTaken < 2) points += 5;

            // Streak bonus
            this.streak++;
            this.bestStreak = Math.max(this.streak, this.bestStreak);
            points *= Math.min(this.streak, 5); // Cap streak multiplier at 5x

            this.score += points;
            this.showMessage(`Correct! +${points} points`, 'correct');
            this.generateProblem();
        } else {
            this.streak = 0;
            this.score = Math.max(0, this.score - 5);
            this.showMessage('Wrong! Try again (-5 points)', 'wrong');
            
            // Shake effect on wrong answer
            this.elements.answer.classList.add('shake');
            setTimeout(() => this.elements.answer.classList.remove('shake'), 500);
        }

        this.updateStats();
        this.elements.answer.value = '';
        this.elements.answer.focus();
    }

    showMessage(text, type) {
        this.elements.message.textContent = text;
        this.elements.message.className = `message ${type}`;
        
        // Add pop animation
        this.elements.message.classList.add('pop');
        setTimeout(() => this.elements.message.classList.remove('pop'), 300);
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateStats();
            
            // Warning animation when time is running low
            if (this.timeLeft <= 10) {
                this.elements.timer.classList.add('warning');
            }
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.timer);
        this.gameStarted = false;
        
        // Update final stats
        this.elements.finalScore.textContent = this.score;
        this.elements.bestStreak.textContent = this.bestStreak;
        
        // Show game over screen with animation
        this.elements.gameOverScreen.classList.remove('hidden');
        setTimeout(() => {
            document.querySelector('.game-over-content').classList.add('show');
        }, 100);

        // Remove active game class
        document.querySelector('.game-container').classList.remove('game-active');
    }

    updateStats() {
        this.elements.score.textContent = this.score;
        this.elements.timer.textContent = this.timeLeft;
        this.elements.streak.textContent = this.streak;

        // Update streak color based on value
        const streakElement = this.elements.streak;
        streakElement.className = 'streak';
        if (this.streak >= 5) streakElement.classList.add('gold');
        else if (this.streak >= 3) streakElement.classList.add('silver');
        else if (this.streak >= 1) streakElement.classList.add('bronze');
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new MultiplicationGame();
}); 