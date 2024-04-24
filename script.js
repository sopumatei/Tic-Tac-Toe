const boardEl = document.querySelectorAll('.board-el');

const createPlayer = (type, start) => {
    const getType = () => type;
    const hoverImg = `./img/empty_${type}.png`;
    const clickImg = `./img/filled_${type}.png`;
    let active = start;
    let blocksOccupied = [];
    let win = false;

    return {getType, active, blocksOccupied, hoverImg, clickImg, win};
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
                //console.log("Player: " + playerArray + " current: " + currentComb);
                foundComb = false;
                break;
            }
        }

        if(foundComb) {
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
    }

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
                setTimeout(resetGame, 1000);
            }

            if(!playerO.win && !playerX.win && arrFilled(squares)) {
                console.log('O: ' + playerO.blocksOccupied);
                console.log('X: ' + playerX.blocksOccupied);
                console.log('Draw');
                setTimeout(resetGame, 1000);
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