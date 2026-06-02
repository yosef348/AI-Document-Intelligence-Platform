import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import type { Config } from '../../config/configuration';
import { DatabaseService } from '../../database/database.service';
import { aiRuns } from '../../database/schema/ai-runs';
import { buildAgentGraph } from './graph/graph';
import { AgentStateType } from './graph/state';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService<Config, true>,
  ) {}

  async analyzeDocument(
    documentId: string,
    organizationId: string,
    documentType: string,
  ): Promise<void> {
    const startedAt = new Date();
    const openaiApiKey = this.configService.get('openai.apiKey', {
      infer: true,
    });
    const initialState: AgentStateType = {
      documentId,
      organizationId,
      documentType,
      retrievedChunks: [],
      analysisResult: '',
      findings: [],
      error: null,
      status: 'running',
    };

    let aiRunId: string | null = null;
    let runtimeState: AgentStateType = initialState;

    this.logger.log(
      `Starting agent analysis for document ${documentId} in organization ${organizationId}`,
    );

    try {
      const [createdRun] = await this.db.db
        .insert(aiRuns)
        .values({
          organizationId,
          documentId,
          modelName: 'gpt-4o',
          modelProvider: 'openai',
          promptVersion: 'v1.0',
          status: 'running',
          startedAt,
          currentNode: 'retrieve',
          graphState: initialState,
        })
        .returning({ id: aiRuns.id });

      if (!createdRun) {
        throw new Error('Failed to create AI run record');
      }

      aiRunId = createdRun.id;
      const graph = buildAgentGraph(this.db, openaiApiKey, aiRunId);
      const finalState = await graph.invoke(initialState);
      runtimeState = finalState;

      await this.db.db
        .update(aiRuns)
        .set({
          status: 'completed',
          completedAt: new Date(),
          latencyMs: Date.now() - startedAt.getTime(),
          currentNode: 'completed',
          graphState: finalState,
          rawOutput: {
            analysisResult: finalState.analysisResult,
            findings: finalState.findings,
          },
          error: finalState.error ?? null,
        })
        .where(eq(aiRuns.id, aiRunId));

      this.logger.log(
        `Completed agent analysis for document ${documentId} with run ${aiRunId}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown agent execution error';
      this.logger.error(
        `Agent analysis failed for document ${documentId}: ${errorMessage}`,
      );

      if (aiRunId) {
        try {
          // Persist runtime state to preserve partial progress before error
          await this.db.db
            .update(aiRuns)
            .set({
              status: 'failed',
              completedAt: new Date(),
              latencyMs: Date.now() - startedAt.getTime(),
              currentNode: 'failed',
              graphState: runtimeState,
              error: errorMessage,
            })
            .where(eq(aiRuns.id, aiRunId));
        } catch (updateError: unknown) {
          const updateErrorMessage =
            updateError instanceof Error
              ? updateError.message
              : 'Unknown ai_runs update error';
          this.logger.error(
            `Failed to update ai_run ${aiRunId} after agent failure: ${updateErrorMessage}`,
          );
        }
      }

      throw error instanceof Error ? error : new Error(errorMessage);
    }
  }
}
