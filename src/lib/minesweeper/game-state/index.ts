import { writable } from "svelte/store";
import type { MinesweeperGame, MinesweeperState } from "./state";
import { SimpleMinesweeper } from "./simple-minesweeper";

export type Position2D = { x: number; y: number };

export type MinesweeperGameType = "Simple";

export function allPositions(width: number, height: number): Position2D[] {
    const result: Position2D[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            result.push({ x, y });
        }
    }
    return result;
}

export function newMinesweeper(
    gameType: MinesweeperGameType,
    width: number,
    height: number,
    mineCount: number,
) {
    let gameRules: MinesweeperGame;
    switch (gameType) {
        case "Simple":
            gameRules = SimpleMinesweeper;
            break;

        default:
            gameRules = SimpleMinesweeper;
            break;
    }

    const state = writable<MinesweeperState>(gameRules.new(width, height, mineCount));

    function toggleFlag(x: number, y: number) {
        state.update((current) => gameRules.flagCell(current, x, y));
    }

    function reveal(x: number, y: number) {
        state.update((current) => gameRules.revealCell(current, x, y));
    }

    function reset(newWidth?: number, newHeight?: number, newMineCount?: number) {
        const thisWidth = newWidth ? newWidth : width;
        const thisHeight = newHeight ? newHeight : height;
        const thisMineCount = newMineCount ? newMineCount : mineCount;
        state.set(gameRules.new(thisWidth, thisHeight, thisMineCount));
    }

    return { state, toggleFlag, reveal, reset };
}
