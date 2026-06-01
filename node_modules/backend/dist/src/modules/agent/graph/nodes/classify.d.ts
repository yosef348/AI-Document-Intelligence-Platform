import { AgentStateType } from '../state';
export declare function classifyNode(state: AgentStateType, openaiApiKey: string): Promise<Partial<AgentStateType>>;
