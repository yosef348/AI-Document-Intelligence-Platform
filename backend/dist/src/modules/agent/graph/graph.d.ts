import { DatabaseService } from '../../../database/database.service';
export declare function buildAgentGraph(db: DatabaseService, openaiApiKey: string, aiRunId: string): import("@langchain/langgraph").CompiledStateGraph<{
    documentId: string;
    organizationId: string;
    documentType: string;
    retrievedChunks: import("./state").RetrievedChunk[];
    analysisResult: string;
    findings: import("./state").AgentFinding[];
    error: string | null;
    status: string;
}, {
    documentId?: string | undefined;
    organizationId?: string | undefined;
    documentType?: string | undefined;
    retrievedChunks?: import("./state").RetrievedChunk[] | undefined;
    analysisResult?: string | undefined;
    findings?: import("./state").AgentFinding[] | undefined;
    error?: string | null | undefined;
    status?: string | undefined;
}, "__start__" | "retrieve" | "reason" | "classify" | "act", {
    documentId: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    organizationId: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    documentType: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    retrievedChunks: {
        (annotation: import("@langchain/langgraph").SingleReducer<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[]>): import("@langchain/langgraph").BaseChannel<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[] | import("@langchain/langgraph").OverwriteValue<import("./state").RetrievedChunk[]>, unknown>;
        (): import("@langchain/langgraph").LastValue<import("./state").RetrievedChunk[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    analysisResult: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    findings: {
        (annotation: import("@langchain/langgraph").SingleReducer<import("./state").AgentFinding[], import("./state").AgentFinding[]>): import("@langchain/langgraph").BaseChannel<import("./state").AgentFinding[], import("./state").AgentFinding[] | import("@langchain/langgraph").OverwriteValue<import("./state").AgentFinding[]>, unknown>;
        (): import("@langchain/langgraph").LastValue<import("./state").AgentFinding[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    error: {
        (annotation: import("@langchain/langgraph").SingleReducer<string | null, string | null>): import("@langchain/langgraph").BaseChannel<string | null, string | import("@langchain/langgraph").OverwriteValue<string | null> | null, unknown>;
        (): import("@langchain/langgraph").LastValue<string | null>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    status: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
}, {
    documentId: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    organizationId: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    documentType: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    retrievedChunks: {
        (annotation: import("@langchain/langgraph").SingleReducer<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[]>): import("@langchain/langgraph").BaseChannel<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[] | import("@langchain/langgraph").OverwriteValue<import("./state").RetrievedChunk[]>, unknown>;
        (): import("@langchain/langgraph").LastValue<import("./state").RetrievedChunk[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    analysisResult: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    findings: {
        (annotation: import("@langchain/langgraph").SingleReducer<import("./state").AgentFinding[], import("./state").AgentFinding[]>): import("@langchain/langgraph").BaseChannel<import("./state").AgentFinding[], import("./state").AgentFinding[] | import("@langchain/langgraph").OverwriteValue<import("./state").AgentFinding[]>, unknown>;
        (): import("@langchain/langgraph").LastValue<import("./state").AgentFinding[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    error: {
        (annotation: import("@langchain/langgraph").SingleReducer<string | null, string | null>): import("@langchain/langgraph").BaseChannel<string | null, string | import("@langchain/langgraph").OverwriteValue<string | null> | null, unknown>;
        (): import("@langchain/langgraph").LastValue<string | null>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    status: {
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
        (): import("@langchain/langgraph").LastValue<string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
}, import("@langchain/langgraph").StateDefinition, {
    retrieve: Partial<import("@langchain/langgraph").StateType<{
        documentId: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        organizationId: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        documentType: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        retrievedChunks: {
            (annotation: import("@langchain/langgraph").SingleReducer<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[]>): import("@langchain/langgraph").BaseChannel<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[] | import("@langchain/langgraph").OverwriteValue<import("./state").RetrievedChunk[]>, unknown>;
            (): import("@langchain/langgraph").LastValue<import("./state").RetrievedChunk[]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        analysisResult: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        findings: {
            (annotation: import("@langchain/langgraph").SingleReducer<import("./state").AgentFinding[], import("./state").AgentFinding[]>): import("@langchain/langgraph").BaseChannel<import("./state").AgentFinding[], import("./state").AgentFinding[] | import("@langchain/langgraph").OverwriteValue<import("./state").AgentFinding[]>, unknown>;
            (): import("@langchain/langgraph").LastValue<import("./state").AgentFinding[]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        error: {
            (annotation: import("@langchain/langgraph").SingleReducer<string | null, string | null>): import("@langchain/langgraph").BaseChannel<string | null, string | import("@langchain/langgraph").OverwriteValue<string | null> | null, unknown>;
            (): import("@langchain/langgraph").LastValue<string | null>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        status: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
    }>>;
    reason: Partial<import("@langchain/langgraph").StateType<{
        documentId: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        organizationId: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        documentType: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        retrievedChunks: {
            (annotation: import("@langchain/langgraph").SingleReducer<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[]>): import("@langchain/langgraph").BaseChannel<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[] | import("@langchain/langgraph").OverwriteValue<import("./state").RetrievedChunk[]>, unknown>;
            (): import("@langchain/langgraph").LastValue<import("./state").RetrievedChunk[]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        analysisResult: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        findings: {
            (annotation: import("@langchain/langgraph").SingleReducer<import("./state").AgentFinding[], import("./state").AgentFinding[]>): import("@langchain/langgraph").BaseChannel<import("./state").AgentFinding[], import("./state").AgentFinding[] | import("@langchain/langgraph").OverwriteValue<import("./state").AgentFinding[]>, unknown>;
            (): import("@langchain/langgraph").LastValue<import("./state").AgentFinding[]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        error: {
            (annotation: import("@langchain/langgraph").SingleReducer<string | null, string | null>): import("@langchain/langgraph").BaseChannel<string | null, string | import("@langchain/langgraph").OverwriteValue<string | null> | null, unknown>;
            (): import("@langchain/langgraph").LastValue<string | null>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        status: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
    }>>;
    classify: Partial<import("@langchain/langgraph").StateType<{
        documentId: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        organizationId: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        documentType: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        retrievedChunks: {
            (annotation: import("@langchain/langgraph").SingleReducer<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[]>): import("@langchain/langgraph").BaseChannel<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[] | import("@langchain/langgraph").OverwriteValue<import("./state").RetrievedChunk[]>, unknown>;
            (): import("@langchain/langgraph").LastValue<import("./state").RetrievedChunk[]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        analysisResult: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        findings: {
            (annotation: import("@langchain/langgraph").SingleReducer<import("./state").AgentFinding[], import("./state").AgentFinding[]>): import("@langchain/langgraph").BaseChannel<import("./state").AgentFinding[], import("./state").AgentFinding[] | import("@langchain/langgraph").OverwriteValue<import("./state").AgentFinding[]>, unknown>;
            (): import("@langchain/langgraph").LastValue<import("./state").AgentFinding[]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        error: {
            (annotation: import("@langchain/langgraph").SingleReducer<string | null, string | null>): import("@langchain/langgraph").BaseChannel<string | null, string | import("@langchain/langgraph").OverwriteValue<string | null> | null, unknown>;
            (): import("@langchain/langgraph").LastValue<string | null>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        status: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
    }>>;
    act: Partial<import("@langchain/langgraph").StateType<{
        documentId: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        organizationId: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        documentType: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        retrievedChunks: {
            (annotation: import("@langchain/langgraph").SingleReducer<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[]>): import("@langchain/langgraph").BaseChannel<import("./state").RetrievedChunk[], import("./state").RetrievedChunk[] | import("@langchain/langgraph").OverwriteValue<import("./state").RetrievedChunk[]>, unknown>;
            (): import("@langchain/langgraph").LastValue<import("./state").RetrievedChunk[]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        analysisResult: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        findings: {
            (annotation: import("@langchain/langgraph").SingleReducer<import("./state").AgentFinding[], import("./state").AgentFinding[]>): import("@langchain/langgraph").BaseChannel<import("./state").AgentFinding[], import("./state").AgentFinding[] | import("@langchain/langgraph").OverwriteValue<import("./state").AgentFinding[]>, unknown>;
            (): import("@langchain/langgraph").LastValue<import("./state").AgentFinding[]>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        error: {
            (annotation: import("@langchain/langgraph").SingleReducer<string | null, string | null>): import("@langchain/langgraph").BaseChannel<string | null, string | import("@langchain/langgraph").OverwriteValue<string | null> | null, unknown>;
            (): import("@langchain/langgraph").LastValue<string | null>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
        status: {
            (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
            (): import("@langchain/langgraph").LastValue<string>;
            Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
        };
    }>>;
}, unknown, unknown, []>;
