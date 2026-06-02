"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentState = void 0;
const langgraph_1 = require("@langchain/langgraph");
exports.AgentState = langgraph_1.Annotation.Root({
    documentId: (langgraph_1.Annotation),
    organizationId: (langgraph_1.Annotation),
    documentType: (langgraph_1.Annotation),
    retrievedChunks: (langgraph_1.Annotation),
    analysisResult: (langgraph_1.Annotation),
    findings: (langgraph_1.Annotation),
    error: (langgraph_1.Annotation),
    status: (langgraph_1.Annotation),
});
//# sourceMappingURL=state.js.map