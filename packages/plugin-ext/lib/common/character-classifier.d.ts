/**
 * A fast character classifier that uses a compact array for ASCII values.
 */
export declare class CharacterClassifier<T extends number> {
    /**
     * Maintain a compact (fully initialized ASCII map for quickly classifying ASCII characters - used more often in code).
     */
    protected _asciiMap: Uint8Array;
    /**
     * The entire map (sparse array).
     */
    protected _map: Map<number, number>;
    protected _defaultValue: number;
    constructor(_defaultValue: T);
    private static _createAsciiMap;
    set(charCode: number, _value: T): void;
    get(charCode: number): T;
}
//# sourceMappingURL=character-classifier.d.ts.map