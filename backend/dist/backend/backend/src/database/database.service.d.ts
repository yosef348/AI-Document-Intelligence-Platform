type Row = Record<string, unknown>;
interface InsertBuilder<T extends Row> {
    values(values: Partial<T>): InsertBuilder<T>;
    returning(): Promise<T[]>;
}
interface UpdateBuilder<T extends Row> {
    set(values: Partial<T>): UpdateBuilder<T>;
    where(_cond: unknown): UpdateBuilder<T>;
    returning(): Promise<T[]>;
}
interface SelectChain<R extends Row> {
    from(_table: unknown): SelectChain<R>;
    innerJoin(_table: unknown, _on: unknown): Promise<R[]>;
    where(_cond: unknown): Promise<R[]>;
}
declare class FakeDbClient {
    insert<T extends Row>(_table: unknown): InsertBuilder<T>;
    update<T extends Row>(_table: unknown): UpdateBuilder<T>;
    select<R extends Row = Row>(_projection?: unknown): SelectChain<R>;
}
export declare class DatabaseService {
    readonly db: FakeDbClient;
}
export {};
