"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAgentGraph = buildAgentGraph;
const langgraph_1 = require("@langchain/langgraph");
const act_1 = require("./nodes/act");
const classify_1 = require("./nodes/classify");
const reason_1 = require("./nodes/reason");
const retrieve_1 = require("./nodes/retrieve");
const state_1 = require("./state");
function buildAgentGraph(db, openaiApiKey, aiRunId) {
    const graph = new langgraph_1.StateGraph(state_1.AgentState)
        .addNode('retrieve', (state) => (0, retrieve_1.retrieveNode)(state, db))
        .addNode('reason', (state) => (0, reason_1.reasonNode)(state, openaiApiKey))
        .addNode('classify', (state) => (0, classify_1.classifyNode)(state, openaiApiKey))
        .addNode('act', (state) => (0, act_1.actNode)(state, db, aiRunId))
        .addEdge('__start__', 'retrieve')
        .addEdge('retrieve', 'reason')
        .addEdge('reason', 'classify')
        .addEdge('classify', 'act')
        .addEdge('act', langgraph_1.END);
    return graph.compile();
}
//# sourceMappingURL=graph.js.map