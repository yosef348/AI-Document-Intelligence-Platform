import { END, StateGraph } from '@langchain/langgraph';
import { DatabaseService } from '../../../database/database.service';
import { actNode } from './nodes/act';
import { classifyNode } from './nodes/classify';
import { reasonNode } from './nodes/reason';
import { retrieveNode } from './nodes/retrieve';
import { AgentState } from './state';

export function buildAgentGraph(
  db: DatabaseService,
  openaiApiKey: string,
  aiRunId: string,
) {
  const graph = new StateGraph(AgentState)
    .addNode('retrieve', (state) => retrieveNode(state, db))
    .addNode('reason', (state) => reasonNode(state, openaiApiKey))
    .addNode('classify', (state) => classifyNode(state, openaiApiKey))
    .addNode('act', (state) => actNode(state, db, aiRunId))
    .addEdge('__start__', 'retrieve')
    .addEdge('retrieve', 'reason')
    .addEdge('reason', 'classify')
    .addEdge('classify', 'act')
    .addEdge('act', END);

  return graph.compile();
}
