import { expect, test } from "vitest";
import CustomSet from "./customset";

function testMapper(v: string): number {
    return v.length;
}

test("add twice only has one thing", () => {
    const set = new CustomSet<number, string>(testMapper);
    set.add("abc");
    set.add("abc");
    expect([...set.values()]).toEqual(["abc"]);
});

test("add again from constructor only has one thing", () => {
    const set = new CustomSet<number, string>(testMapper, ["abc"]);
    set.add("abc");
    expect([...set.values()]).toEqual(["abc"]);
});

test("add twice with the same map result only has the most recent thing", () => {
    const set = new CustomSet<number, string>(testMapper);
    set.add("abc");
    set.add("xyz");
    expect([...set.values()]).toEqual(["xyz"]);
});
