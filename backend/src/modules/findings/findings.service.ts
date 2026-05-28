import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { findings, type Finding } from '../../database/schema/findings';

export interface FindingsFilter {
  documentId?: string;
  severity?: string;
  status?: string;
}

export interface FindingsStats {
  total: number;
  open: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

@Injectable()
export class FindingsService {
  private readonly logger = new Logger(FindingsService.name);

  constructor(private readonly db: DatabaseService) {}

  async findAll(
    organizationId: string,
    filters?: FindingsFilter,
  ): Promise<Finding[]> {
    const whereClause = (qb: typeof findings) => {
      const clauses: Array<any> = [
        eq(findings.organizationId, organizationId),
        isNull(findings.deletedAt),
      ];
      if (filters?.documentId)
        clauses.push(eq(findings.documentId, filters.documentId));
      if (filters?.severity) clauses.push(eq(findings.severity, filters.severity));
      if (filters?.status) clauses.push(eq(findings.status, filters.status));
      return and(...clauses);
    };

    const rows = await this.db.db
      .select()
      .from(findings)
      .where(whereClause(findings))
      .orderBy(
        // Order by severity: critical > high > medium > low > info
        sql`CASE 
          WHEN ${findings.severity} = 'critical' THEN 1
          WHEN ${findings.severity} = 'high' THEN 2
          WHEN ${findings.severity} = 'medium' THEN 3
          WHEN ${findings.severity} = 'low' THEN 4
          WHEN ${findings.severity} = 'info' THEN 5
          ELSE 6
        END ASC`,
        desc(findings.createdAt),
      );

    return rows as Finding[];
  }

  async findById(id: string, organizationId: string): Promise<Finding> {
    const row = await this.db.db
      .select()
      .from(findings)
      .where(
        and(
          eq(findings.id, id),
          eq(findings.organizationId, organizationId),
          isNull(findings.deletedAt),
        ),
      )
      .limit(1)
      .then((r) => r[0]);

    if (!row) {
      throw new NotFoundException('Finding not found');
    }
    return row as Finding;
  }

  async updateStatus(
    id: string,
    organizationId: string,
    userId: string,
    status: string,
  ): Promise<Finding> {
    const existing = await this.db.db
      .select()
      .from(findings)
      .where(
        and(
          eq(findings.id, id),
          eq(findings.organizationId, organizationId),
          isNull(findings.deletedAt),
        ),
      )
      .limit(1)
      .then((r) => r[0]);

    if (!existing) {
      throw new NotFoundException('Finding not found');
    }

    const updateData: Record<string, unknown> = { status };

    if (status === 'acknowledged') {
      updateData.acknowledgedBy = userId;
      updateData.acknowledgedAt = new Date();
    }
    if (status === 'resolved') {
      updateData.resolvedBy = userId;
      updateData.resolvedAt = new Date();
    }

    const updated = await this.db.db
      .update(findings)
      .set(updateData)
      .where(eq(findings.id, id))
      .returning()
      .then((r) => r[0]);

    return updated as Finding;
  }

  async getStats(organizationId: string): Promise<FindingsStats> {
    // Single grouped query to get all stats
    const statsRows = await this.db.db.execute(
      sql`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'open') as open_count,
          COUNT(*) FILTER (WHERE severity = 'critical') as critical_count,
          COUNT(*) FILTER (WHERE severity = 'high') as high_count,
          COUNT(*) FILTER (WHERE severity = 'medium') as medium_count,
          COUNT(*) FILTER (WHERE severity = 'low') as low_count,
          COUNT(*) FILTER (WHERE severity = 'info') as info_count,
          COUNT(*) as total_count
        FROM findings
        WHERE organization_id = ${organizationId}::uuid AND deleted_at IS NULL
      `,
    );

    const row = (statsRows as unknown as Array<{
      open_count: number;
      critical_count: number;
      high_count: number;
      medium_count: number;
      low_count: number;
      info_count: number;
      total_count: number;
    }>)[0];

    return {
      total: row?.total_count ?? 0,
      open: row?.open_count ?? 0,
      critical: row?.critical_count ?? 0,
      high: row?.high_count ?? 0,
      medium: row?.medium_count ?? 0,
      low: row?.low_count ?? 0,
      info: row?.info_count ?? 0,
    };
  }
}
