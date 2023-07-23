export default class CustomSet<K, T> implements Set<T> {
    private map: Map<K, T>;
    private mapper: (value: T) => K;

    constructor(mapper: (value: T) => K, values: Iterable<T> = []) {
        this.mapper = mapper;
        this.map = new Map([...values].map((v) => [mapper(v), v]));
    }

    add(value: T): this {
        this.map.set(this.mapper(value), value);
        return this;
    }
    clear(): void {
        this.map.clear();
    }
    delete(value: T): boolean {
        return this.map.delete(this.mapper(value));
    }
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void {
        new Set(this.values()).forEach(callbackfn, thisArg);
    }
    has(value: T): boolean {
        return this.map.has(this.mapper(value));
    }
    get size(): number {
        return this.map.size;
    }
    entries(): IterableIterator<[T, T]> {
        return new Set(this.values()).entries();
    }
    keys(): IterableIterator<T> {
        return this.map.values();
    }
    values(): IterableIterator<T> {
        return this.map.values();
    }
    [Symbol.iterator](): IterableIterator<T> {
        return this.values();
    }
    [Symbol.toStringTag] = `CustomSet`;
}
