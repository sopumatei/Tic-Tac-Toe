const boardEl = document.querySelectorAll('.board-el');
const resetBtn = document.getElementById('reset-btn');
const resultTxt = document.getElementById('result-txt');
const resultLine = document.getElementById('result-line');
const scoreX = document.getElementById('score-X'); 
const scoreO = document.getElementById('score-O'); 

const createPlayer = (type, start) => {
    const getType = () => type;
    const hoverImg = `./img/empty_${type}.png`;
    const clickImg = `./img/filled_${type}.png`;
    let active = start;
    let blocksOccupied = [];
    let win = false;
    let score = 0;
    const addScore = () => ++score;
    const getScore = () => score;

    return {getType, active, blocksOccupied, hoverImg, clickImg, win, addScore, getScore};
}

const hasWon = (playerArray) => {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ];

    const line = [
        {
            top: 14,
            bottom: 81,
            left: 0,
            right: 0,
            deg: 0
        },

        {
            top: 48,
            bottom: 48,
            left: 0,
            right: 0,
            deg: 0
        },

        {
            top: 81,
            bottom: 14,
            left: 0,
            right: 0,
            deg: 0
        },

        {
            top: 0,
            bottom: 0,
            left: 14,
            right: 81,
            deg: 0
        },

        {
            top: 0,
            bottom: 0,
            left: 48,
            right: 48,
            deg: 0
        },

        {
            top: 0,
            bottom: 0,
            left: 81,
            right: 14,
            deg: 0
        },

        {
            top: -10,
            bottom: -10,
            left: 48,
            right: 48,
            deg: -45
        },

        {
            top: -10,
            bottom: -10,
            left: 48,
            right: 48,
            deg: 45
        }
    ]

    const binarySearch = (arr, nr) => {
        let st = 0, dr = arr.length - 1;
        arr.sort((a, b) => a - b);
        let found = false;
    
        while(st <= dr) {
            let mij = Math.floor((st + dr) / 2);
            
            if(arr[mij] == nr) {
                found = true;
                break;
            }
            else if(arr[mij] < nr) {
                st = mij + 1;
            }
            else {
                dr = mij - 1;
            }
        }
    
        return found;
    }

    let foundComb;
    for(let k = 0; k < winningCombinations.length; ++k) {
        const currentComb = winningCombinations[k];
        foundComb = true;

        for(let i = 0; i < 3; ++i) {
            if(!binarySearch(playerArray, currentComb[i])) {
                // console.log("Player: " + playerArray + " current: " + currentComb);
                foundComb = false;
                break;
            }
        }

        if(foundComb) {
            resultLine.style.top = `${line[k].top}%`;
            resultLine.style.bottom = `${line[k].bottom}%`;
            resultLine.style.left = `${line[k].left}%`;
            resultLine.style.right = `${line[k].right}%`;
            resultLine.style.transform = `rotate(${line[k].deg}deg)`;
            resultLine.style.transform += 'scale(1)';
            break;
        }
    }

    return foundComb;
}

const arrFilled = (arr) => {
    if(arr.length < 9) {
        return false;
    } 
        
    for(let k = 0; k < arr.length; ++k) {
        if(!arr[k]) {
            return false;
        }
    }

    return true;
}

const main = () => {
    let playerX = createPlayer('x', true);
    let playerO = createPlayer('o', false);
    let squares = [];

    const resetGame = () => {
        squares = [];
        playerX = createPlayer('x', true);
        playerO = createPlayer('o', false);
        for(let i = 0; i < boardEl.length; ++i) {
            const currentEl = boardEl[i];
            currentEl.innerHTML = '';
        }

        resetBtn.style.transform = 'scale(0)';
        resultTxt.style.transform = 'scale(0)';
        resultLine.style.transform = 'scale(0)';

        resultLine.style.top = 0;
        resultLine.style.bottom = 0;
        resultLine.style.left = 0;
        resultLine.style.right = 0;  
    }

    resetBtn.addEventListener('click', resetGame);

    const hoverFunction = (el, index) => {
        if(!squares[index] && !playerO.win && !playerX.win) {
            let img;
            if(playerX.active) {
                img = playerX.hoverImg;
            }
            else {
                img = playerO.hoverImg;
            }
            const icon = document.createElement('img');
            icon.setAttribute('src', img);
            el.appendChild(icon);
        }
    }

    const clickFunction = (el, index) => {
        if(!squares[index] && !playerO.win && !playerX.win) {
            el.innerHTML = '';
            squares[index] = true;

            let img;
            if(playerX.active) {
                playerX.blocksOccupied.push(index);
                img = playerX.clickImg;

                if(playerX.blocksOccupied.length >= 3) {
                    playerX.win = hasWon(playerX.blocksOccupied);
                }
            }
            else {
                playerO.blocksOccupied.push(index);
                img = playerO.clickImg;

                if(playerO.blocksOccupied.length >= 3) {
                    playerO.win = hasWon(playerO.blocksOccupied);
                }
            }

            playerO.active = !playerO.active;
            playerX.active = !playerX.active;

            const icon = document.createElement('img');
            icon.setAttribute('src', img);
            el.appendChild(icon);

            if(playerO.win || playerX.win) {
                console.log('O: ' + playerO.blocksOccupied);
                console.log('X: ' + playerX.blocksOccupied);
                console.log('Game Ended');
                resetBtn.style.transform = 'scale(1)';

                if(playerO.win) {
                    resultTxt.textContent = "O has won!";
                    playerO.addScore();
                    scoreO.textContent = `O: ${playerO.getScore()}`;
                }
                else {
                    resultTxt.textContent = "X has won!";
                    playerX.addScore();
                    scoreX.textContent = `X: ${playerX.getScore()}`;
                }
                resultTxt.style.transform = 'scale(1)';
            }

            if(!playerO.win && !playerX.win && arrFilled(squares)) {
                console.log('O: ' + playerO.blocksOccupied);
                console.log('X: ' + playerX.blocksOccupied);
                console.log('Draw');
                resultTxt.textContent = "Draw";
                resultTxt.style.transform = 'scale(1)';
                resetBtn.style.transform = 'scale(1)';
            }
        }
    }
    
    const clearEL = (el, index) => {
        if(!squares[index]) {
            el.innerHTML = '';
        }
    }

    for(let i = 0; i < boardEl.length; ++i) {
        const currentEl = boardEl[i];
        currentEl.addEventListener('mouseenter', () => hoverFunction(currentEl, i));
        currentEl.addEventListener('click', () => clickFunction(currentEl, i));
        currentEl.addEventListener('mouseleave', () => clearEL(currentEl, i));
    }
}

main();