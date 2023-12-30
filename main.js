

// ДЗ №3
// 1. Зробити розмітку висновків гри по її завершенню
// 2. Зверстати окрему кнопку рестарт, що перезапускатиме гру посеред гри
// 3. Додати клавіатуру на екрані браузеру для руху фігур


import {
    playfield_columns,
    playfield_rows,
    tetromino_names,
    tetrominoes,
    tetroColors,
    gameOverBlock,
    btnRestart,
    mainRestartBtn,
} from './utils.js'

window.onload = () => {

    let playfield,
        tetromino,
        cells,
        score = 0,
        timeoutId,
        requestId,
        isPaused = false,
        scoreDiv = document.getElementById("score-points"),
        isGameOver = false
    init();

    // запуск гри 

    function init() {
        gameOverBlock.style.display = 'none';
        isGameOver = false;
        generatePlayfield();
        generateTetromino();
        startLoop();
        cells = document.querySelectorAll('.tetris div');
        score = 0;
        scoreCount(null);
    }

    function draw() {
        cells.forEach(function (cell) { cell.removeAttribute('class') });
        drawPlayfield();
        drawTetromino();
    }


    function startLoop() {
        timeoutId = setTimeout(
            () => (requestId = requestAnimationFrame(moveDown)),
            700
        );
    }

    function stopLoop() {
        cancelAnimationFrame(requestId);
        timeoutId = clearTimeout(timeoutId);
    }

    function gameOver() {
        stopLoop();
        gameOverBlock.style.display = 'flex';
        document.querySelector('.game-over__score').innerHTML = score;
    }


    // обробка кнопок  

    btnRestart.addEventListener('click', function () {
        init();
    });

    mainRestartBtn.addEventListener('click', function () {
        init();
    });

    document.querySelector('.top-button').addEventListener('click', function () {
        rotateTetromino();
    });

    document.querySelector('.left-button').addEventListener('click', function () {
        moveTetrominoLeft();
    });

    document.querySelector('.down-button').addEventListener('click', function () {
        moveTetrominoDown();
    });

    document.querySelector('.right-button').addEventListener('click', function () {
        moveTetrominoRight();
    });

    document.querySelector('.drop-button').addEventListener('click', function () {
        dropTetrominoiDown();
    });


    // генерація поля для гри

    function convertPositionToIndex(row, column) {
        return row * playfield_columns + column
    }

    function generatePlayfield() {
        document.querySelector('.tetris').innerHTML = '';
        for (let i = 0; i < playfield_rows * playfield_columns; i++) {
            const div = document.createElement('div');
            document.querySelector('.tetris').append(div);
        }
        playfield = new Array(playfield_rows).fill()
            .map(() => new Array(playfield_columns).fill(0))
    }

    function drawPlayfield() {
        for (let row = 0; row < playfield_rows; row++) {
            for (let column = 0; column < playfield_columns; column++) {
                // if (playfield[row][column] == 0) { continue };
                const name = playfield[row][column];
                const cellIndex = convertPositionToIndex(row, column);
                cells[cellIndex].classList.add(name);
            }
        }
    }
    // генерація фігур 

    function getRandomTetro() {
        return tetromino_names[Math.floor(Math.random() * tetromino_names.length)];
    };

    function setRandomTetroColor() {
        return tetroColors[Math.floor(Math.random() * tetroColors.length)];
    }

    function generateTetromino() {
        let nameTetro = getRandomTetro();
        const matrixTetro = tetrominoes[nameTetro];
        const columnTetro = (playfield_columns / 2) + Math.floor(matrixTetro.length / 2) - matrixTetro.length;
        const rowTetro = -2;
        const colorTetro = setRandomTetroColor();

        tetromino = {
            name: nameTetro,
            matrix: matrixTetro,
            row: rowTetro,
            column: columnTetro,
            color: colorTetro
        }
    }

    function drawTetromino() {
        const name = tetromino.name;
        const color = tetromino.color;
        const tetrominoMatrixSize = tetromino.matrix.length;
        for (let row = 0; row < tetrominoMatrixSize; row++) {
            for (let column = 0; column < tetrominoMatrixSize; column++) {
                if (isOutOfGameBoard(row)) { continue };
                if (tetromino.matrix[row][column] == 0) { continue };
                const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
                if (cellIndex < 0) { continue; }
                cells[cellIndex].classList.add(name);
                cells[cellIndex].classList.add(color);
            }
        }

    }

    function placeTetromino() {
        const matrixSize = tetromino.matrix.length;
        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (!tetromino.matrix[row][column]) continue;
                if (isOutsideTopGameBoard(row)) { isGameOver = true; return }
                playfield[tetromino.row + row][tetromino.column + column] = tetromino_names[0];
            }
        }
        const filledRows = findFilledRows();
        removedFilledRows(filledRows);
        generateTetromino();
    }



    // логіка руху фігур

    function isOutsideTopGameBoard(row) {
        return tetromino.row + row < 0;
    }

    function moveTetrominoDown() {
        tetromino.row += 1;
        if (isValid()) {
            tetromino.row -= 1;
            placeTetromino();
        }
    }
    function moveTetrominoLeft() {
        tetromino.column -= 1;
        if (isValid()) {
            tetromino.column += 1;
        }
    }
    function moveTetrominoRight() {
        tetromino.column += 1;
        if (isValid()) {
            tetromino.column -= 1;
        }
    }

    function isValid() {
        const matrixSize = tetromino.matrix.length;
        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (!tetromino.matrix[row][column]) { continue };
                if (isOutOfGameBoard(row, column)) { return true };
                if (hasCollisionns(row, column)) { return true };
            }
        }
        return false;
    }

    function isOutOfGameBoard(row, column) {
        return tetromino.column + column < 0 ||
            tetromino.column + column >= playfield_columns ||
            tetromino.row + row >= playfield_rows;
    }

    function hasCollisionns(row, column) {
        if (tetromino.row < 0) {
            return false
        }
        return playfield[tetromino.row + row][tetromino.column + column]
    }

    function rotateMatrix(matrixTetromino) {
        const N = matrixTetromino.length;
        const rotateMatrix = [];
        for (let i = 0; i < N; i++) {
            rotateMatrix[i] = [];
            for (let j = 0; j < N; j++) {
                rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
            }

        }
        return rotateMatrix;
    }

    function rotateTetromino() {
        const oldMatrix = tetromino.matrix;
        const rotatedMatrix = rotateMatrix(tetromino.matrix);
        tetromino.matrix = rotatedMatrix;
        if (isValid()) {
            tetromino.matrix = oldMatrix;
        };
    }


    function findFilledRows() {
        const filledRows = [];
        for (let row = 0; row < playfield_rows; row++) {
            let filledColumns = 0;
            for (let column = 0; column < playfield_columns; column++) {
                if (playfield[row][column] != 0) {
                    filledColumns++;
                }
            }
            if (playfield_columns == filledColumns) {
                filledRows.push(row);
            }
        }
        return filledRows;
    }

    function moveDown() {
        moveTetrominoDown();
        draw();
        stopLoop();
        startLoop();
        if (isGameOver) {
            gameOver();
        }
    }

    function removedFilledRows(filledRows) {
        filledRows.forEach(row => {
            dropRowsAbove(row);
        })
        scoreCount(filledRows.length);
    }

    function dropRowsAbove(rowDelete) {
        for (let row = rowDelete; row > 0; row--) {
            playfield[row] = playfield[row - 1];
        }
        playfield[0] = new Array(playfield_columns).fill(0);
    }

    function dropTetrominoiDown() {
        while (!isValid()) {
            tetromino.row++;
        }
        tetromino.row--;
    }

    function togglePausegame() {
        isPaused = !isPaused;
        if (isPaused) {
            stopLoop()
        } else {
            startLoop()
        }
    }

    // реакція на клавіші

    document.addEventListener('keydown', onKeyDown)

    function onKeyDown(event) {
        if (event.key == "p") { togglePausegame() };
        if (isPaused) { return };
        switch (event.key) {
            case ' ':
                dropTetrominoiDown();
                break;
            case 'ArrowDown':
                moveTetrominoDown();
                break;
            case 'ArrowLeft':
                moveTetrominoLeft();
                break;
            case 'ArrowRight':
                moveTetrominoRight();
                break;
            case 'ArrowUp':
                rotateTetromino();
                break;
        }
        draw();
    }

    // підрахунок балів

    function scoreCount(destroyedRows) {
        switch (destroyedRows) {
            case 1:
                score += 10
                break;
            case 2:
                score += 30
                break;
            case 3:
                score += 50
                break;
            case 4:
                score += 100
                break;
        }
        scoreDiv.innerHTML = score;
    }
}



