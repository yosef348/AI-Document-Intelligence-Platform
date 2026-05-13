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
  // very small in-memory store keyed by table object reference
  private readonly store = new WeakMap<object, Row[]>();

  private getTableRows<T extends Row>(table: unknown): T[] {
    const key = table as object;
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }
    return this.store.get(key)! as T[];
  }

  private generateId(): string {
    // lightweight random id; not UUID but sufficient for tests/dev
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  insert<T extends Row>(table: unknown): InsertBuilder<T> {
    const self = this;
    let pending: Partial<T> | undefined;
    return {
      values(values: Partial<T>) {
        pending = values;
        return this;
      },
      async returning(): Promise<T[]> {
        const rows = self.getTableRows<T>(table);
        const now = new Date();
        const record: T = {
          ...(pending as T),
          id: (pending as Row)?.id ?? self.generateId(),
          createdAt: (pending as Row)?.createdAt ?? now,
          updatedAt: now,
        } as unknown as T;
        rows.push(record);
        return [record];
      },
    } as InsertBuilder<T>;
  }

  update<T extends Row>(table: unknown): UpdateBuilder<T> {
    const self = this;
    let setValues: Partial<T> | undefined;
    // where is accepted for API compatibility; simple implementation ignores the condition
    return {
      set(values: Partial<T>) {
        setValues = values;
        return this;
      },
      where(_cond: unknown) {
        // condition ignored in this lightweight fake; kept for chaining
        return this;
      },
      async returning(): Promise<T[]> {
        const rows = self.getTableRows<T>(table);
        const now = new Date();
        const updated: T[] = rows.map((r) => ({ ...(r as Row), ...(setValues as Row), updatedAt: now }) as T);
        // replace contents
        rows.splice(0, rows.length, ...updated);
        return updated;
      },
    } as UpdateBuilder<T>;
  }

  select<R extends Row = Row>(projection?: unknown): SelectChain<R> {
    const self = this;
    let baseTable: unknown;
    return {
      from(table: unknown) {
        baseTable = table;
        return this;
      },
      async innerJoin(joinTable: unknown, _on: unknown): Promise<R[]> {
        // very small join implementation for organizations x memberships
        const left = self.getTableRows<Row>(baseTable);
        const right = self.getTableRows<Row>(joinTable);

        // If projection looks like { organization: organizations }
        const isOrganizationProjection =
          typeof projection === 'object' && projection !== null && 'organization' in (projection as Record<string, unknown>);

        const results: unknown[] = [];
        for (const l of left) {
          for (const r of right) {
            // match common pattern: memberships.organizationId === organizations.id
            const matches =
              (l as Row).id !== undefined && (r as Row).organizationId !== undefined && (r as Row).organizationId === (l as Row).id;
            if (matches) {
              if (isOrganizationProjection) {
                results.push({ organization: l });
              } else {
                results.push({ ...(l as Row), ...(r as Row) });
              }
            }
          }
        }
        return results as R[];
      },
      async where(_cond: unknown): Promise<R[]> {
        // return rows from the base table; condition ignored in this lightweight fake
        const rows = self.getTableRows<Row>(baseTable);
        if (projection && typeof projection === 'object' && projection !== null) {
          // shape rows according to simple projection like { organization: organizations }
          const keys = Object.keys(projection as Record<string, unknown>);
          if (keys.length === 1) {
            const key = keys[0];
            return rows.map((r) => ({ [key]: r } as unknown as R));
          }
        }
        return rows as R[];
      },
    } as SelectChain<R>;
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
