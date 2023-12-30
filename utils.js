export const playfield_columns = 10;
export const playfield_rows = 20;

export const tetromino_names = [
    'O',
    'L',
    'J',
    'I',
    'S',
    'Z',
    'T'
];

export const tetrominoes = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ]
};

export const tetroColors = ['pupple', 'pink', 'lightBlue', 'orange', 'red', 'yellow', 'green'];
export const gameOverBlock = document.querySelector('.game-over');
export const btnRestart = document.querySelector('.restart');
export const mainRestartBtn = document.querySelector('.main-restart');

