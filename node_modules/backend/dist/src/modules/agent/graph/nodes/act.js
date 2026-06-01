"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actNode = actNode;
const common_1 = require("@nestjs/common");
const findings_1 = require("../../../../database/schema/findings");
const logger = new common_1.Logger('ActNode');
async function actNode(state, db, aiRunId) {
    logger.log(`Starting act node for document ${state.documentId}`);
    if (state.findings.length === 0) {
        logger.log(`Completed act node for document ${state.documentId} with no findings to persist`);
        return { status: 'completed' };
    }
    const findingRows = state.findings.map((finding) => ({
        organizationId: state.organizationId,
        documentId: state.documentId,
        aiRunId,
        findingType: finding.findingType,
        severity: finding.severity,
        confidence: finding.confidence.toString(),
        status: 'open',
        title: finding.title,
        summary: finding.summary,
        explanation: finding.explanation,
        evidence: finding.evidence,
        location: finding.location,
        promptVersion: 'v1.0',
        modelVersion: 'gpt-4o',
        modelProvider: 'openai',
    }));
    await db.db.insert(findings_1.findings).values(findingRows);
    logger.log(`Completed act node for document ${state.documentId}; persisted ${findingRows.length} findings`);
    return { status: 'completed' };
}
//# sourceMappingURL=act.js.map