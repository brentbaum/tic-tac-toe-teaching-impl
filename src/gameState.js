export const GAME_STATUS = {
    inProgress: "IN_PROGRESS",
    oWins: "O_WINS",
    xWins: "X_WINS",
    draw: "DRAW",
}

const checkThree = (a,b,c) => {
    if(!a || !b || !c) {
        return false
    }

    return a === b && b === c
}

const checkForWin = (boardState) =>{
    const [nw, n, ne, w, c, e, sw, s, se] = boardState;
    return (
        // horizontal
        checkThree(nw,n,ne) ||
        checkThree(w,c,e) ||
        checkThree(sw,s,se) ||
        // vertical
        checkThree(nw,w,sw) ||
        checkThree(n,c,s) ||
        checkThree(ne,e,se) ||
        // diagonal
        checkThree(nw,c,se) ||
        checkThree(ne,c,sw)
    );
}

const checkForDraw = boardState => {
    return !boardState.some(tile => tile === undefined)
}

export const getGameStatus = (boardState, currentPlayerSymbol) => {
    const isWinner = checkForWin(boardState)
    if(isWinner) {
        return currentPlayerSymbol === "X" ?
            GAME_STATUS.xWins :
            GAME_STATUS.oWins
    }

    const isDraw = checkForDraw(boardState);
    if(isDraw) {
        return GAME_STATUS.draw
    }

    return GAME_STATUS.inProgress
}

export const getStatusText = (gameStatus, currentPlayerSymbol) => {
    switch (gameStatus) {
        case (GAME_STATUS.xWins):
            return "X Wins!"
        case (GAME_STATUS.oWins):
            return "O Wins!"
        case (GAME_STATUS.draw):
            return "Draw!"
        default:
            return currentPlayerSymbol + " to move"
    }
}