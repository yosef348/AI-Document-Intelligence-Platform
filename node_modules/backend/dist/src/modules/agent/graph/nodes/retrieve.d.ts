import { DatabaseService } from '../../../../database/database.service';
import { AgentStateType } from '../state';
export declare function retrieveNode(state: AgentStateType, db: DatabaseService): Promise<Partial<AgentStateType>>;
