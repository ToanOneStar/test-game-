// Đất Nước Vươn Mình - Game Mê Cung Quiz
// Vietnamese Maze Quiz Game with Timer and Score History

class RisingNationMazeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found!');
        }
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Game constants
        this.MAZE_SIZE = 10;
        this.TILE_SIZE = 50;
        this.START_X = 0;
        this.START_Y = 9;
        this.GOAL_X = 9;
        this.GOAL_Y = 0;

        // Game state
        this.gameState = 'menu'; // 'menu', 'playing', 'gameOver', 'history'
        this.difficulty = null;
        this.timeLeft = 60;
        this.score = 0;
        this.gameRunning = false;
        this.keys = {};
        this.gameStartTime = null;
        this.timerInterval = null;
        this.completedTime = 0;
        this.showQuiz = false;
        this.currentQuestion = null;
        this.currentQuizTile = null;

        // Maze data
        this.maze = [];
        this.quizTiles = [];
        this.visitedQuizTiles = new Set();

        // Player
        this.player = {
            x: this.START_X,
            y: this.START_Y,
            size: 40,
            color: '#ff0000',
            state: 'normal' // 'normal', 'up', 'down', 'left', 'right'
        };

        // Character images
        this.characterImages = {
            normal: null,
            up: null,
            down: null,
            left: null,
            right: null
        };

        // Character state timer
        this.characterStateTimer = null;

        // Quiz questions database
        this.questions = [
            // Kinh tế
            {
                question: "Việt Nam gia nhập WTO vào năm nào?",
                options: ["2006", "2007", "2008"],
                answer: 1,
                category: "Kinh tế"
            },
            {
                question: "GDP Việt Nam năm 2023 tăng trưởng bao nhiêu phần trăm?",
                options: ["5.05%", "6.5%", "7.2%"],
                answer: 0,
                category: "Kinh tế"
            },
            {
                question: "Ngành nào đóng góp lớn nhất vào GDP Việt Nam?",
                options: ["Nông nghiệp", "Công nghiệp", "Dịch vụ"],
                answer: 2,
                category: "Kinh tế"
            },
            {
                question: "Việt Nam có bao nhiêu tỉnh thành?",
                options: ["62", "63", "64"],
                answer: 1,
                category: "Kinh tế"
            },

            // Chuyển đổi số
            {
                question: "Chương trình chuyển đổi số quốc gia bắt đầu từ năm nào?",
                options: ["2019", "2020", "2021"],
                answer: 1,
                category: "Chuyển đổi số"
            },
            {
                question: "Ứng dụng nào được sử dụng phổ biến nhất cho thanh toán số?",
                options: ["Momo", "ZaloPay", "ViettelPay"],
                answer: 0,
                category: "Chuyển đổi số"
            },
            {
                question: "Chính phủ số có mục tiêu gì?",
                options: ["Tăng hiệu quả quản lý", "Giảm chi phí", "Cả hai"],
                answer: 2,
                category: "Chuyển đổi số"
            },
            {
                question: "Blockchain được ứng dụng trong lĩnh vực nào?",
                options: ["Tài chính", "Y tế", "Cả hai"],
                answer: 2,
                category: "Chuyển đổi số"
            },

            // Văn hóa
            {
                question: "Di sản văn hóa phi vật thể nào của Việt Nam được UNESCO công nhận?",
                options: ["Ca trù", "Quan họ", "Cả hai"],
                answer: 2,
                category: "Văn hóa"
            },
            {
                question: "Lễ hội nào lớn nhất Việt Nam?",
                options: ["Hội Gióng", "Hội Lim", "Hội Chùa Hương"],
                answer: 0,
                category: "Văn hóa"
            },
            {
                question: "Nghệ thuật múa rối nước có nguồn gốc từ đâu?",
                options: ["Đồng bằng Bắc Bộ", "Đồng bằng Nam Bộ", "Trung Bộ"],
                answer: 0,
                category: "Văn hóa"
            },
            {
                question: "Áo dài được coi là trang phục truyền thống từ thế kỷ nào?",
                options: ["XVIII", "XIX", "XX"],
                answer: 1,
                category: "Văn hóa"
            },

            // Khoa học - Công nghệ
            {
                question: "Việt Nam phóng vệ tinh đầu tiên vào năm nào?",
                options: ["2008", "2012", "2013"],
                answer: 0,
                category: "Khoa học - Công nghệ"
            },
            {
                question: "Trung tâm vũ trụ Việt Nam đặt ở đâu?",
                options: ["Hà Nội", "TP.HCM", "Nha Trang"],
                answer: 0,
                category: "Khoa học - Công nghệ"
            },
            {
                question: "AI được ứng dụng nhiều nhất trong lĩnh vực nào?",
                options: ["Y tế", "Giáo dục", "Cả hai"],
                answer: 2,
                category: "Khoa học - Công nghệ"
            },
            {
                question: "5G được triển khai thương mại từ năm nào?",
                options: ["2020", "2021", "2022"],
                answer: 1,
                category: "Khoa học - Công nghệ"
            },

            // Môi trường
            {
                question: "Việt Nam cam kết đạt Net Zero vào năm nào?",
                options: ["2050", "2060", "2070"],
                answer: 0,
                category: "Môi trường"
            },
            {
                question: "Năng lượng tái tạo chiếm bao nhiêu % tổng sản lượng điện?",
                options: ["25%", "30%", "35%"],
                answer: 0,
                category: "Môi trường"
            },
            {
                question: "Dự án điện gió lớn nhất Việt Nam ở đâu?",
                options: ["Bạc Liêu", "Sóc Trăng", "Cà Mau"],
                answer: 0,
                category: "Môi trường"
            },
            {
                question: "Rừng che phủ Việt Nam đạt bao nhiêu %?",
                options: ["42%", "45%", "48%"],
                answer: 0,
                category: "Môi trường"
            },

            // Lịch sử Việt Nam
            {
                question: "Ngày Quốc khánh Việt Nam là ngày nào?",
                options: ["2/9/1945", "30/4/1975", "19/8/1945"],
                answer: 0,
                category: "Lịch sử Việt Nam"
            },
            {
                question: "Vị vua nào thống nhất đất nước?",
                options: ["Lê Lợi", "Quang Trung", "Gia Long"],
                answer: 2,
                category: "Lịch sử Việt Nam"
            },
            {
                question: "Chiến thắng Điện Biên Phủ diễn ra năm nào?",
                options: ["1953", "1954", "1955"],
                answer: 1,
                category: "Lịch sử Việt Nam"
            },
            {
                question: "Hiệp định Paris được ký kết năm nào?",
                options: ["1972", "1973", "1974"],
                answer: 1,
                category: "Lịch sử Việt Nam"
            }
        ];

        this.setupEventListeners();
        this.loadCharacterImages();
        this.init();
    }

    init() {
        this.showMainMenu();
    }

    showMainMenu() {
        document.getElementById('historyScreen').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'block';

        // Reset difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.style.opacity = '1';
        });
    }

    loadCharacterImages() {
        const imageStates = ['normal', 'up', 'down', 'left', 'right'];
        let loadedCount = 0;
        
        imageStates.forEach(state => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === imageStates.length) {
                    console.log('All character images loaded successfully');
                }
            };
            img.onerror = () => {
                console.error(`Failed to load character image: male/${state}.png`);
            };
            img.src = `male/${state}.png`;
            this.characterImages[state] = img;
        });
    }

    resetCharacterState() {
        // Clear existing timer
        if (this.characterStateTimer) {
            clearTimeout(this.characterStateTimer);
        }
        
        // Set timer to reset to normal state after 200ms
        this.characterStateTimer = setTimeout(() => {
            this.player.state = 'normal';
        }, 200);
    }

    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDifficulty(e.target.dataset.difficulty);
            });
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                // Handle quiz answers first
                if (e.key >= '1' && e.key <= '3' && this.showQuiz) {
                    this.answerQuestion(parseInt(e.key) - 1);
                    return;
                }

                // Prevent default behavior for game keys
                if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key.toLowerCase())) {
                    e.preventDefault();
                }

                // ESC to exit
                if (e.key === 'Escape') {
                    this.gameRunning = false;
                    this.showGameOver();
                    return;
                }

                // Handle movement - only move once per key press
                this.handleMovement(e.key);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.gameState === 'playing') {
                const keyLower = e.key.toLowerCase();
                this.keys[keyLower] = false;
            }
        });
    }

    selectDifficulty(difficulty) {
        this.difficulty = difficulty;

        // Update button styles
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.style.opacity = '0.5';
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).style.opacity = '1';

        // Set time based on difficulty
        switch (difficulty) {
            case 'easy':
                this.timeLeft = 60;
                break;
            case 'medium':
                this.timeLeft = 45;
                break;
            case 'hard':
                this.timeLeft = 30;
                break;
        }

        // Show instructions popup directly
        this.showInstructions();
    }

    generateMaze() {
        // Initialize maze with paths
        this.maze = [];
        for (let y = 0; y < this.MAZE_SIZE; y++) {
            this.maze[y] = [];
            for (let x = 0; x < this.MAZE_SIZE; x++) {
                this.maze[y][x] = 0; // 0 = path, 1 = wall
            }
        }

        // Create a simple maze with some walls
        this.createSimpleMaze();

        // Ensure start and goal are accessible
        this.maze[this.START_Y][this.START_X] = 0;
        this.maze[this.GOAL_Y][this.GOAL_X] = 0;

        // Place quiz tiles randomly
        this.placeQuizTiles();
    }

    createSimpleMaze() {
        // Create some walls in the maze
        for (let y = 0; y < this.MAZE_SIZE; y++) {
            for (let x = 0; x < this.MAZE_SIZE; x++) {
                // Create walls randomly but ensure paths exist
                if (Math.random() < 0.3 && !(x === this.START_X && y === this.START_Y) && !(x === this.GOAL_X && y === this.GOAL_Y)) {
                    this.maze[y][x] = 1; // Wall
                }
            }
        }

        // Ensure there's a path from start to goal
        this.ensurePath();
    }

    ensurePath() {
        // Create a simple path from start to goal
        let x = this.START_X;
        let y = this.START_Y;

        // Move right first
        while (x < this.GOAL_X) {
            this.maze[y][x] = 0;
            x++;
        }

        // Then move up
        while (y > this.GOAL_Y) {
            this.maze[y][x] = 0;
            y--;
        }
    }

    divideMaze(x, y, width, height) {
        if (width < 3 || height < 3) return;

        // Choose orientation
        const horizontal = height > width;

        if (horizontal) {
            // Create horizontal wall
            const wallY = y + Math.floor(Math.random() * (height - 2)) + 1;
            for (let i = x; i < x + width; i++) {
                this.maze[wallY][i] = 1;
            }

            // Create passage
            const passageX = x + Math.floor(Math.random() * width);
            this.maze[wallY][passageX] = 0;

            // Recursively divide
            this.divideMaze(x, y, width, wallY - y);
            this.divideMaze(x, wallY + 1, width, height - (wallY - y) - 1);
        } else {
            // Create vertical wall
            const wallX = x + Math.floor(Math.random() * (width - 2)) + 1;
            for (let i = y; i < y + height; i++) {
                this.maze[i][wallX] = 1;
            }

            // Create passage
            const passageY = y + Math.floor(Math.random() * height);
            this.maze[passageY][wallX] = 0;

            // Recursively divide
            this.divideMaze(x, y, wallX - x, height);
            this.divideMaze(wallX + 1, y, width - (wallX - x) - 1, height);
        }
    }

    placeQuizTiles() {
        this.quizTiles = [];
        const numQuizTiles = 5; // Place 5 quiz tiles for 10x10 map

        for (let i = 0; i < numQuizTiles; i++) {
            let attempts = 0;
            let x, y;

            do {
                x = Math.floor(Math.random() * this.MAZE_SIZE);
                y = Math.floor(Math.random() * this.MAZE_SIZE);
                attempts++;
            } while (
                (this.maze[y][x] === 1) ||
                (x === this.START_X && y === this.START_Y) ||
                (x === this.GOAL_X && y === this.GOAL_Y) ||
                this.quizTiles.some(tile => tile.x === x && tile.y === y) ||
                attempts > 100
            );

            if (attempts <= 100) {
                this.quizTiles.push({ x, y, answered: false });
            }
        }
    }


    showInstructions() {
        // Hide main menu and show instructions
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('instructionsPopup').style.display = 'flex';
    }

    closeInstructions() {
        // Hide instructions and go back to main menu
        document.getElementById('instructionsPopup').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'block';
        
        // Reset difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.style.opacity = '1';
        });
        // Don't reset difficulty - keep it for when user clicks "Bắt đầu chơi"
    }

    startGameFromInstructions() {
        if (!this.difficulty) {
            alert('Vui lòng chọn độ khó trước khi bắt đầu chơi!');
            return;
        }
        
        this.gameState = 'playing';
        this.gameRunning = true;
        this.score = 0;
        this.visitedQuizTiles.clear();
        this.gameStartTime = Date.now();
        this.completedTime = 0;

        // Reset timer based on difficulty
        switch(this.difficulty) {
            case 'easy':
                this.timeLeft = 60;
                break;
            case 'medium':
                this.timeLeft = 45;
                break;
            case 'hard':
                this.timeLeft = 30;
                break;
            default:
                this.timeLeft = 60;
        }

        // Update timer display
        document.getElementById('timer').textContent = this.timeLeft;
        document.getElementById('score').textContent = this.score;

        // Generate new maze
        this.generateMaze();

        // Reset player position
        this.player.x = this.START_X;
        this.player.y = this.START_Y;

        // Hide instructions, show game
        document.getElementById('instructionsPopup').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';

        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Start timer
        this.startTimer();

        // Start game loop
        this.gameLoop();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            document.getElementById('score').textContent = this.score;

            if (this.timeLeft <= 0) {
                this.showGameOver();
            }
        }, 1000);
    }

    handleMovement(key) {
        if (!this.gameRunning || this.showQuiz) return;

        let newX = this.player.x;
        let newY = this.player.y;
        let moved = false;

        // Check each direction - only one direction per key press
        if (key.toLowerCase() === 'w' || key === 'ArrowUp') {
            newY -= 1;
            this.player.state = 'up';
            this.resetCharacterState();
            moved = true;
        } else if (key.toLowerCase() === 's' || key === 'ArrowDown') {
            newY += 1;
            this.player.state = 'down';
            this.resetCharacterState();
            moved = true;
        } else if (key.toLowerCase() === 'a' || key === 'ArrowLeft') {
            newX -= 1;
            this.player.state = 'left';
            this.resetCharacterState();
            moved = true;
        } else if (key.toLowerCase() === 'd' || key === 'ArrowRight') {
            newX += 1;
            this.player.state = 'right';
            this.resetCharacterState();
            moved = true;
        }

        // Only move if a key is pressed and the new position is valid
        if (moved) {
            if (newX >= 0 && newX < this.MAZE_SIZE &&
                newY >= 0 && newY < this.MAZE_SIZE &&
                this.maze[newY][newX] === 0) {

                this.player.x = newX;
                this.player.y = newY;

                // Check for goal
                if (newX === this.GOAL_X && newY === this.GOAL_Y) {
                    this.completedTime = this.getDifficultyTime() - this.timeLeft;
                    this.showGameOver(true);
                    return;
                }

                // Check for quiz tiles
                this.checkQuizTile();
            }
        }
    }

    update() {
        // Game loop now only handles rendering, movement is handled by keydown events
        // This ensures movement only happens once per key press
    }

    checkQuizTile() {
        const currentTile = this.quizTiles.find(tile =>
            tile.x === this.player.x && tile.y === this.player.y && !tile.answered
        );

        if (currentTile) {
            this.showQuiz = true;
            this.currentQuizTile = currentTile;
            this.showQuizPopup();
        }
    }

    showQuizPopup() {
        // Get random question
        const randomQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
        this.currentQuestion = randomQuestion;

        // Show popup
        document.getElementById('quizQuestion').textContent = randomQuestion.question;

        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = '';

        randomQuestion.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionDiv.addEventListener('click', () => this.answerQuestion(index));
            optionsContainer.appendChild(optionDiv);
        });

        document.getElementById('quizPopup').style.display = 'flex';
    }

    answerQuestion(optionIndex) {
        if (!this.currentQuestion || !this.currentQuizTile) return;

        const isCorrect = optionIndex === this.currentQuestion.answer;

        if (isCorrect) {
            this.score += 10;
            this.currentQuizTile.answered = true;
            this.visitedQuizTiles.add(`${this.currentQuizTile.x},${this.currentQuizTile.y}`);
            this.playSound('correct');
        } else {
            this.timeLeft = Math.max(0, this.timeLeft - 5);
            this.playSound('wrong');
        }

        // Hide quiz popup
        document.getElementById('quizPopup').style.display = 'none';
        this.showQuiz = false;
        this.currentQuestion = null;
        this.currentQuizTile = null;
    }

    playSound(type) {
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'correct') {
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        } else if (type === 'wrong') {
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        }

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw maze
        for (let y = 0; y < this.MAZE_SIZE; y++) {
            for (let x = 0; x < this.MAZE_SIZE; x++) {
                const screenX = x * this.TILE_SIZE;
                const screenY = y * this.TILE_SIZE;

                if (this.maze[y][x] === 1) {
                    // Wall - màu trắng
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.fillRect(screenX, screenY, this.TILE_SIZE, this.TILE_SIZE);
                } else {
                    // Path - màu đen
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillRect(screenX, screenY, this.TILE_SIZE, this.TILE_SIZE);
                }
            }
        }

        // Draw start tile
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(this.START_X * this.TILE_SIZE, this.START_Y * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);

        // Draw goal tile
        this.ctx.fillStyle = '#f39c12';
        this.ctx.fillRect(this.GOAL_X * this.TILE_SIZE, this.GOAL_Y * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);

        // Draw quiz tiles
        this.quizTiles.forEach(tile => {
            const screenX = tile.x * this.TILE_SIZE;
            const screenY = tile.y * this.TILE_SIZE;

            if (tile.answered) {
                this.ctx.fillStyle = '#2ecc71'; // Green for answered
            } else {
                this.ctx.fillStyle = '#0066ff'; // Bright blue for unanswered
            }
            this.ctx.fillRect(screenX, screenY, this.TILE_SIZE, this.TILE_SIZE);
        });

        // Draw player character image
        const playerScreenX = this.player.x * this.TILE_SIZE + (this.TILE_SIZE - this.player.size) / 2;
        const playerScreenY = this.player.y * this.TILE_SIZE + (this.TILE_SIZE - this.player.size) / 2;

        // Get current character image based on state
        const currentImage = this.characterImages[this.player.state];
        
        if (currentImage && currentImage.complete) {
            // Draw character image
            this.ctx.drawImage(currentImage, playerScreenX, playerScreenY, this.player.size, this.player.size);
        } else {
            // Fallback: draw colored rectangle if image not loaded
            this.ctx.fillStyle = this.player.color;
            this.ctx.fillRect(playerScreenX, playerScreenY, this.player.size, this.player.size);
            
            // Add border to make it more visible
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(playerScreenX, playerScreenY, this.player.size, this.player.size);
        }

        // Draw grid lines
        this.ctx.strokeStyle = '#bdc3c7';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.MAZE_SIZE; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.TILE_SIZE, 0);
            this.ctx.lineTo(i * this.TILE_SIZE, this.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.TILE_SIZE);
            this.ctx.lineTo(this.width, i * this.TILE_SIZE);
            this.ctx.stroke();
        }
    }

    showGameOver(completed = false) {
        this.gameRunning = false;
        clearInterval(this.timerInterval);

        if (completed) {
            document.getElementById('gameOverTitle').textContent = '🎉 Bạn đã hoàn thành!';
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('finalTime').textContent = this.completedTime;
        } else {
            document.getElementById('gameOverTitle').textContent = '⏰ Hết thời gian!';
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('finalTime').textContent = this.getDifficultyTime() - this.timeLeft;
        }

        // Save score to history
        this.saveScore(completed);

        // Show game over popup
        document.getElementById('gameOverPopup').style.display = 'flex';
    }

    getDifficultyTime() {
        switch (this.difficulty) {
            case 'easy': return 60;
            case 'medium': return 45;
            case 'hard': return 30;
            default: return 60;
        }
    }

    saveScore(completed) {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        const gameRecord = {
            id: Date.now(),
            difficulty: this.difficulty,
            score: this.score,
            time: completed ? this.completedTime : this.getDifficultyTime() - this.timeLeft,
            completed: completed,
            date: new Date().toLocaleDateString('vi-VN'),
            timeStamp: new Date().toLocaleTimeString('vi-VN')
        };

        gameHistory.push(gameRecord);
        gameHistory.sort((a, b) => b.score - a.score); // Sort by score descending

        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    }

    showHistory() {
        this.gameState = 'history';
        document.getElementById('gameOverPopup').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('historyScreen').style.display = 'block';

        this.loadHistory();
    }

    loadHistory() {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        const tbody = document.getElementById('historyTableBody');
        
        console.log('Loading history:', gameHistory);
        console.log('History length:', gameHistory.length);
        
        tbody.innerHTML = '';

        if (gameHistory.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #7f8c8d;">Chưa có lịch sử chơi</td></tr>';
            return;
        }

        gameHistory.forEach((record, index) => {
            console.log('Adding record:', record);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.getDifficultyText(record.difficulty)}</td>
                <td>${record.time}s</td>
                <td>${record.score}</td>
            `;
            tbody.appendChild(row);
        });
        
        console.log('History loaded successfully');
    }

    getDifficultyText(difficulty) {
        switch (difficulty) {
            case 'easy': return 'Dễ';
            case 'medium': return 'Trung bình';
            case 'hard': return 'Khó';
            default: return 'Không xác định';
        }
    }

    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        } else {
            console.log('Game loop stopped - gameRunning:', this.gameRunning);
        }
    }
}

// Global functions for HTML buttons
function restartGame() {
    document.getElementById('gameOverPopup').style.display = 'none';
    document.getElementById('historyScreen').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';

    // Reset game state
    if (window.game) {
        window.game.gameState = 'menu';
        window.game.gameRunning = false;
        if (window.game.timerInterval) {
            clearInterval(window.game.timerInterval);
        }
    }
}

function showHistory() {
    if (window.game) {
        window.game.showHistory();
    }
}

function showMainMenu() {
    document.getElementById('historyScreen').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';

    // Reset difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.style.opacity = '1';
    });
}

function closeInstructions() {
    if (window.game) {
        window.game.closeInstructions();
    }
}

function startGameFromInstructions() {
    if (window.game) {
        window.game.startGameFromInstructions();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.game = new RisingNationMazeGame();
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Lỗi khởi tạo game: ' + error.message);
    }
});

// Alternative initialization - try again after a short delay
setTimeout(() => {
    if (!window.game) {
        try {
            window.game = new RisingNationMazeGame();
        } catch (error) {
            console.error('Retry failed:', error);
        }
    }
}, 1000);
