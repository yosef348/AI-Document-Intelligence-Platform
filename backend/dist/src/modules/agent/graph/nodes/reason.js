"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reasonNode = reasonNode;
const common_1 = require("@nestjs/common");
const openai_1 = require("@langchain/openai");
const logger = new common_1.Logger('ReasonNode');
function buildPrompt(documentType, documentText) {
    const normalizedType = documentType.toLowerCase();
    if (normalizedType === 'invoice') {
        return `You are an invoice auditor. Analyze the following invoice text
and identify anomalies, errors, and concerns.
Focus on: duplicate entries, unusual amounts, missing fields,
vendor inconsistencies, and date issues.
Document text: ${documentText}
Return a JSON object with key 'analysis' containing your detailed findings.`;
    }
    return `You are a contract risk analyst. Analyze the following contract text
and identify risks, missing clauses, unusual terms, and important dates.
Focus on: termination clauses, liability limitations, payment terms,
governing law, auto-renewal clauses, and indemnification.
Document text: ${documentText}
Return a JSON object with key 'analysis' containing your detailed findings.`;
}
async function reasonNode(state, openaiApiKey) {
    logger.log(`Starting reason node for document ${state.documentId}`);
    const documentText = state.retrievedChunks
        .map((chunk) => chunk.chunkText)
        .join('\n');
    const prompt = buildPrompt(state.documentType, documentText);
    try {
        const model = new openai_1.ChatOpenAI({
            apiKey: openaiApiKey,
            model: 'gpt-4o',
            temperature: 0,
        });
        const response = await model.invoke(prompt);
        const analysisResult = typeof response.content === 'string'
            ? response.content
            : JSON.stringify(response.content);
        logger.log(`Completed reason node for document ${state.documentId}`);
        return {
            analysisResult,
            status: 'reasoned',
            error: null,
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown reason node error';
        logger.error(`Reason node failed for document ${state.documentId}: ${errorMessage}`);
        throw error instanceof Error ? error : new Error(errorMessage);
    }
}
//# sourceMappingURL=reason.js.map