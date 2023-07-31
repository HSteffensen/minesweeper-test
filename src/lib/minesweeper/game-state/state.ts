import type { Position2D } from ".";

export type CellValue = "mine" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export type CellVisibility = "hidden" | "flagged" | "revealed";

type CellState = {
    value?: CellValue;
    visibility: CellVisibility;
};

export class MinesweeperState {
    private grid: CellState[][];

    constructor(width: number, height: number) {
        this.grid = [];
        for (let y = 0; y < height; y++) {
            const row: CellState[] = [];
            for (let x = 0; x < width; x++) {
                row.push({ value: "0", visibility: "hidden" });
            }
            this.grid.push(row);
        }
    }

    get width(): number {
        return this.grid[0].length;
    }

    get height(): number {
        return this.grid.length;
    }

    get mineCount(): number {
        return this.grid.reduce(
            (sum, row) =>
                sum + row.reduce((rowSum, cell) => rowSum + (cell.value === "mine" ? 1 : 0), 0),
            0,
        );
    }

    get isWon(): boolean {
        return this.grid.every((row) =>
            row.every(
                (cell) =>
                    (cell.visibility === "flagged" && cell.value === "mine") ||
                    (cell.visibility === "revealed" && cell.value !== "mine"),
            ),
        );
    }

    get isLost(): boolean {
        return this.grid.some((row) =>
            row.some((cell) => cell.visibility === "revealed" && cell.value === "mine"),
        );
    }

    get allCells(): CellState[] {
        return this.grid.flat();
    }

    getCellState(x: number, y: number): CellState {
        return this.grid[y][x];
    }

    getCellVisibility(x: number, y: number): CellVisibility {
        return this.grid[y][x].visibility;
    }

    setCellVisibility(x: number, y: number, visibility: CellVisibility): void {
        this.mapCell(x, y, (cell) => ({
            value: cell.value,
            visibility,
        }));
    }

    getCellValue(x: number, y: number): CellValue | undefined {
        return this.grid[y][x].value;
    }

    setCellValue(x: number, y: number, value?: CellValue): void {
        this.mapCell(x, y, (cell) => ({
            value,
            visibility: cell.visibility,
        }));
    }

    mapCell(x: number, y: number, f: (cell: CellState) => CellState): void {
        this.grid[y][x] = f(this.grid[y][x]);
    }

    mapCells(cells: Iterable<Position2D>, f: (cell: CellState) => CellState): void {
        const grid = this.grid.map((row) => [...row]);
        for (const { x, y } of cells) {
            grid[y][x] = f(this.grid[y][x]);
        }
        this.grid = grid;
    }

    isInBounds(x: number, y: number): boolean {
        const width = this.grid[0].length;
        const height = this.grid.length;
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    inboundNeighbors(x: number, y: number): Position2D[] {
        return neighbors(x, y).filter((pos) => this.isInBounds(pos.x, pos.y));
    }

    inboundNeighborCells(x: number, y: number): CellState[] {
        return this.inboundNeighbors(x, y).map(({ x, y }) => this.getCellState(x, y));
    }
}

export type MinesweeperGame = {
    flagCell: (game: MinesweeperState, x: number, y: number) => MinesweeperState;
    revealCell: (game: MinesweeperState, x: number, y: number) => MinesweeperState;
    new: (width: number, height: number, mineCount: number) => MinesweeperState;
};

function neighbors(xPos: number, yPos: number): Position2D[] {
    return [
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
    ].map(({ x, y }) => {
        return { x: x + xPos, y: y + yPos };
    });
}
