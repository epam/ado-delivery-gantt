/**
 * Make the keys K of the type T optional.
 *
 * e.g. MakeOptional<{ foo: string, bar: number }, "bar"> yields { foo: string, bar?: number }
 */
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * Like MakeOptional, but works over type unions.
 */
export declare type DistributiveMakeOptional<T, K extends keyof T> = T extends any ? MakeOptional<T, K> : never;
/**
 * Applies an omit over a union of types
 */
export declare type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
