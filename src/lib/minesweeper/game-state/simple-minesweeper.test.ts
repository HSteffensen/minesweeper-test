import { describe, expect, test } from "vitest";
import { newMinesweeperGrid, type MinesweeperStateGrid, type CellState } from "./state";
import { SimpleMinesweeper } from "./simple-minesweeper";

function testGame(): MinesweeperStateGrid {
    return newMinesweeperGrid(5, 5);
}

describe("flagging", () => {
    test("turn a flag on", () => {
        const game = testGame();
        const newGame = SimpleMinesweeper.flagCell(game, 1, 1);
        expect(game[1][1].state).toEqual("hidden");
        expect(newGame[1][1].state).toEqual("flagged");
        expect(newGame[1][1].value).toEqual(game[1][1].value);
    });
    test("turn a flag off", () => {
        const game: CellState[][] = testGame().map((row) =>
            row.map((cell) => ({ value: cell.value, state: "flagged" })),
        );
        const newGame = SimpleMinesweeper.flagCell(game, 1, 1);
        expect(game[1][1].state).toEqual("flagged");
        expect(newGame[1][1].state).toEqual("hidden");
        expect(newGame[1][1].value).toEqual(game[1][1].value);
    });
    test("can't flag a revealed cell", () => {
        const game: CellState[][] = testGame().map((row) =>
            row.map((cell) => ({ value: cell.value, state: "revealed" })),
        );
        const newGame = SimpleMinesweeper.flagCell(game, 1, 1);
        expect(newGame[1][1]).toEqual(newGame[1][1]);
    });
});

describe("revealing", () => {
    test("reveal a hidden cell", () => {
        const game = testGame();
        const newGame = SimpleMinesweeper.revealCell(game, 1, 1);
        expect(game[1][1].state).toEqual("hidden");
        expect(newGame[1][1].state).toEqual("revealed");
        expect(newGame[1][1].value).toEqual(game[1][1].value);
    });
    test("can't reveal a flagged cell", () => {
        const game: CellState[][] = testGame().map((row) =>
            row.map((cell) => ({ value: cell.value, state: "flagged" })),
        );
        const newGame = SimpleMinesweeper.revealCell(game, 1, 1);
        expect(newGame[1][1]).toEqual(newGame[1][1]);
    });
    test("can't reveal a revealed cell", () => {
        const game: CellState[][] = testGame().map((row) =>
            row.map((cell) => ({ value: cell.value, state: "revealed" })),
        );
        const newGame = SimpleMinesweeper.revealCell(game, 1, 1);
        expect(newGame[1][1]).toEqual(newGame[1][1]);
    });
});

describe("new", () => {
    test("correct number of mines", () => {
        const expectedMineCount = 50;
        const game = SimpleMinesweeper.new(10, 10, expectedMineCount);
        const mineCount = game.flat().filter((cell) => cell.value == "mine").length;
        expect(mineCount).toEqual(expectedMineCount);
    });
    test("correct dimensions", () => {
        const width = 10;
        const height = 7;
        const game = SimpleMinesweeper.new(width, height, 20);
        game.forEach((row) => expect(row).toHaveLength(width));
        expect(game).toHaveLength(height);
    });
});
