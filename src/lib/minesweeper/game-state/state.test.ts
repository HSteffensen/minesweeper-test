import { describe, test, expect } from "vitest";
import { mapCell, newMinesweeperGrid, type CellState, inboundNeighbors } from "./state";

test("newMinesweeperGame", () => {
    const width = 3;
    const height = 5;
    const grid = newMinesweeperGrid(width, height);

    expect(grid).toHaveLength(height);
    for (let y = 0; y < height; y++) {
        expect(grid[y]).toHaveLength(width);
        for (let x = 0; x < width; x++) {
            expect(grid[y][x]).toEqual({ value: "0", state: "hidden" });
        }
    }
});

test("mapCell", () => {
    const width = 3;
    const height = 5;
    const grid = mapCell(
        newMinesweeperGrid(width, height),
        2,
        3,
        (): CellState => ({ state: "revealed", value: "3" }),
    );

    expect(grid).toHaveLength(height);
    for (let y = 0; y < height; y++) {
        expect(grid[y]).toHaveLength(width);
        for (let x = 0; x < width; x++) {
            if (x === 2 && y === 3) {
                expect(grid[y][x]).toEqual({ value: "3", state: "revealed" });
            } else {
                expect(grid[y][x]).toEqual({ value: "0", state: "hidden" });
            }
        }
    }
});

describe("inboundNeighbors", () => {
    test("middle of the grid", () => {
        const width = 3;
        const height = 5;
        const grid = newMinesweeperGrid(width, height);

        const actual = inboundNeighbors(grid, 1, 1);
        const expected = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 0, y: 1 },
            { x: 2, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
        ];
        assertContainsExactlyAllOf(actual, expected);
    });
    test("0 edges of the grid", () => {
        const width = 3;
        const height = 5;
        const grid = newMinesweeperGrid(width, height);

        const actual = inboundNeighbors(grid, 0, 0);
        const expected = [
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
        ];
        assertContainsExactlyAllOf(actual, expected);
    });
    test("high edges of the grid", () => {
        const width = 3;
        const height = 5;
        const grid = newMinesweeperGrid(width, height);

        const actual = inboundNeighbors(grid, width - 1, height - 1);
        const expected = [
            { x: width - 1, y: height - 2 },
            { x: width - 2, y: height - 1 },
            { x: width - 2, y: height - 2 },
        ];
        assertContainsExactlyAllOf(actual, expected);
    });
});

function assertContainsExactlyAllOf<T>(actual: T[], expected: T[]) {
    for (const expectedValue of expected) {
        expect.soft(actual).toContainEqual(expectedValue);
    }
    for (const actualValue of actual) {
        expect.soft(expected).toContainEqual(actualValue);
    }
    expect(actual).toHaveLength(expected.length);
}
