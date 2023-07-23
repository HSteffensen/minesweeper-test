import { describe, expect, test } from "vitest";
import { MinesweeperGrid, PosSet, findCellValue, neighbors } from "./gamemodel";

describe("Precalculated mine field with numbers", () => {
    test("no mines is all zeroes", () => {
        const grid = new MinesweeperGrid(4, 4, new PosSet());
        for (let x = 0; x < grid.width; x++) {
            for (let y = 0; y < grid.height; y++) {
                expect(grid.getValue({ x, y })).toBe("0");
            }
        }
    });
    test("mine spot is a mine", () => {
        const grid = new MinesweeperGrid(4, 4, new PosSet([{ x: 1, y: 1 }]));
        expect(grid.getValue({ x: 1, y: 1 })).toEqual("mine");
    });
});

test("neigbors", () => {
    const actual = neighbors({ x: 1, y: 1 });
    expect(actual).toHaveLength(8);
    expect(actual).toContainEqual({ x: 0, y: 0 });
    expect(actual).toContainEqual({ x: 1, y: 0 });
    expect(actual).toContainEqual({ x: 2, y: 0 });
    expect(actual).toContainEqual({ x: 0, y: 1 });
    expect(actual).toContainEqual({ x: 2, y: 1 });
    expect(actual).toContainEqual({ x: 0, y: 2 });
    expect(actual).toContainEqual({ x: 1, y: 2 });
    expect(actual).toContainEqual({ x: 2, y: 2 });
});

describe("findCellValue", () => {
    test("mine", () => {
        expect(findCellValue({ x: 1, y: 1 }, new PosSet([{ x: 1, y: 1 }]))).toEqual("mine");
    });
    test("1", () => {
        expect(findCellValue({ x: 0, y: 0 }, new PosSet([{ x: 1, y: 1 }]))).toEqual("1");
    });
    test("3", () => {
        expect(
            findCellValue(
                { x: 0, y: 0 },
                new PosSet([
                    { x: 1, y: 1 },
                    { x: 0, y: 1 },
                    { x: 1, y: 0 },
                ]),
            ),
        ).toEqual("3");
    });
    test("7", () => {
        expect(
            findCellValue(
                { x: 1, y: 1 },
                new PosSet([
                    { x: 0, y: 0 },
                    { x: 0, y: 1 },
                    { x: 0, y: 2 },
                    { x: 1, y: 0 },
                    { x: 2, y: 0 },
                    { x: 2, y: 1 },
                    { x: 2, y: 2 },
                ]),
            ),
        ).toEqual("7");
    });
});
