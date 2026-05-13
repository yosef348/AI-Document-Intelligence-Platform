import { Injectable } from '@nestjs/common';

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

class FakeDbClient {
  insert<T extends Row>(_table: unknown): InsertBuilder<T> {
    return {
      values: () => this.insert<T>(_table),
      returning: async () => [] as T[],
    };
  }

  update<T extends Row>(_table: unknown): UpdateBuilder<T> {
    return {
      set: () => this.update<T>(_table),
      where: () => this.update<T>(_table),
      returning: async () => [] as T[],
    };
  }

  select<R extends Row = Row>(_projection?: unknown): SelectChain<R> {
    const chain: SelectChain<R> = {
      from: () => chain,
      innerJoin: async () => [] as R[],
      where: async () => [] as R[],
    };
    return chain;
  }

  // Simple passthrough transaction to satisfy service usage; not a real DB txn
  async transaction<T>(callback: (tx: FakeDbClient) => Promise<T>): Promise<T> {
    return callback(this);
  }
}

@Injectable()
export class DatabaseService {
  public readonly db = new FakeDbClient();
}
