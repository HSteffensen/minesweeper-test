import { allPositions } from ".";
import { MinesweeperState, type CellValue, type MinesweeperGame } from "./state";

export const SimpleMinesweeper: MinesweeperGame = {
    flagCell: function (game: MinesweeperState, x: number, y: number): MinesweeperState {
        game.mapCell(x, y, (cell) => {
            switch (cell.visibility) {
                case "hidden":
                    return { value: cell.value, visibility: "flagged" };
                case "flagged":
                    return { value: cell.value, visibility: "hidden" };
                case "revealed":
                    // revealed cells cannot be flagged
                    return cell;
                default:
                    throw Error("unreachable code");
            }
        });
        return game;
    },
    revealCell: function (game: MinesweeperState, x: number, y: number): MinesweeperState {
        const cellBeforeChange = game.getCellState(x, y);
        game.mapCell(x, y, (cell) => {
            if (cell.visibility === "hidden") {
                return { value: cell.value, visibility: "revealed" };
            } else {
                // flagged or revealed cells cannot be revealed
                return cell;
            }
        });
        if (
            game.getCellState(x, y).visibility === "revealed" &&
            cellBeforeChange.visibility === "hidden" &&
            cellBeforeChange.value === "0"
        ) {
            for (const nPos of game.inboundNeighbors(x, y)) {
                game = SimpleMinesweeper.revealCell(game, nPos.x, nPos.y);
            }
        }

        return game;
    },
    new: function (width: number, height: number, mineCount: number): MinesweeperState {
        const randomMines = allPositions(width, height)
            .sort(() => 0.5 - Math.random())
            .slice(0, mineCount);
        const grid = new MinesweeperState(width, height);
        for (const { x, y } of randomMines) {
            grid.setCellValue(x, y, "mine");
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (grid.getCellState(x, y).value != "mine") {
                    let count = 0;
                    for (const neighbor of grid.inboundNeighborCells(x, y)) {
                        if (neighbor.value == "mine") {
                            count += 1;
                        }
                    }
                    grid.setCellValue(x, y, count.toString() as CellValue);
                }
            }
        }
        return grid;
    },
};
