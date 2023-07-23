// import { assert } from "vitest";

import CustomSet from "$lib/utils/customset";

export interface GridPosition {
    x: number;
    y: number;
}

export type CellValue = "mine" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export interface MinesweeperCell {
    pos: GridPosition;
    val: CellValue | "hidden" | "flag";
}

export class PosSet extends CustomSet<string, GridPosition> {
    constructor(values: Iterable<GridPosition> = []) {
        super(({ x, y }) => `${x}:${y}`, values);
    }
}

export class MinesweeperGrid {
    private readonly values: ReadonlyArray<ReadonlyArray<CellValue>>;

    constructor(width: number, height: number, mines: PosSet) {
        const values = [];
        for (let y = 0; y < height; y++) {
            const row: CellValue[] = [];
            for (let x = 0; x < width; x++) {
                row.push(findCellValue({ x, y }, mines));
            }
            values.push(row);
        }
        this.values = values;
    }

    public get width(): number {
        return this.values[0].length;
    }

    public get height(): number {
        return this.values.length;
    }

    public getValue({ x, y }: GridPosition): CellValue {
        return this.values[y][x];
    }
}

export default class MinesweeperGame {
    private readonly grid: MinesweeperGrid;
    readonly mines: ReadonlySet<GridPosition>;
    private readonly revealed: Set<GridPosition>;
    private readonly flagged: Set<GridPosition>;

    public get width(): number {
        return this.grid.width;
    }

    public get height(): number {
        return this.grid.height;
    }

    public get isWon(): boolean {
        const union = new Set([...this.revealed, ...this.mines]);
        return union.size == this.width * this.height && !this.isLost;
    }

    public get isLost(): boolean {
        const intersect = new Set([...this.revealed].filter((i) => this.mines.has(i)));
        return intersect.size > 0;
    }

    public get isFinished(): boolean {
        return this.isLost || this.isWon;
    }

    public get cellsList(): ReadonlyArray<MinesweeperCell> {
        return allPositions(this.width, this.height).map((pos) => {
            if (this.revealed.has(pos)) {
                return { pos, val: this.grid.getValue(pos) };
            } else if (this.flagged.has(pos)) {
                return { pos, val: "flag" };
            } else {
                return { pos, val: "hidden" };
            }
        });
    }

    private constructor(
        grid: MinesweeperGrid,
        mines: ReadonlySet<GridPosition>,
        revealed: Set<GridPosition>,
        flagged: Set<GridPosition>,
    ) {
        this.grid = grid;
        this.mines = mines;
        this.revealed = revealed;
        this.flagged = flagged;
    }

    public static new(width: number, height: number, mineCount: number) {
        const randomMines = allPositions(width, height)
            .sort(() => 0.5 - Math.random())
            .slice(0, mineCount);
        const mines = new PosSet(randomMines);
        const grid = new MinesweeperGrid(width, height, mines);
        return new MinesweeperGame(grid, mines, new PosSet(), new PosSet());
    }

    public clone(): MinesweeperGame {
        return new MinesweeperGame(this.grid, this.mines, this.revealed, this.flagged);
    }

    public revealCell(cell: GridPosition) {
        if (!this.revealed.has(cell) && !this.isFinished) {
            this.revealed.add(cell);
            if (this.grid.getValue(cell) === "0") {
                this.neighbors(cell).forEach((c) => this.revealCell(c));
            }
        }
    }

    public toggleFlagCell(cell: GridPosition) {
        if (!this.isFinished) {
            if (!this.flagged.has(cell)) {
                this.flagged.add(cell);
            } else {
                this.flagged.delete(cell);
            }
        }
    }

    private neighbors(pos: GridPosition) {
        return neighbors(pos).filter(
            ({ x, y }) => x >= 0 && x < this.width && y >= 0 && y < this.height,
        );
    }
}

export function findCellValue(pos: GridPosition, mines: PosSet): CellValue {
    if (mines.has(pos)) {
        return "mine";
    }
    let count = 0;
    for (const p of neighbors(pos)) {
        if (mines.has(p)) {
            count += 1;
        }
    }
    // assert(count < 9);
    return count.toString() as CellValue;
}

export function neighbors(pos: GridPosition): ReadonlyArray<GridPosition> {
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
        return { x: x + pos.x, y: y + pos.y };
    });
}

function allPositions(width: number, height: number): GridPosition[] {
    const result: GridPosition[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            result.push({ x, y });
        }
    }
    return result;
}
