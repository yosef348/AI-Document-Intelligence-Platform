"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AgentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const drizzle_orm_1 = require("drizzle-orm");
const database_service_1 = require("../../database/database.service");
const ai_runs_1 = require("../../database/schema/ai-runs");
const graph_1 = require("./graph/graph");
let AgentService = AgentService_1 = class AgentService {
    db;
    configService;
    logger = new common_1.Logger(AgentService_1.name);
    constructor(db, configService) {
        this.db = db;
        this.configService = configService;
    }
    async analyzeDocument(documentId, organizationId, documentType) {
        const startedAt = new Date();
        const openaiApiKey = this.configService.get('openai.apiKey', {
            infer: true,
        });
        const initialState = {
            documentId,
            organizationId,
            documentType,
            retrievedChunks: [],
            analysisResult: '',
            findings: [],
            error: null,
            status: 'running',
        };
        let aiRunId = null;
        let runtimeState = initialState;
        this.logger.log(`Starting agent analysis for document ${documentId} in organization ${organizationId}`);
        try {
            const [createdRun] = await this.db.db
                .insert(ai_runs_1.aiRuns)
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
                .returning({ id: ai_runs_1.aiRuns.id });
            if (!createdRun) {
                throw new Error('Failed to create AI run record');
            }
            aiRunId = createdRun.id;
            const graph = (0, graph_1.buildAgentGraph)(this.db, openaiApiKey, aiRunId);
            const finalState = await graph.invoke(initialState);
            runtimeState = finalState;
            await this.db.db
                .update(ai_runs_1.aiRuns)
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
                .where((0, drizzle_orm_1.eq)(ai_runs_1.aiRuns.id, aiRunId));
            this.logger.log(`Completed agent analysis for document ${documentId} with run ${aiRunId}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown agent execution error';
            this.logger.error(`Agent analysis failed for document ${documentId}: ${errorMessage}`);
            if (aiRunId) {
                try {
                    await this.db.db
                        .update(ai_runs_1.aiRuns)
                        .set({
                        status: 'failed',
                        completedAt: new Date(),
                        latencyMs: Date.now() - startedAt.getTime(),
                        currentNode: 'failed',
                        graphState: runtimeState,
                        error: errorMessage,
                    })
                        .where((0, drizzle_orm_1.eq)(ai_runs_1.aiRuns.id, aiRunId));
                }
                catch (updateError) {
                    const updateErrorMessage = updateError instanceof Error
                        ? updateError.message
                        : 'Unknown ai_runs update error';
                    this.logger.error(`Failed to update ai_run ${aiRunId} after agent failure: ${updateErrorMessage}`);
                }
            }
            throw error instanceof Error ? error : new Error(errorMessage);
        }
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = AgentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        config_1.ConfigService])
], AgentService);
//# sourceMappingURL=agent.service.js.map