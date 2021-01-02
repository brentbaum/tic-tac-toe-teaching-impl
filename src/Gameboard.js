import React, {useCallback, useState} from "react"
import "./index.css"
import {GAME_STATUS, getGameStatus, getStatusText} from "./gameState";

const INITIAL_BOARD_STATE = new Array(9).fill(undefined)

const Tile = ({onSelect, value}) => {
    return <div className={"box"} onClick={() => {
        if(value === undefined) {
            onSelect()
        }
        }} style={{ pointerEvents: value === undefined ? "auto" : "none" }}>
        {value}
    </div>
}


function useSetTile(currentPlayerSymbol, setGameStatus, boardState, setBoardState, setCurrentPlayerSymbol) {
    const updateGameStatus = useCallback((boardState) => {
        const gameStatus = getGameStatus(boardState, currentPlayerSymbol);
        setGameStatus(gameStatus)
        return gameStatus
    }, [currentPlayerSymbol, setGameStatus])

    const updateTileAtIndex = useCallback((index) => {
        const nextBoardState = [...boardState];

        nextBoardState[index] = currentPlayerSymbol;
        setBoardState(nextBoardState)

        return nextBoardState
    }, [boardState, currentPlayerSymbol, setBoardState])

    const updateCurrentPlayer = useCallback((gameStatus) => {
        if (gameStatus === GAME_STATUS.inProgress) {
            const nextPlayerSymbol = currentPlayerSymbol === "X" ? "O" : "X"
            setCurrentPlayerSymbol(nextPlayerSymbol)
        }
    }, [currentPlayerSymbol, setCurrentPlayerSymbol])

    return useCallback((index) => {
        // disallow moves on a square that's already filled.
        if (boardState[index] !== undefined) {
            return
        }

        // make a copy of board state so we're not mutating the state object
        const nextBoardState = updateTileAtIndex(index)

        // Update status if we have a winner or a draw.
        const status = updateGameStatus(nextBoardState);

        // Flip the current player if game still in progress.
        updateCurrentPlayer(status)
    }, [boardState, updateCurrentPlayer, updateGameStatus, updateTileAtIndex])

}

export const GameBoard = () => {
    const [boardState, setBoardState] = useState(
            INITIAL_BOARD_STATE
        ),
        [gameStatus, setGameStatus] = useState(GAME_STATUS.inProgress),
        [currentPlayerSymbol, setCurrentPlayerSymbol] = useState("X")

    // custom hook that performs player moves and board state updates.
    // If it's easier to understand you can pull the contents of useSetTile
    // back into the GameBoard component.
    const setTile = useSetTile(currentPlayerSymbol, setGameStatus, boardState, setBoardState, setCurrentPlayerSymbol);

    const reset = useCallback(() => {
        setBoardState(INITIAL_BOARD_STATE)
        setGameStatus(GAME_STATUS.inProgress)
        setCurrentPlayerSymbol("X")
    }, [])

    return <>
        <div className={"game-board"}>
            {boardState.map((tileState, index) =>
                <Tile onSelect={() => setTile(index)} value={tileState}/>
            )}
        </div>
        <div>
            {getStatusText(gameStatus, currentPlayerSymbol)}
            {gameStatus !== GAME_STATUS.inProgress && <button onClick={reset} >Play again</button>}
        </div>
    </>
}