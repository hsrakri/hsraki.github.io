class MaddleGame {
    constructor() {
        this.MAX_ATTEMPTS = 6;
        this.DIGITS_PER_NUMBER = 2;
        this.currentAttempt = 0;
        this.currentPosition = 0;
        this.gameOver = false;
        this.stats = this.loadStats();
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        // Generate target numbers and their product
        this.generateTargetNumbers();
        
        // Initialize UI elements
        this.equationDisplay = document.querySelector('.equation-display');
        this.messageDisplay = document.querySelector('.message');
        this.guessGrid = document.querySelector('.guess-grid');
        this.keyboard = document.querySelector('.keyboard');
        
        // Display the product
        this.equationDisplay.textContent = `Product: ${this.targetProduct}`;
        
        // Create the guess grid
        this.createGuessGrid();
        
        // Create the keyboard
        this.createKeyboard();
        
        // Update statistics display
        this.updateStats();
    }

    generateTargetNumbers() {
        // Generate two random 2-digit numbers
        this.number1 = Math.floor(Math.random() * 90) + 10;
        this.number2 = Math.floor(Math.random() * 90) + 10;
        this.targetProduct = this.number1 * this.number2;
        
        console.log(`Debug - Numbers: ${this.number1}, ${this.number2}, Product: ${this.targetProduct}`);
    }

    createGuessGrid() {
        this.guessGrid.innerHTML = '';
        for (let i = 0; i < this.MAX_ATTEMPTS; i++) {
            const row = document.createElement('div');
            row.className = 'guess-row';
            
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'guess-cell';
                row.appendChild(cell);
            }
            
            this.guessGrid.appendChild(row);
        }
    }

    createKeyboard() {
        const keyboardLayout = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['⌫', '0', '↵']
        ];

        this.keyboard.innerHTML = '';
        keyboardLayout.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';
            
            row.forEach(key => {
                const button = document.createElement('button');
                button.className = 'key';
                button.textContent = key;
                
                if (key === '⌫') {
                    button.className += ' backspace-key';
                } else if (key === '↵') {
                    button.className += ' submit-key';
                }
                
                keyboardRow.appendChild(button);
            });
            
            this.keyboard.appendChild(keyboardRow);
        });
    }

    setupEventListeners() {
        // Keyboard clicks
        this.keyboard.addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                this.handleKeyPress(e.target.textContent);
            }
        });

        // Physical keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                this.handleKeyPress(e.key);
            } else if (e.key === 'Backspace') {
                this.handleKeyPress('⌫');
            } else if (e.key === 'Enter') {
                this.handleKeyPress('↵');
            }
        });
    }

    handleKeyPress(key) {
        if (this.gameOver) return;

        if (key >= '0' && key <= '9') {
            this.handleNumberInput(key);
        } else if (key === '⌫') {
            this.handleBackspace();
        } else if (key === '↵') {
            this.handleSubmit();
        }
    }

    handleNumberInput(number) {
        if (this.currentPosition < 4) {
            const currentRow = this.guessGrid.children[this.currentAttempt];
            const cell = currentRow.children[this.currentPosition];
            cell.textContent = number;
            cell.classList.add('filled');
            this.currentPosition++;
        }
    }

    handleBackspace() {
        if (this.currentPosition > 0) {
            this.currentPosition--;
            const currentRow = this.guessGrid.children[this.currentAttempt];
            const cell = currentRow.children[this.currentPosition];
            cell.textContent = '';
            cell.classList.remove('filled');
        }
    }

    handleSubmit() {
        if (this.currentPosition !== 4) {
            this.showMessage('Please enter two 2-digit numbers', 'shake');
            return;
        }

        const currentRow = this.guessGrid.children[this.currentAttempt];
        const guess1 = parseInt(currentRow.children[0].textContent + currentRow.children[1].textContent);
        const guess2 = parseInt(currentRow.children[2].textContent + currentRow.children[3].textContent);
        
        if (isNaN(guess1) || isNaN(guess2) || guess1 < 10 || guess2 < 10) {
            this.showMessage('Invalid numbers. Use two 2-digit numbers.', 'shake');
            return;
        }

        const guessProduct = guess1 * guess2;
        this.checkGuess(guess1, guess2, currentRow);
        
        if (guessProduct === this.targetProduct) {
            this.handleWin();
        } else {
            this.currentAttempt++;
            this.currentPosition = 0;
            
            if (this.currentAttempt >= this.MAX_ATTEMPTS) {
                this.handleLoss();
            } else {
                this.showMessage(`Try again! Your product: ${guessProduct}`);
            }
        }
    }

    checkGuess(guess1, guess2, row) {
        const cells = Array.from(row.children);
        const guess1Str = guess1.toString().padStart(2, '0');
        const guess2Str = guess2.toString().padStart(2, '0');
        const target1Str = this.number1.toString();
        const target2Str = this.number2.toString();

        // Check first number
        if (guess1 === this.number1 || guess1 === this.number2) {
            cells[0].classList.add('correct');
            cells[1].classList.add('correct');
        } else {
            cells[0].classList.add('incorrect');
            cells[1].classList.add('incorrect');
        }

        // Check second number
        if (guess2 === this.number1 || guess2 === this.number2) {
            cells[2].classList.add('correct');
            cells[3].classList.add('correct');
        } else {
            cells[2].classList.add('incorrect');
            cells[3].classList.add('incorrect');
        }

        // Add wrong-position class for partial matches
        if (guess1 * guess2 === this.targetProduct && 
            !(guess1 === this.number1 && guess2 === this.number2) &&
            !(guess1 === this.number2 && guess2 === this.number1)) {
            cells.forEach(cell => {
                cell.classList.remove('incorrect');
                cell.classList.add('wrong-position');
            });
        }
    }

    handleWin() {
        this.gameOver = true;
        this.showMessage('Congratulations! You won!', 'bounce');
        this.updateStatsForWin();
    }

    handleLoss() {
        this.gameOver = true;
        this.showMessage(`Game Over! The numbers were ${this.number1} and ${this.number2}`);
        this.updateStatsForLoss();
    }

    showMessage(message, animationClass = '') {
        this.messageDisplay.textContent = message;
        if (animationClass) {
            this.messageDisplay.classList.add(animationClass);
            setTimeout(() => {
                this.messageDisplay.classList.remove(animationClass);
            }, 300);
        }
    }

    loadStats() {
        const defaultStats = {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            bestStreak: 0
        };
        
        const savedStats = localStorage.getItem('maddleStats');
        return savedStats ? JSON.parse(savedStats) : defaultStats;
    }

    saveStats() {
        localStorage.setItem('maddleStats', JSON.stringify(this.stats));
        this.updateStats();
    }

    updateStatsForWin() {
        this.stats.gamesPlayed++;
        this.stats.gamesWon++;
        this.stats.currentStreak++;
        this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.currentStreak);
        this.saveStats();
    }

    updateStatsForLoss() {
        this.stats.gamesPlayed++;
        this.stats.currentStreak = 0;
        this.saveStats();
    }

    updateStats() {
        document.getElementById('games-played').textContent = this.stats.gamesPlayed;
        document.getElementById('games-won').textContent = this.stats.gamesWon;
        document.getElementById('current-streak').textContent = this.stats.currentStreak;
        document.getElementById('best-streak').textContent = this.stats.bestStreak;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MaddleGame();
}); 