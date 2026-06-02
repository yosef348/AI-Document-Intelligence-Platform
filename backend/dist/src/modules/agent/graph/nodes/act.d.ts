import { DatabaseService } from '../../../../database/database.service';
import { AgentStateType } from '../state';
export declare function actNode(state: AgentStateType, db: DatabaseService, aiRunId: string): Promise<Partial<AgentStateType>>;
